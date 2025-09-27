const readline = require('readline');

async function main() {
  console.clear();
  console.log('🚀 Hedera Agent Suite');
  console.log('====================\n');
  console.log('Choose an agent to run:');
  console.log('1. Moderation Agent - Content moderation with Hedera integration');
  console.log('2. RAG Agent - Question answering about Hedera Hashgraph');
  console.log('3. Advertisement Agent - Live stream ad generation with timing controls');
  console.log('4. Exit\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your choice (1-4): ', async (choice) => {
    switch (choice.trim()) {
      case '1':
        console.log('\n🔗 Starting Moderation Agent...\n');
        rl.close();
        const { main: moderationMain } = require('./agents/moderation-agent');
        await moderationMain();
        break;
        
      case '2':
        console.log('\n🔗 Starting RAG Agent...\n');
        rl.close();
        const { main: ragMain } = require('./agents/rag-agent');
        await ragMain();
        break;
        
      case '3':
        console.log('\n🔗 Starting Advertisement Agent...\n');
        rl.close();
        const { main: adMain } = require('./agents/advertisement-agent');
        await adMain();
        break;
        
      case '4':
        console.log('👋 Goodbye!');
        rl.close();
        break;
        
      default:
        console.log('❌ Invalid choice. Please run the program again and select 1, 2, 3, or 4.');
        rl.close();
        break;
    }
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
