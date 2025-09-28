import { chainweb, ethers, run } from "hardhat";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying Moderator to Chainweb testnet chains with CREATE2 (same address across chains)...");

  const chains = await chainweb.getChainIds(); // Should be [20,21,22,23,24] for testnet
  console.log("Target chains:", chains.join(", "));
  console.log("Current network:", hre.network.name);

  if (!hre.network.name.includes("testnet")) {
    console.error("❌ This script is intended for the Chainweb testnet.");
    console.error("Please run with '--network testnet'");
    process.exit(1);
  }

  // Ensure we have a signer
  await chainweb.switchChain(chains[0]);
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Deploy or fetch CREATE2 factory
  const [factoryAddress] = await chainweb.create2.deployCreate2Factory();
  console.log("CREATE2 factory:", factoryAddress);

  // Deterministic salt (change to redeploy to a different address)
  const salt = ethers.id("Moderator-v1");

  // Deploy Moderator to all chains using CREATE2 so the address is identical
  const deployed = await chainweb.create2.deployOnChainsUsingCreate2({
    name: "Moderator",
    constructorArgs: [], // Moderator constructor only needs msg.sender which is handled automatically
    create2Factory: factoryAddress,
    salt,
  });

  const successful = deployed.deployments.filter(d => d && d.address);
  if (successful.length === 0) {
    throw new Error("No successful deployments");
  }

  // Log summary
  console.log("\n=== Deployment Summary ===");
  for (const d of successful) {
    console.log(`Chain ${d.chain} (chainId ${d.chain + 5920}): ${d.address}`);
  }

  // Generate externalContracts.ts with both YesNoMarket and Moderator mappings for Next.js
  const moderatorArtifact = await hre.artifacts.readArtifact("Moderator");
  
  // Read existing externalContracts.ts if it exists to preserve YesNoMarket
  const contractsDir = path.join(__dirname, "../../nextjs/contracts");
  const filePath = path.join(contractsDir, "externalContracts.ts");
  
  let existingMapping: Record<number, any> = {};
  if (fs.existsSync(filePath)) {
    try {
      const existingContent = fs.readFileSync(filePath, "utf8");
      // Extract the existing mapping (this is a simple approach)
      const match = existingContent.match(/const externalContracts = ({[\s\S]*?}) as const;/);
      if (match) {
        existingMapping = JSON.parse(match[1]);
      }
    } catch (error) {
      console.log("Could not parse existing externalContracts.ts, creating new one");
    }
  }

  // Add Moderator contract to each chain
  for (const d of successful) {
    const evmChainId = 5920 + d.chain; // Hardhat Chainweb testnet offset (e.g., 5920..)
    
    if (!existingMapping[evmChainId]) {
      existingMapping[evmChainId] = {};
    }
    
    existingMapping[evmChainId].Moderator = {
      address: d.address,
      abi: moderatorArtifact.abi,
    };
  }

  if (!fs.existsSync(contractsDir)) fs.mkdirSync(contractsDir, { recursive: true });

  const fileContent = `import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const externalContracts = ${JSON.stringify(existingMapping, null, 2)} as const;

export default externalContracts satisfies GenericContractsDeclaration;
`;
  fs.writeFileSync(filePath, fileContent);
  console.log("✅ Updated externalContracts.ts with Moderator addresses");

  console.log("\nView explorer for chain 22:");
  console.log("https://chain-22.evm-testnet-blockscout.chainweb.com/");
  
  console.log("\n=== Moderator Contract Deployed Successfully ===");
  console.log("Contract features:");
  console.log("- Add/remove moderators (owner only)");
  console.log("- Update moderator profiles");
  console.log("- Toggle moderator active status");
  console.log("- Track moderator actions");
  console.log("- Batch operations for frontend efficiency");
}

main().catch(err => { 
  console.error("Deployment failed:", err); 
  process.exit(1); 
});