// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./StreamerNFT.sol";

contract Marketplace is ReentrancyGuard {
    StreamNFT public nft;

    struct Listing {
        uint256 price;
        address seller;
    }

    struct FractionalData {
        address streamer;
        uint256 pricePerHour;
        bool isActive;
        mapping(address => uint256) userHours; // user => hours purchased
        address[] buyers;
        uint256 totalHoursSold;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => FractionalData) public fractionalData;
    
    // Track user's purchases across all NFTs
    mapping(address => uint256[]) public userPurchasedTokens;
    mapping(address => mapping(uint256 => uint256)) public userTokenHours;

    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event Sold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    event FractionalListingCreated(uint256 indexed tokenId, address indexed streamer, uint256 pricePerHour);
    event HoursPurchased(uint256 indexed tokenId, address indexed buyer, uint256 hoursAmount, uint256 totalCost);

    constructor(address _nftAddress) {
        nft = StreamNFT(_nftAddress);
    }

    // List NFT for full purchase
    function list(uint256 tokenId, uint256 price) public {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be positive");
        require(!nft.isExpired(tokenId), "NFT is expired");
        require(nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved");
        require(!fractionalData[tokenId].isActive, "Already listed fractionally");

        listings[tokenId] = Listing(price, msg.sender);
        emit Listed(tokenId, msg.sender, price);
    }

    // Buy full NFT
    function buy(uint256 tokenId) public payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.price > 0, "Not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        require(!nft.isExpired(tokenId), "NFT is expired");

        address seller = listing.seller;
        uint256 price = listing.price;

        delete listings[tokenId];

        nft.transferFrom(seller, msg.sender, tokenId);
        payable(seller).transfer(price);
        
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit Sold(tokenId, msg.sender, price);
    }

    // List NFT for fractional hour purchases
    function listFractional(uint256 tokenId, uint256 pricePerHour) public {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!nft.isExpired(tokenId), "NFT is expired");
        require(pricePerHour > 0, "Price per hour must be positive");
        require(listings[tokenId].price == 0, "Already listed for full sale");
        require(!fractionalData[tokenId].isActive, "Already listed fractionally");

        FractionalData storage fracData = fractionalData[tokenId];
        fracData.streamer = msg.sender;
        fracData.pricePerHour = pricePerHour;
        fracData.isActive = true;
        fracData.totalHoursSold = 0;

        emit FractionalListingCreated(tokenId, msg.sender, pricePerHour);
    }

    // Buy hours from a stream
    function buyHours(uint256 tokenId, uint256 hoursAmount) public payable nonReentrant {
        FractionalData storage fracData = fractionalData[tokenId];
        require(fracData.isActive, "Not listed fractionally");
        require(!nft.isExpired(tokenId), "NFT is expired");
        require(hoursAmount > 0, "Must buy at least 1 hour");
        
        uint256 remainingHours = getRemainingHours(tokenId);
        require(hoursAmount <= remainingHours, "Not enough hours remaining");
        
        uint256 totalCost = hoursAmount * fracData.pricePerHour;
        require(msg.value >= totalCost, "Insufficient payment");

        // Add buyer if first time
        if (fracData.userHours[msg.sender] == 0) {
            fracData.buyers.push(msg.sender);
        }

        // Update fractional data
        fracData.userHours[msg.sender] += hoursAmount;
        fracData.totalHoursSold += hoursAmount;

        // Update user tracking
        if (userTokenHours[msg.sender][tokenId] == 0) {
            userPurchasedTokens[msg.sender].push(tokenId);
        }
        userTokenHours[msg.sender][tokenId] += hoursAmount;

        // Pay the streamer
        payable(fracData.streamer).transfer(totalCost);
        
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit HoursPurchased(tokenId, msg.sender, hoursAmount, totalCost);
    }

    // Get remaining hours for an NFT
    function getRemainingHours(uint256 tokenId) public view returns (uint256) {
        (, uint256 expiration, , , ) = nft.tokenData(tokenId);
        
        if (block.timestamp >= expiration) {
            return 0;
        }
        
        uint256 remainingSeconds = expiration - block.timestamp;
        return (remainingSeconds + 3599) / 3600; // Round up to nearest hour
    }

    // Get all active NFTs (not expired)
    function getActiveNFTs() public view returns (uint256[] memory) {
        uint256 nextTokenId = nft.nextTokenId();
        uint256[] memory activeTokens = new uint256[](nextTokenId - 1);
        uint256 activeCount = 0;

        for (uint256 i = 1; i < nextTokenId; i++) {
            if (!nft.isExpired(i)) {
                activeTokens[activeCount] = i;
                activeCount++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeTokens[i];
        }

        return result;
    }

    // Get user's purchased tokens and hours
    function getUserPurchases(address user) public view returns (uint256[] memory tokens, uint256[] memory hoursArray) {
        uint256[] memory userTokens = userPurchasedTokens[user];
        uint256[] memory userHoursArray = new uint256[](userTokens.length);
        
        for (uint256 i = 0; i < userTokens.length; i++) {
            userHoursArray[i] = userTokenHours[user][userTokens[i]];
        }
        
        return (userTokens, userHoursArray);
    }

    // Get fractional listing details
    function getFractionalData(uint256 tokenId) public view returns (
        address streamer,
        uint256 pricePerHour,
        bool isActive,
        uint256 totalHoursSold,
        uint256 remainingHours
    ) {
        FractionalData storage fracData = fractionalData[tokenId];
        return (
            fracData.streamer,
            fracData.pricePerHour,
            fracData.isActive,
            fracData.totalHoursSold,
            getRemainingHours(tokenId)
        );
    }

    // Get user's hours for a specific token
    function getUserHoursForToken(uint256 tokenId, address user) public view returns (uint256) {
        return fractionalData[tokenId].userHours[user];
    }

    // Cancel listings
    function cancelListing(uint256 tokenId) public {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        require(listings[tokenId].price > 0, "Not listed");
        delete listings[tokenId];
        emit ListingCancelled(tokenId);
    }

    function cancelFractionalListing(uint256 tokenId) public {
        FractionalData storage fracData = fractionalData[tokenId];
        require(fracData.streamer == msg.sender, "Not the streamer");
        require(fracData.isActive, "Not active");
        require(fracData.totalHoursSold == 0, "Cannot cancel, hours already sold");
        
        fracData.isActive = false;
    }

    // Check listing status
    function isListed(uint256 tokenId) public view returns (bool) {
        return listings[tokenId].price > 0;
    }

    function isFractionallyListed(uint256 tokenId) public view returns (bool) {
        return fractionalData[tokenId].isActive;
    }

    // Get listing details
    function getListing(uint256 tokenId) public view returns (uint256 price, address seller) {
        Listing memory listing = listings[tokenId];
        return (listing.price, listing.seller);
    }
}