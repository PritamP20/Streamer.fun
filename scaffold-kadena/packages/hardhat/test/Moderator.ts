import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Updating externalContracts.ts with correct ABI...");

  // Get the artifact with the correct ABI
  const moderatorArtifact = await hre.artifacts.readArtifact("ModeratorWithPurchases");
  const contractAddress = "0x88F0e295693cdAcBE98b4e00D1488303c6476c44";

  // Create mapping for all 5 chains
  const mapping: Record<number, any> = {};
  
  // Chains 20-24 with chainIds 5940-5944 (as shown in your deployment)
  for (let i = 0; i < 5; i++) {
    const chainId = 5940 + i;
    mapping[chainId] = {
      Moderator: {
        address: contractAddress,
        abi: moderatorArtifact.abi,
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
  console.log("✅ Updated externalContracts.ts with correct ModeratorWithPurchases ABI");
  console.log("✅ Contract available on chains 5940, 5941, 5942, 5943, 5944");
  console.log("✅ The purchaseModeratorService function is now available");
}

main().catch(console.error);