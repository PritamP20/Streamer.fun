import { chainweb, ethers } from "hardhat";

const CHAINS = [20, 21, 22, 23, 24]; // Kadena EVM testnet chains

async function main() {
  const results: Record<number, string> = {};

  for (const cid of CHAINS) {
    console.log(`\n=== Deploying to Chain ${cid} ===`);
    await chainweb.switchChain(cid);
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address, "Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "KDA");

    const YesNoMarket = await ethers.getContractFactory("YesNoMarket");
    const market = await YesNoMarket.deploy();
    await market.waitForDeployment();
    const addr = await market.getAddress();
    console.log(`✅ YesNoMarket on chain ${cid}: ${addr}`);
    results[cid] = addr;
  }

  console.log("\nDeployment summary (chainId:address):");
  for (const cid of CHAINS) console.log(`${cid + 5900 + 2}: ${results[cid]}`); // 5920..5924

  console.log("\nExplorer example for chain 22:");
  console.log("https://chain-22.evm-testnet-blockscout.chainweb.com/");
}

main().catch(err => { console.error(err); process.exit(1); });
