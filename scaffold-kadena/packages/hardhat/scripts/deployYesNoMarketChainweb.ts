import { chainweb, ethers, run } from "hardhat";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying YesNoMarket to Chainweb testnet chains with CREATE2 (same address across chains)...");

  const chains = await chainweb.getChainIds(); // e.g., [20,21,22,23,24]
  console.log("Target chains:", chains.join(", "));

  // Ensure we have a signer
  await chainweb.switchChain(chains[0]);
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Deploy or fetch CREATE2 factory
  const [factoryAddress] = await chainweb.create2.deployCreate2Factory();
  console.log("CREATE2 factory:", factoryAddress);

  // Deterministic salt (change to redeploy to a different address)
  const salt = ethers.id("YesNoMarket-v1");

  // Deploy YesNoMarket to all chains using CREATE2 so the address is identical
  const deployed = await chainweb.create2.deployOnChainsUsingCreate2({
    name: "YesNoMarket",
    constructorArgs: [],
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
    console.log(`Chain ${d.chain} (chainId ${d.chain + 5900 + 0}): ${d.address}`);
  }

  // Generate externalContracts.ts with YesNoMarket mapping for Next.js
  const artifact = await hre.artifacts.readArtifact("YesNoMarket");
  const mapping: Record<number, any> = {};

  for (const d of successful) {
    const evmChainId = 5900 + d.chain; // Hardhat Chainweb testnet offset (e.g., 5920..)
    mapping[evmChainId] = {
      YesNoMarket: {
        address: d.address,
        abi: artifact.abi,
      },
    };
  }

  const contractsDir = path.join(__dirname, "../../nextjs/contracts");
  const filePath = path.join(contractsDir, "externalContracts.ts");
  if (!fs.existsSync(contractsDir)) fs.mkdirSync(contractsDir, { recursive: true });

  const fileContent = `import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const externalContracts = ${JSON.stringify(mapping, null, 2)} as const;

export default externalContracts satisfies GenericContractsDeclaration;
`;
  fs.writeFileSync(filePath, fileContent);
  console.log("✅ Wrote externalContracts.ts with YesNoMarket addresses");

  console.log("\nView explorer for chain 22:");
  console.log("https://chain-22.evm-testnet-blockscout.chainweb.com/");
}

main().catch(err => { console.error(err); process.exit(1); });
