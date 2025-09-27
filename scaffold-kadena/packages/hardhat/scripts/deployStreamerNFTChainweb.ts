import { chainweb, ethers } from "hardhat";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const chains = await chainweb.getChainIds();
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const deployed: Record<number, any> = {};

  for (const chain of chains) {
    await chainweb.switchChain(chain);

    const streamNFT = await (await ethers.getContractFactory("StreamNFT")).deploy();
    await streamNFT.waitForDeployment();

    const marketplace = await (await ethers.getContractFactory("Marketplace")).deploy(await streamNFT.getAddress());
    await marketplace.waitForDeployment();

    deployed[5900 + chain] = {
      StreamNFT: { address: await streamNFT.getAddress(), abi: (await hre.artifacts.readArtifact("StreamNFT")).abi },
      Marketplace: { address: await marketplace.getAddress(), abi: (await hre.artifacts.readArtifact("Marketplace")).abi },
    };
  }

  const filePath = path.join(__dirname, "../../nextjs/contracts/deployedContracts.ts");
  if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(
    filePath,
    `import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";
const deployedContracts = ${JSON.stringify(deployed, null, 2)} as const;
export default deployedContracts satisfies GenericContractsDeclaration;`
  );

  console.log("✅ Deployed all contracts and wrote deployedContracts.ts");
}

main().catch(err => { console.error(err); process.exit(1); });
