import { chainweb, ethers } from "hardhat";

async function main() {
  // Switch to Chain 22 explicitly (Kadena EVM testnet: chainId 5922)
  await chainweb.switchChain(22);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying YesNoMarket (Chain 22) with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "KDA");

  const YesNoMarket = await ethers.getContractFactory("YesNoMarket");
  const market = await YesNoMarket.deploy();
  await market.waitForDeployment();
  const marketAddress = await market.getAddress();

  console.log("✅ YesNoMarket deployed to:", marketAddress);
  console.log("Chain: 22 (chainId 5922)");
  console.log("Explorer: https://chain-22.evm-testnet-blockscout.chainweb.com/");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
