// Choose your AI provider
function createLLM() {
  if (process.env.OPENAI_API_KEY) {
    const { ChatOpenAI } = require('@langchain/openai');
    return new ChatOpenAI({ 
      model: 'gpt-4o-mini',
      temperature: 0.1, // Low temperature for more deterministic responses
      maxTokens: 500, // Limit response length
    });
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    const { ChatAnthropic } = require('@langchain/anthropic');
    return new ChatAnthropic({ model: 'claude-3-haiku-20240307' });
  }
  
  if (process.env.GROQ_API_KEY) {
    const { ChatGroq } = require('@langchain/groq');
    return new ChatGroq({ model: 'llama3-8b-8192' });
  }
  
  try {
    const { ChatOllama } = require('@langchain/ollama');
    return new ChatOllama({ 
      model: 'llama3.2',
      baseUrl: 'http://localhost:11434'
    });
  } catch (e) {
    console.error('No AI provider configured. Please set an API key in .env');
    process.exit(1);
  }
}

// Create embeddings model
function createEmbeddings() {
  if (process.env.OPENAI_API_KEY) {
    const { OpenAIEmbeddings } = require('@langchain/openai');
    return new OpenAIEmbeddings({ model: 'text-embedding-3-small' });
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    const { CohereEmbeddings } = require('@langchain/cohere');
    return new CohereEmbeddings({ model: 'embed-english-v3.0' });
  }
  
  // Fallback to OpenAI if no specific embedding provider
  try {
    const { OpenAIEmbeddings } = require('@langchain/openai');
    return new OpenAIEmbeddings({ model: 'text-embedding-3-small' });
  } catch (e) {
    console.error('No embedding provider configured. Please set an API key in .env');
    process.exit(1);
  }
}

// Create LLM specifically for RAG (more restrictive)
function createRAGLLM() {
  if (process.env.OPENAI_API_KEY) {
    const { ChatOpenAI } = require('@langchain/openai');
    return new ChatOpenAI({ 
      model: 'gpt-4o-mini',
      temperature: 0.0, // Zero temperature for most deterministic responses
      maxTokens: 300, // Shorter responses to prevent rambling
    });
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    const { ChatAnthropic } = require('@langchain/anthropic');
    return new ChatAnthropic({ 
      model: 'claude-3-haiku-20240307',
      temperature: 0.0,
      max_tokens: 300,
    });
  }
  
  if (process.env.GROQ_API_KEY) {
    const { ChatGroq } = require('@langchain/groq');
    return new ChatGroq({ 
      model: 'llama3-8b-8192',
      temperature: 0.0,
      max_tokens: 300,
    });
  }
  
  try {
    const { ChatOllama } = require('@langchain/ollama');
    return new ChatOllama({ 
      model: 'llama3.2',
      baseUrl: 'http://localhost:11434',
      temperature: 0.0,
    });
  } catch (e) {
    console.error('No AI provider configured. Please set an API key in .env');
    process.exit(1);
  }
}

module.exports = { createLLM, createEmbeddings, createRAGLLM };
