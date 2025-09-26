const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const StreamNFT = await hre.ethers.getContractFactory("StreamNFT");
  const streamNFT = await StreamNFT.deploy();
  await streamNFT.waitForDeployment();
  console.log("StreamNFT deployed to:", await streamNFT.getAddress());

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(await streamNFT.getAddress());
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});