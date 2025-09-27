import { chainweb, ethers } from "hardhat";
import { generateNFTMarketplaceDeployedContractsFile } from "./nftMarketplaceUtils";

async function main() {
  console.log("🚀 NFT Marketplace multichain deployment starting...");

  const chains = await chainweb.getChainIds(); // e.g., [20,21,22,23,24]
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1️⃣ Deploy StreamNFT on all chains
  const nftResult = await chainweb.deployContractOnChains({
    name: "StreamNFT",
    constructorArgs: [],
  });
  const nfts = nftResult.deployments.filter(d => d && d.address);
  console.log(`✅ StreamNFT deployed on ${nfts.length} chains`);

  // 2️⃣ Deploy Marketplace on all chains using StreamNFT address of same chain
  const marketplaces = [];
  for (const nft of nfts) {
    const marketResult = await chainweb.deployContractOnChains({
      name: "Marketplace",
      constructorArgs: [nft.address],
      onlyChains: [nft.chain],
    });
    marketplaces.push(...marketResult.deployments.filter(d => d && d.address));
  }
  console.log(`✅ Marketplace deployed on ${marketplaces.length} chains`);

  // 3️⃣ Generate frontend mapping
  await generateNFTMarketplaceDeployedContractsFile(nfts, marketplaces);
  console.log("✅ Deployed contracts file created for frontend");

  console.log("\n=== Deployment Summary ===");
  nfts.forEach(nft => {
    const market = marketplaces.find(m => m.chain === nft.chain);
    console.log(`Chain ${nft.chain + 5900}: StreamNFT=${nft.address}, Marketplace=${market?.address}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
