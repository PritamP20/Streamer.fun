import { chainweb, ethers, run } from "hardhat";
import { generateNFTMarketplaceDeployedContractsFile } from "./nftMarketplaceUtils";

async function main() {
  console.log("NFT Marketplace deployment starting...");

  const verificationDelay = process.env.VERIFICATION_DELAY ? parseInt(process.env.VERIFICATION_DELAY) : 10000; // Default 10 seconds

  const chains = await chainweb.getChainIds();
  console.log("chains,", chains);
  await chainweb.switchChain(chains[0]);

  // Now the signer will be available because __RUNTIME_DEPLOYER_PRIVATE_KEY was set!
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with deployer account: ${deployer.address}`);

  // First deploy StreamerNFT
  console.log("Deploying StreamerNFT...");
  const streamNFTDeployment = await chainweb.deployContractOnChains({
    name: "StreamNFT",
    constructorArgs: [],
  });

  const successfulNFTDeployments = streamNFTDeployment.deployments.filter(d => d !== null);
  
  if (successfulNFTDeployments.length === 0) {
    console.log("❌ StreamerNFT deployment failed");
    process.exit(1);
    return;
  }

  console.log(`✅ StreamerNFT deployed to ${successfulNFTDeployments.length} chains`);

  // Deploy Marketplace on each chain using the StreamerNFT address
  const marketplaceDeployments = [];
  
  for (const nftDeployment of successfulNFTDeployments) {
    await chainweb.switchChain(nftDeployment.chain);
    
    console.log(`Deploying Marketplace on chain ${nftDeployment.chain} with NFT address ${nftDeployment.address}`);
    
    const marketplaceDeployment = await chainweb.deployContractOnChains({
      name: "Marketplace",
      constructorArgs: [nftDeployment.address],
    });

    const successfulMarketplaceDeployments = marketplaceDeployment.deployments.filter(d => d !== null && d.chain === nftDeployment.chain);
    marketplaceDeployments.push(...successfulMarketplaceDeployments);
  }

  if (marketplaceDeployments.length > 0) {
    console.log(`✅ Marketplace deployed to ${marketplaceDeployments.length} chains`);

    // Generate the deployed contracts file
    await generateNFTMarketplaceDeployedContractsFile(successfulNFTDeployments, marketplaceDeployments);

    console.log("✅ NFT Marketplace deployment completed successfully");
  } else {
    console.log("❌ Marketplace deployment failed");
    process.exit(1);
  }
}

main().catch(console.error);