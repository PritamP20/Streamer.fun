// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract StreamNFT is ERC721 {
    using Strings for uint256;

    struct TokenData {
        address creator;
        uint256 expiration;
        string name;
        string description;
        string imageURI;
    }

    // Complete NFT info struct for frontend
    struct NFTInfo {
        uint256 tokenId;
        address creator;
        address currentOwner;
        uint256 expiration;
        string name;
        string description;
        string imageURI;
        bool isExpired;
        uint256 remainingTime;
        uint256 remainingHours;
    }

    mapping(uint256 => TokenData) public tokenData;
    uint256 public nextTokenId = 1;

    event NFTMinted(uint256 indexed tokenId, address indexed creator, uint256 expiration);

    constructor() ERC721("StreamNFT", "SNFT") {}

    function mint(string memory _name, string memory _description, string memory _imageURI, uint256 _duration) public returns (uint256) {
        require(_duration > 0 && _duration <= 24 hours, "Duration must be positive and <= 24 hours");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_imageURI).length > 0, "Image URI cannot be empty");
        
        uint256 tokenId = nextTokenId++;
        tokenData[tokenId] = TokenData(msg.sender, block.timestamp + _duration, _name, _description, _imageURI);
        _safeMint(msg.sender, tokenId);
        emit NFTMinted(tokenId, msg.sender, block.timestamp + _duration);
        return tokenId;
    }

    function isExpired(uint256 tokenId) public view returns (bool) {
        _requireOwned(tokenId);
        return block.timestamp > tokenData[tokenId].expiration;
    }

    // Get remaining time in seconds
    function getRemainingTime(uint256 tokenId) public view returns (uint256) {
        _requireOwned(tokenId);
        uint256 expiration = tokenData[tokenId].expiration;
        if (block.timestamp >= expiration) {
            return 0;
        }
        return expiration - block.timestamp;
    }

    // Get remaining time in hours (rounded up)
    function getRemainingHours(uint256 tokenId) public view returns (uint256) {
        uint256 remainingSeconds = getRemainingTime(tokenId);
        if (remainingSeconds == 0) {
            return 0;
        }
        return (remainingSeconds + 3599) / 3600; // Round up to nearest hour
    }

    // Get all active (non-expired) NFTs
    function getActiveNFTs() public view returns (uint256[] memory) {
        uint256[] memory activeTokens = new uint256[](nextTokenId - 1);
        uint256 activeCount = 0;

        for (uint256 i = 1; i < nextTokenId; i++) {
            if (block.timestamp <= tokenData[i].expiration) {
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

    // Get all NFTs (active and expired)
    function getAllNFTs() public view returns (uint256[] memory) {
        uint256[] memory allTokens = new uint256[](nextTokenId - 1);
        
        for (uint256 i = 1; i < nextTokenId; i++) {
            allTokens[i - 1] = i;
        }

        return allTokens;
    }

    // Get NFTs created by a specific address
    function getNFTsByCreator(address creator) public view returns (uint256[] memory) {
        uint256[] memory creatorTokens = new uint256[](nextTokenId - 1);
        uint256 creatorCount = 0;

        for (uint256 i = 1; i < nextTokenId; i++) {
            if (tokenData[i].creator == creator) {
                creatorTokens[creatorCount] = i;
                creatorCount++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](creatorCount);
        for (uint256 i = 0; i < creatorCount; i++) {
            result[i] = creatorTokens[i];
        }

        return result;
    }

    // Get NFTs owned by a specific address
    function getNFTsByOwner(address owner) public view returns (uint256[] memory) {
        uint256[] memory ownerTokens = new uint256[](nextTokenId - 1);
        uint256 ownerCount = 0;

        for (uint256 i = 1; i < nextTokenId; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    ownerTokens[ownerCount] = i;
                    ownerCount++;
                }
            } catch {
                // Token might not exist or be burned, skip it
                continue;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](ownerCount);
        for (uint256 i = 0; i < ownerCount; i++) {
            result[i] = ownerTokens[i];
        }

        return result;
    }

    // Get complete NFT information
    function getNFTInfo(uint256 tokenId) public view returns (NFTInfo memory) {
        _requireOwned(tokenId);
        TokenData memory data = tokenData[tokenId];
        address owner = ownerOf(tokenId);
        bool expired = block.timestamp > data.expiration;
        uint256 remainingTime = expired ? 0 : data.expiration - block.timestamp;
        uint256 remainingHours = remainingTime == 0 ? 0 : (remainingTime + 3599) / 3600;

        return NFTInfo({
            tokenId: tokenId,
            creator: data.creator,
            currentOwner: owner,
            expiration: data.expiration,
            name: data.name,
            description: data.description,
            imageURI: data.imageURI,
            isExpired: expired,
            remainingTime: remainingTime,
            remainingHours: remainingHours
        });
    }

    // Get multiple NFT infos at once
    function getBatchNFTInfo(uint256[] memory tokenIds) public view returns (NFTInfo[] memory) {
        NFTInfo[] memory infos = new NFTInfo[](tokenIds.length);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            infos[i] = getNFTInfo(tokenIds[i]);
        }
        
        return infos;
    }

    // Get active NFTs with complete info
    function getActiveNFTsWithInfo() public view returns (NFTInfo[] memory) {
        uint256[] memory activeTokens = getActiveNFTs();
        return getBatchNFTInfo(activeTokens);
    }

    // Get all NFTs with complete info
    function getAllNFTsWithInfo() public view returns (NFTInfo[] memory) {
        uint256[] memory allTokens = getAllNFTs();
        return getBatchNFTInfo(allTokens);
    }

    // Check if NFT exists
    function exists(uint256 tokenId) public view returns (bool) {
        return tokenId > 0 && tokenId < nextTokenId;
    }

    // Get total supply of minted NFTs
    function totalSupply() public view returns (uint256) {
        return nextTokenId - 1;
    }

    // Get active supply (non-expired NFTs)
    function activeSupply() public view returns (uint256) {
        return getActiveNFTs().length;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        TokenData memory data = tokenData[tokenId];
        string memory json = string(abi.encodePacked(
            '{"name": "', data.name, ' #', tokenId.toString(), '", ',
            '"description": "', data.description, '", ',
            '"image": "', data.imageURI, '", ',
            '"attributes": [{"trait_type": "Creator", "value": "', toAsciiString(data.creator), '"}, ',
            '{"trait_type": "Expiration", "value": ', data.expiration.toString(), '}, ',
            '{"trait_type": "Status", "value": "', block.timestamp > data.expiration ? "Expired" : "Active", '"}]}'
        ));
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        if (to != address(0) && auth != address(0)) {
            require(block.timestamp <= tokenData[tokenId].expiration, "NFT expired, cannot transfer");
        }
        return super._update(to, tokenId, auth);
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(abi.encodePacked("0x", s));
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}