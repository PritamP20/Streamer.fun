const dotenv = require('dotenv');
dotenv.config();

const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { AgentExecutor, createToolCallingAgent } = require('langchain/agents');
const { Client, PrivateKey, AccountInfoQuery } = require('@hashgraph/sdk');
const { HederaLangchainToolkit, coreQueriesPlugin } = require('hedera-agent-kit');
const { DynamicTool } = require('@langchain/core/tools');
const { createLLM, createEmbeddings, createRAGLLM } = require('../utils/llm-factory');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');

class RAGAgent {
  constructor() {
    this.vectorStore = null;
    this.llm = null;
    this.embeddings = null;
    this.client = null;
    this.hederaIndicator = '❌';
  }

  async initialize() {
    console.log('🔗 Initializing Hedera RAG Agent...\n');

    // Initialize AI models
    this.llm = createRAGLLM(); // Use restrictive RAG-specific LLM
    this.embeddings = createEmbeddings();

    // Initialize Hedera client
    this.client = Client.forTestnet().setOperator(
      process.env.HEDERA_ACCOUNT_ID,
      PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY),
    );

    // Check Hedera connection
    await this.checkHederaConnection();

    // Initialize knowledge base
    await this.initializeKnowledgeBase();

    console.log('✅ RAG Agent initialized successfully!\n');
  }

  async checkHederaConnection() {
    try {
      const accountInfo = await new AccountInfoQuery()
        .setAccountId(process.env.HEDERA_ACCOUNT_ID)
        .execute(this.client);
      
      this.hederaIndicator = '✅';
      console.log(`✅ Connected to Hedera Network`);
      console.log(`📊 Account: ${process.env.HEDERA_ACCOUNT_ID}`);
      console.log(`💰 Balance: ${accountInfo.balance.toString()} HBAR\n`);
    } catch (error) {
      this.hederaIndicator = '❌';
      console.log(`❌ Failed to connect to Hedera: ${error.message}\n`);
    }
  }

  async initializeKnowledgeBase() {
    try {
      console.log('📚 Initializing knowledge base...');
      
      // Read knowledge base file
      const knowledgePath = path.join(__dirname, '../knowledge/sample-knowledge.txt');
      const knowledgeText = await fs.readFile(knowledgePath, 'utf-8');
      
      // Split text into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      
      const docs = await textSplitter.createDocuments([knowledgeText]);
      
      // Store documents for simple text search (fallback when embeddings fail)
      this.knowledgeChunks = docs.map(doc => doc.pageContent);
      
      try {
        // Try to create vector store with embeddings
        this.vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);
        console.log(`✅ Knowledge base loaded with ${docs.length} chunks (with embeddings)\n`);
      } catch (embeddingError) {
        console.log(`⚠️ Embeddings failed (${embeddingError.message}), using text search fallback\n`);
        this.vectorStore = null;
      }
    } catch (error) {
      console.error('❌ Failed to initialize knowledge base:', error.message);
      throw error;
    }
  }

  createRAGTool() {
    return new DynamicTool({
      name: 'knowledge_search',
      description: 'Search the knowledge base for relevant information to answer questions about Hedera Hashgraph. Only use this tool for questions related to Hedera, blockchain, or distributed ledger technology. Returns "NO_MATCH" if no relevant information is found.',
      func: async (input) => {
        try {
          let foundResults = false;
          let relevantInfo = '';
          
          if (this.vectorStore) {
            // Use vector search if available
            const results = await this.vectorStore.similaritySearch(input, 3);
            if (results.length > 0) {
              relevantInfo = results.map(doc => doc.pageContent).join('\n\n');
              foundResults = true;
            }
          }
          
          // Fallback to simple text search - more strict matching
          if (!foundResults && this.knowledgeChunks) {
            const query = input.toLowerCase();
            const queryWords = query.split(' ').filter(word => word.length > 2);
            
            const relevantChunks = this.knowledgeChunks.filter(chunk => {
              const chunkLower = chunk.toLowerCase();
              
              // Check for exact phrase match first
              if (chunkLower.includes(query)) {
                return true;
              }
              
              // Check for multiple word matches (at least 2 words must match)
              const matchingWords = queryWords.filter(word => 
                chunkLower.includes(word)
              );
              
              return matchingWords.length >= Math.min(2, queryWords.length);
            });
            
            if (relevantChunks.length > 0) {
              relevantInfo = relevantChunks.slice(0, 2).join('\n\n');
              foundResults = true;
            }
          }
          
          if (foundResults) {
            return `KNOWLEDGE_BASE_INFO: ${relevantInfo}`;
          } else {
            return 'NO_MATCH';
          }
        } catch (error) {
          console.error('Error in knowledge search:', error);
          return 'NO_MATCH';
        }
      }
    });
  }

  createRelevanceTool() {
    return new DynamicTool({
      name: 'check_relevance',
      description: 'Check if a question or sentence is relevant to Hedera Hashgraph, blockchain technology, or distributed ledger systems.',
      func: async (input) => {
        try {
          const relevancePrompt = ChatPromptTemplate.fromMessages([
            ['system', `You are a relevance checker. Determine if the input is related to:
            
            - Hedera Hashgraph
            - Blockchain technology
            - Distributed ledger systems
            - Cryptocurrency (HBAR)
            - Smart contracts
            - Consensus algorithms
            - Network architecture
            - Development tools
            - Use cases for blockchain
            
            Respond with ONLY "Relevant" or "Not Relevant".`],
            ['human', 'Check relevance: {input}']
          ]);

          const chain = relevancePrompt.pipe(this.llm);
          const response = await chain.invoke({ input });
          
          const result = response.content.toString().trim().toLowerCase();
          return result.includes('relevant') ? 'Relevant' : 'Not Relevant';
        } catch (error) {
          console.error('Error in relevance check:', error);
          return 'Not Relevant';
        }
      }
    });
  }

  async start() {
    const hederaAgentToolkit = new HederaLangchainToolkit({
      client: this.client,
      configuration: {
        plugins: [coreQueriesPlugin]
      },
    });

    // Create tools
    const ragTool = this.createRAGTool();
    const relevanceTool = this.createRelevanceTool();
    const hederaTools = hederaAgentToolkit.getTools();
    const tools = [...hederaTools, ragTool, relevanceTool];

    // Create prompt for RAG agent
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a RAG (Retrieval-Augmented Generation) agent that ONLY answers questions based on the provided knowledge base text file about Hedera Hashgraph.

      MANDATORY WORKFLOW - NO EXCEPTIONS:
      1. ALWAYS use the check_relevance tool first to verify the question is about Hedera/blockchain
      2. If NOT relevant, respond: "I can only answer questions about Hedera Hashgraph, blockchain technology, and related topics. Please ask a relevant question."
      3. If relevant, ALWAYS use the knowledge_search tool to find information
      4. If knowledge_search returns "NO_MATCH", respond: "I don't have that information in my knowledge base about Hedera Hashgraph."
      5. If knowledge_search returns "KNOWLEDGE_BASE_INFO: [content]", you MUST:
         - ONLY use the information provided in that content
         - DO NOT add any external knowledge
         - DO NOT make assumptions
         - DO NOT provide information not explicitly stated in the content
         - If the content doesn't fully answer the question, say: "Based on my knowledge base, I can only provide partial information: [quote the relevant parts]"
      
      STRICT RESTRICTIONS:
      - You have NO knowledge outside of what's in the knowledge base file
      - You CANNOT use your training data or external knowledge
      - You CANNOT infer or assume anything not explicitly stated
      - You CANNOT provide examples or additional context not in the file
      - You MUST quote or paraphrase only from the provided knowledge base content
      
      You are connected to the Hedera network for transparency.`],
      ['placeholder', '{chat_history}'],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    // Create agent
    const agent = createToolCallingAgent({
      llm: this.llm,
      tools,
      prompt,
    });
    
    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: false,
      maxIterations: 2, // Strict limit to prevent overthinking
      returnIntermediateSteps: false,
      handleParsingErrors: true,
    });

    console.log('🤖 RAG Agent Ready!');
    console.log('📝 Ask me questions about Hedera Hashgraph, blockchain technology, or related topics.');
    console.log('💡 Type "exit" to quit, "status" to check Hedera connection\n');

    // Create readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = () => {
      rl.question(`${this.hederaIndicator} Hedera RAG Agent > `, async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log('👋 Goodbye!');
          rl.close();
          return;
        }
        
        if (input.toLowerCase() === 'status') {
          await this.checkHederaConnection();
          askQuestion();
          return;
        }
        
        if (input.trim() === '') {
          askQuestion();
          return;
        }
        
        try {
          console.log('🔍 Processing...');
          const response = await agentExecutor.invoke({ input: input.trim() });
          console.log(`📋 Answer: ${response.output}\n`);
        } catch (error) {
          console.error(`❌ Error: ${error.message}\n`);
        }
        
        askQuestion();
      });
    };

    askQuestion();
  }
}

async function main() {
  console.clear();
  
  const ragAgent = new RAGAgent();
  await ragAgent.initialize();
  await ragAgent.start();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RAGAgent, main };
