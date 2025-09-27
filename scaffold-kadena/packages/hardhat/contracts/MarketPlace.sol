// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StreamerNFT.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    StreamNFT public nft;

    // Global pricing config (bonding curve)
    // basePricePerHour: starting price for the next hour (in wei)
    // multiplierBps: price increase per hour sold, in basis points multiplier (e.g., 10500 => +5% per hour)
    uint256 public basePricePerHour = 0.01 ether;
    uint256 public multiplierBps = 10500; // 5% increase per step
    address public priceOracle; // optional address allowed to tweak multiplier

    struct Listing {
        uint256 price;
        address seller;
    }

    struct FractionalData {
        address streamer;
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
    event FractionalListingCreated(uint256 indexed tokenId, address indexed streamer);
    event HoursPurchased(uint256 indexed tokenId, address indexed buyer, uint256 hoursAmount, uint256 totalCost);
    event PricingUpdated(uint256 basePricePerHour, uint256 multiplierBps);
    event PriceOracleUpdated(address oracle);

    constructor(address _nftAddress) Ownable(msg.sender) {
        nft = StreamNFT(_nftAddress);
    }

    modifier onlyOracleOrOwner() {
        require(msg.sender == owner() || msg.sender == priceOracle, "Not authorized");
        _;
    }

    function setPriceOracle(address _oracle) external onlyOwner {
        priceOracle = _oracle;
        emit PriceOracleUpdated(_oracle);
    }

    function setBasePricePerHour(uint256 _base) external onlyOwner {
        require(_base > 0, "base must be > 0");
        basePricePerHour = _base;
        emit PricingUpdated(basePricePerHour, multiplierBps);
    }

    function setMultiplierBps(uint256 _bps) external onlyOracleOrOwner {
        require(_bps >= 10000, "bps must be >= 10000"); // at least 1x
        multiplierBps = _bps;
        emit PricingUpdated(basePricePerHour, multiplierBps);
    }

    // List NFT for full purchase
    function list(uint256 tokenId, uint256 price) public {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be positive");
        require(!nft.isExpired(tokenId), "NFT is expired");
        require(
            nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
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

    // List NFT for fractional hour purchases (no custom price; uses global pricing curve)
    function listFractional(uint256 tokenId) public {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!nft.isExpired(tokenId), "NFT is expired");
        require(listings[tokenId].price == 0, "Already listed for full sale");
        require(!fractionalData[tokenId].isActive, "Already listed fractionally");

        FractionalData storage fracData = fractionalData[tokenId];
        fracData.streamer = msg.sender;
        fracData.isActive = true;
        fracData.totalHoursSold = 0;

        emit FractionalListingCreated(tokenId, msg.sender);
    }

    // Internal: compute next hour price given hours already sold (geometric progression)
    function _currentPrice(uint256 sold) internal view returns (uint256 p) {
        p = basePricePerHour;
        uint256 m = multiplierBps;
        if (sold == 0) return p;
        for (uint256 i = 0; i < sold; i++) {
            p = (p * m) / 10000;
        }
    }

    // View: next hour price for a token
    function getNextHourPrice(uint256 tokenId) public view returns (uint256) {
        FractionalData storage f = fractionalData[tokenId];
        return _currentPrice(f.totalHoursSold);
    }

    // View: totalCost for buying `hoursAmount` hours from current state
    function getBuyCost(uint256 tokenId, uint256 hoursAmount) public view returns (uint256 totalCost, uint256 nextHourPrice) {
        FractionalData storage f = fractionalData[tokenId];
        uint256 price = _currentPrice(f.totalHoursSold);
        nextHourPrice = price;
        totalCost = 0;
        for (uint256 i = 0; i < hoursAmount; i++) {
            totalCost += price;
            price = (price * multiplierBps) / 10000;
        }
    }

    // Buy hours from a stream
    function buyHours(uint256 tokenId, uint256 hoursAmount) public payable nonReentrant {
        FractionalData storage fracData = fractionalData[tokenId];
        require(fracData.isActive, "Not listed fractionally");
        require(!nft.isExpired(tokenId), "NFT is expired");
        require(hoursAmount > 0, "Must buy at least 1 hour");

        uint256 timeHours = getRemainingHoursByTime(tokenId);
        // Subtract hours already sold to prevent oversell
        if (timeHours <= fracData.totalHoursSold) {
            revert("No hours left");
        }
        uint256 remainingHours = timeHours - fracData.totalHoursSold;
        require(hoursAmount <= remainingHours, "Not enough hours remaining");

        (uint256 totalCost, ) = getBuyCost(tokenId, hoursAmount);
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

    // Remaining hours based on time only (no sales applied)
    function getRemainingHoursByTime(uint256 tokenId) public view returns (uint256) {
        (, uint256 expiration, , , ) = nft.tokenData(tokenId);
        if (block.timestamp >= expiration) {
            return 0;
        }
        uint256 remainingSeconds = expiration - block.timestamp;
        return (remainingSeconds + 3599) / 3600; // ceil hours
    }

    // Get remaining hours available for sale (time minus sold)
    function getRemainingHours(uint256 tokenId) public view returns (uint256) {
        FractionalData storage f = fractionalData[tokenId];
        uint256 timeHours = getRemainingHoursByTime(tokenId);
        if (timeHours <= f.totalHoursSold) return 0;
        return timeHours - f.totalHoursSold;
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

    // Backward-compatible function (kept but pricePerHour now returns nextHourPrice)
    function getFractionalData(
        uint256 tokenId
    ) public view returns (address streamer, uint256 pricePerHour, bool isActive, uint256 totalHoursSold, uint256 remainingHours) {
        FractionalData storage f = fractionalData[tokenId];
        return (f.streamer, getNextHourPrice(tokenId), f.isActive, f.totalHoursSold, getRemainingHours(tokenId));
    }

    // New view struct-like getter
    function getFractionalView(
        uint256 tokenId
    )
        public
        view
        returns (
            bool isActive,
            uint256 base,
            uint256 multiplier,
            uint256 totalSold,
            uint256 remaining,
            uint256 nextPrice
        )
    {
        FractionalData storage f = fractionalData[tokenId];
        return (f.isActive, basePricePerHour, multiplierBps, f.totalHoursSold, getRemainingHours(tokenId), getNextHourPrice(tokenId));
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
