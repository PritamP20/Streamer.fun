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

class AdvertisementAgent {
  constructor() {
    this.vectorStore = null;
    this.llm = null;
    this.embeddings = null;
    this.client = null;
    this.hederaIndicator = '❌';
    this.adChunks = [];
    this.adInterval = null;
    this.adsPerHour = 2; // Default: 2 ads per hour
    this.isRunning = false;
    this.adCounter = 0;
  }

  async initialize() {
    console.log('🔗 Initializing Hedera Advertisement Agent...\n');

    // Initialize AI models
    this.llm = createRAGLLM(); // Use restrictive LLM for consistent ads
    this.embeddings = createEmbeddings();

    // Initialize Hedera client
    this.client = Client.forTestnet().setOperator(
      process.env.HEDERA_ACCOUNT_ID,
      PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY),
    );

    // Check Hedera connection
    await this.checkHederaConnection();

    // Initialize advertisement knowledge base
    await this.initializeAdKnowledgeBase();

    console.log('✅ Advertisement Agent initialized successfully!\n');
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

  async initializeAdKnowledgeBase() {
    try {
      console.log('📚 Initializing advertisement knowledge base...');
      
      // Read advertisement knowledge base file
      const adPath = path.join(__dirname, '../knowledge/advertisement-knowledge.txt');
      const adText = await fs.readFile(adPath, 'utf-8');
      
      // Split text into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 150,
      });
      
      const docs = await textSplitter.createDocuments([adText]);
      
      // Store documents for ad generation
      this.adChunks = docs.map(doc => doc.pageContent);
      
      try {
        // Try to create vector store with embeddings
        this.vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);
        console.log(`✅ Advertisement knowledge base loaded with ${docs.length} chunks (with embeddings)\n`);
      } catch (embeddingError) {
        console.log(`⚠️ Embeddings failed (${embeddingError.message}), using text search fallback\n`);
        this.vectorStore = null;
      }
    } catch (error) {
      console.error('❌ Failed to initialize advertisement knowledge base:', error.message);
      throw error;
    }
  }


  async generateAd() {
    try {
      // Get random content from knowledge base
      let adContent = '';
      
      if (this.adChunks.length > 0) {
        // Randomly select 1-2 chunks for variety
        const shuffled = [...this.adChunks].sort(() => 0.5 - Math.random());
        const numChunks = Math.floor(Math.random() * 2) + 1; // 1 or 2 chunks
        adContent = shuffled.slice(0, numChunks).join('\n\n');
      }

      if (!adContent) {
        return 'No advertisement content available.';
      }

      // Generate random links
      const links = [
        'https://hedera.com/developers',
        'https://hedera.com/use-cases',
        'https://hedera.com/ecosystem',
        'https://hedera.com/learn',
        'https://hedera.com/community',
        'https://hedera.com/network',
        'https://hedera.com/technology'
      ];
      
      const randomLink = links[Math.floor(Math.random() * links.length)];
      
      // Create simple, direct prompt for LLM
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', `You are creating a live stream advertisement for Hedera Hashgraph. 
        
        Create a short, engaging advertisement (2-3 sentences max) based on the provided content.
        Make it exciting and suitable for live stream chat.
        Include emojis and make it sound promotional but not spammy.
        Focus on the most exciting benefits mentioned in the content.`],
        ['human', 'Create an advertisement based on this content: {content}']
      ]);

      const chain = prompt.pipe(this.llm);
      const response = await chain.invoke({ content: adContent });
      
      const adText = response.content.toString().trim();
      
      // Format as chat message
      const chatMessage = `🎯 **Hedera Advertisement** 🎯\n\n${adText}\n\n🔗 Learn more: ${randomLink}\n\n#Hedera #Blockchain #HBAR`;
      
      this.adCounter++;
      return chatMessage;
    } catch (error) {
      console.error('Error generating ad:', error);
      return 'Error generating advertisement.';
    }
  }

  startAdSchedule() {
    if (this.isRunning) {
      console.log('⚠️ Advertisement schedule is already running.\n');
      return;
    }

    this.isRunning = true;
    const intervalMs = (60 * 60 * 1000) / this.adsPerHour; // Convert to milliseconds
    
    console.log(`🚀 Starting advertisement schedule: ${this.adsPerHour} ads per hour (every ${Math.round(intervalMs / 1000 / 60)} minutes)\n`);
    
    this.adInterval = setInterval(async () => {
      try {
        console.log('📢 Generating new advertisement...');
        const ad = await this.generateAd();
        console.log(`\n🎯 ADVERTISEMENT #${this.adCounter}:\n${ad}\n`);
        console.log('─'.repeat(50));
      } catch (error) {
        console.error('❌ Error generating advertisement:', error.message);
      }
    }, intervalMs);
  }

  stopAdSchedule() {
    if (this.adInterval) {
      clearInterval(this.adInterval);
      this.adInterval = null;
      this.isRunning = false;
      console.log('⏹️ Advertisement schedule stopped.\n');
    } else {
      console.log('⚠️ No advertisement schedule is currently running.\n');
    }
  }

  async start() {
    console.log('🤖 Advertisement Agent Ready!');
    console.log('📝 Commands:');
    console.log('  - "start [number]" - Start ad schedule (e.g., "start 3" for 3 ads per hour)');
    console.log('  - "stop" - Stop ad schedule');
    console.log('  - "generate" - Generate a single ad');
    console.log('  - "status" - Check Hedera connection');
    console.log('  - "exit" - Quit\n');

    // Create readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askCommand = () => {
      rl.question(`${this.hederaIndicator} Hedera Ad Agent > `, async (input) => {
        const [command, ...args] = input.trim().split(' ');
        
        switch (command.toLowerCase()) {
          case 'start':
            const adsPerHour = parseInt(args[0]) || 2;
            if (adsPerHour < 1 || adsPerHour > 10) {
              console.log('❌ Please enter a number between 1 and 10 for ads per hour.\n');
            } else {
              this.adsPerHour = adsPerHour;
              this.startAdSchedule();
            }
            askCommand();
            break;
            
          case 'stop':
            this.stopAdSchedule();
            askCommand();
            break;
            
          case 'generate':
            try {
              console.log('📢 Generating advertisement...');
              const ad = await this.generateAd();
              console.log(`\n🎯 ADVERTISEMENT:\n${ad}\n`);
            } catch (error) {
              console.error(`❌ Error: ${error.message}\n`);
            }
            askCommand();
            break;
            
          case 'status':
            await this.checkHederaConnection();
            askCommand();
            break;
            
          case 'exit':
            this.stopAdSchedule();
            console.log('👋 Goodbye!');
            rl.close();
            break;
            
          default:
            console.log('❌ Unknown command. Use: start, stop, generate, status, or exit\n');
            askCommand();
            break;
        }
      });
    };

    askCommand();
  }
}

async function main() {
  console.clear();
  
  const adAgent = new AdvertisementAgent();
  await adAgent.initialize();
  await adAgent.start();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { AdvertisementAgent, main };
