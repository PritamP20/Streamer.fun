const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StreamNFTMarketplace", function () {
  let StreamNFT, Marketplace, streamNFT, marketplace, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    StreamNFT = await ethers.getContractFactory("StreamNFT");
    Marketplace = await ethers.getContractFactory("Marketplace");
    streamNFT = await StreamNFT.deploy();
    await streamNFT.waitForDeployment();
    marketplace = await Marketplace.deploy(await streamNFT.getAddress());
    await marketplace.waitForDeployment();
  });

  it("Should mint an NFT", async function () {
    await streamNFT.mint("Test NFT", "A cool stream NFT", "ipfs://Qm...", 36000);
    expect(await streamNFT.ownerOf(1)).to.equal(owner.address);
    const tokenURI = await streamNFT.tokenURI(1);
    // Decode base64 JSON to check content
    const base64 = tokenURI.replace('data:application/json;base64,', '');
    const decodedJson = Buffer.from(base64, 'base64').toString('utf-8');
    expect(decodedJson).to.contain("Test NFT");
  });

  it("Should list and buy an NFT", async function () {
    await streamNFT.mint("Test NFT", "A cool stream NFT", "ipfs://Qm...", 36000);
    await streamNFT.approve(await marketplace.getAddress(), 1);
    await marketplace.list(1, ethers.parseEther("1"));
    await marketplace.connect(addr1).buy(1, { value: ethers.parseEther("1") });
    expect(await streamNFT.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should not transfer expired NFT", async function () {
    await streamNFT.mint("Test NFT", "A cool stream NFT", "ipfs://Qm...", 36000);
    await ethers.provider.send("evm_increaseTime", [36001]);
    await ethers.provider.send("evm_mine");
    await expect(streamNFT.transferFrom(owner.address, addr1.address, 1)).to.be.revertedWith("NFT expired, cannot transfer");
  });

  it("Should cancel listing", async function () {
    await streamNFT.mint("Test NFT", "A cool stream NFT", "ipfs://Qm...", 36000);
    await streamNFT.approve(await marketplace.getAddress(), 1);
    await marketplace.list(1, ethers.parseEther("1"));
    await marketplace.cancelListing(1);
    const listing = await marketplace.listings(1);
    expect(listing.price).to.equal(0);
  });
});