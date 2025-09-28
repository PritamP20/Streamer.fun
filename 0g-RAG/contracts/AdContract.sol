// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AdvertisementRAG {
    struct AdContent {
        uint256 id;
        string title;
        string content;
        string category;
        string[] keywords;
        string[] tags;
        uint256 timestamp;
        address owner;
        bool isActive;
        uint256 views;
        uint256 engagement;
        uint256 rating;
        string metadata; // JSON string for additional data
    }
    
    struct QueryResult {
        uint256[] adIds;
        uint256[] relevanceScores;
        string generatedResponse;
        uint256 totalResults;
    }
    
    struct RAGConfig {
        uint256 maxResults;
        uint256 minRelevanceScore;
        bool enableAutoGeneration;
        address owner;
    }
    
    // State variables
    mapping(uint256 => AdContent) public advertisements;
    mapping(string => uint256[]) public categoryToAds;
    mapping(string => uint256[]) public keywordToAds;
    mapping(address => uint256[]) public ownerToAds;
    mapping(string => uint256) public queryCount;
    
    uint256 public nextAdId;
    uint256 public totalAds;
    RAGConfig public ragConfig;
    
    // Events
    event AdCreated(uint256 indexed adId, address indexed owner, string title, string category);
    event AdUpdated(uint256 indexed adId, address indexed owner);
    event AdQueried(address indexed user, string query, uint256 results, uint256 timestamp);
    event RAGResponse(string query, string response, uint256[] relevantAds);
    event ConfigUpdated(address indexed owner, uint256 maxResults, uint256 minScore);
    
    // Modifiers
    modifier onlyAdOwner(uint256 adId) {
        require(advertisements[adId].owner == msg.sender, "Not ad owner");
        _;
    }
    
    modifier validAdId(uint256 adId) {
        require(adId > 0 && adId < nextAdId && advertisements[adId].id != 0, "Invalid ad ID");
        _;
    }
    
    modifier onlyRAGOwner() {
        require(msg.sender == ragConfig.owner, "Not RAG owner");
        _;
    }
    
    constructor() {
        nextAdId = 1;
        totalAds = 0;
        ragConfig = RAGConfig({
            maxResults: 10,
            minRelevanceScore: 1,
            enableAutoGeneration: true,
            owner: msg.sender
        });
        
        // Initialize with Hedera advertisement content
        _initializeAds();
    }
    
    function _initializeAds() private {
        _createAdInternal(
            "Hedera Hashgraph - Lightning Fast Performance",
            "Hedera delivers 10,000+ transactions per second with 3-5 second finality. No more waiting for slow confirmations - your transactions are processed almost instantly! Perfect for high-frequency trading and real-time applications.",
            "Performance",
            ["speed", "fast", "transactions", "finality", "instant", "tps"],
            ["blockchain", "performance", "speed"],
            '{"color": "blue", "priority": "high", "target": "developers"}'
        );
        
        _createAdInternal(
            "Hedera Hashgraph - Ultra-Low Costs",
            "Experience the most predictable and affordable transaction costs in the industry: Cryptocurrency transfers at just $0.0001 USD, Smart contracts at only $0.05 USD, File storage at $0.10 per GB per month. Save money while scaling your applications.",
            "Pricing",
            ["low-cost", "affordable", "pricing", "cheap", "fees", "cost-effective"],
            ["pricing", "economics", "savings"],
            '{"color": "green", "priority": "high", "target": "enterprises"}'
        );
        
        _createAdInternal(
            "Hedera Hashgraph - Enterprise Security",
            "Built with Asynchronous Byzantine Fault Tolerance (aBFT), Hedera provides the highest level of security without energy-intensive mining. Your assets are protected by mathematically proven consensus algorithms trusted by Fortune 500 companies.",
            "Security",
            ["security", "aBFT", "enterprise", "safe", "byzantine", "consensus"],
            ["security", "enterprise", "trust"],
            '{"color": "red", "priority": "critical", "target": "enterprises"}'
        );
        
        _createAdInternal(
            "Hedera Hashgraph - Real-World Applications",
            "Join thousands of developers building the future: Supply chain tracking and transparency, Identity verification systems, Payment processing solutions, Gaming and NFT platforms, DeFi applications, Enterprise blockchain solutions. The possibilities are endless.",
            "Applications",
            ["dapps", "supply-chain", "identity", "payments", "gaming", "defi", "enterprise"],
            ["applications", "use-cases", "innovation"],
            '{"color": "purple", "priority": "medium", "target": "developers"}'
        );
        
        _createAdInternal(
            "Hedera Hashgraph - Developer Friendly",
            "Get started in minutes with comprehensive tools: Multiple SDKs for popular programming languages, Solidity-compatible smart contracts, REST APIs for easy integration, Extensive documentation and tutorials, Active developer community support.",
            "Development",
            ["developer", "sdk", "solidity", "api", "documentation", "community", "tools"],
            ["development", "tools", "community"],
            '{"color": "yellow", "priority": "medium", "target": "developers"}'
        );
        
        _createAdInternal(
            "Hedera Hashgraph - HBAR Token Ecosystem",
            "HBAR powers the entire Hedera network: Network transaction fees, Staking for network security, Governance participation, Cross-border payments, Micropayments and tips for content creators. Perfect for live streaming monetization.",
            "Token",
            ["hbar", "token", "cryptocurrency", "staking", "governance", "tips", "streaming"],
            ["token", "economics", "streaming"],
            '{"color": "gold", "priority": "high", "target": "creators"}'
        );
        
        _createAdInternal(
            "Hedera Hashgraph - Gaming & NFTs Revolution",
            "Transform your gaming experience: Low-cost NFT minting and trading, Lightning-fast transaction processing, Sustainable blockchain technology, Comprehensive developer tools, Rapidly growing gaming ecosystem with major partnerships.",
            "Gaming",
            ["gaming", "nft", "minting", "sustainable", "ecosystem", "play-to-earn"],
            ["gaming", "nft", "entertainment"],
            '{"color": "cyan", "priority": "high", "target": "gamers"}'
        );
        
        _createAdInternal(
            "Hedera Hashgraph - Enterprise Solutions",
            "Trusted by Fortune 500 companies worldwide: Supply chain management and tracking, Digital identity verification, High-volume payment processing, Data integrity and audit trails, Regulatory compliance solutions, 24/7 enterprise support.",
            "Enterprise",
            ["enterprise", "supply-chain", "compliance", "audit", "data-integrity", "b2b"],
            ["enterprise", "business", "solutions"],
            '{"color": "navy", "priority": "critical", "target": "enterprises"}'
        );
    }
    
    function _createAdInternal(
        string memory title,
        string memory content,
        string memory category,
        string[] memory keywords,
        string[] memory tags,
        string memory metadata
    ) private returns (uint256) {
        uint256 adId = nextAdId++;
        
        advertisements[adId] = AdContent({
            id: adId,
            title: title,
            content: content,
            category: category,
            keywords: keywords,
            tags: tags,
            timestamp: block.timestamp,
            owner: msg.sender,
            isActive: true,
            views: 0,
            engagement: 0,
            rating: 0,
            metadata: metadata
        });
        
        categoryToAds[category].push(adId);
        ownerToAds[msg.sender].push(adId);
        
        for (uint i = 0; i < keywords.length; i++) {
            keywordToAds[keywords[i]].push(adId);
        }
        
        totalAds++;
        return adId;
    }
    
    // Public functions
    function createAd(
        string memory title,
        string memory content,
        string memory category,
        string[] memory keywords,
        string[] memory tags,
        string memory metadata
    ) public returns (uint256) {
        uint256 adId = _createAdInternal(title, content, category, keywords, tags, metadata);
        emit AdCreated(adId, msg.sender, title, category);
        return adId;
    }
    
    function updateAd(
        uint256 adId,
        string memory title,
        string memory content,
        string memory category,
        string[] memory keywords,
        string[] memory tags,
        string memory metadata
    ) public onlyAdOwner(adId) validAdId(adId) {
        AdContent storage ad = advertisements[adId];
        
        // Remove old keyword mappings
        for (uint i = 0; i < ad.keywords.length; i++) {
            _removeFromArray(keywordToAds[ad.keywords[i]], adId);
        }
        
        ad.title = title;
        ad.content = content;
        ad.category = category;
        ad.keywords = keywords;
        ad.tags = tags;
        ad.metadata = metadata;
        
        // Add new keyword mappings
        for (uint i = 0; i < keywords.length; i++) {
            keywordToAds[keywords[i]].push(adId);
        }
        
        emit AdUpdated(adId, msg.sender);
    }
    
    // Advanced RAG Query Function
    function queryRAG(string memory query) public returns (QueryResult memory) {
        queryCount[query]++;
        
        string memory lowerQuery = _toLower(query);
        uint256[] memory matchingAds = new uint256[](totalAds);
        uint256[] memory scores = new uint256[](totalAds);
        uint256 matchCount = 0;
        
        // Enhanced search algorithm with relevance scoring
        for (uint256 i = 1; i < nextAdId; i++) {
            if (!advertisements[i].isActive) continue;
            
            AdContent storage ad = advertisements[i];
            uint256 relevanceScore = _calculateRelevanceScore(ad, lowerQuery);
            
            if (relevanceScore >= ragConfig.minRelevanceScore) {
                matchingAds[matchCount] = i;
                scores[matchCount] = relevanceScore;
                matchCount++;
                
                // Update analytics
                advertisements[i].views++;
            }
        }
        
        // Sort by relevance score (bubble sort for simplicity)
        for (uint i = 0; i < matchCount - 1; i++) {
            for (uint j = 0; j < matchCount - i - 1; j++) {
                if (scores[j] < scores[j + 1]) {
                    // Swap scores
                    uint256 tempScore = scores[j];
                    scores[j] = scores[j + 1];
                    scores[j + 1] = tempScore;
                    
                    // Swap ad IDs
                    uint256 tempId = matchingAds[j];
                    matchingAds[j] = matchingAds[j + 1];
                    matchingAds[j + 1] = tempId;
                }
            }
        }
        
        // Limit results
        uint256 resultCount = matchCount > ragConfig.maxResults ? ragConfig.maxResults : matchCount;
        
        uint256[] memory finalAds = new uint256[](resultCount);
        uint256[] memory finalScores = new uint256[](resultCount);
        
        for (uint i = 0; i < resultCount; i++) {
            finalAds[i] = matchingAds[i];
            finalScores[i] = scores[i];
        }
        
        // Generate AI-like response
        string memory generatedResponse = _generateResponse(query, finalAds, resultCount);
        
        QueryResult memory result = QueryResult({
            adIds: finalAds,
            relevanceScores: finalScores,
            generatedResponse: generatedResponse,
            totalResults: resultCount
        });
        
        emit AdQueried(msg.sender, query, resultCount, block.timestamp);
        emit RAGResponse(query, generatedResponse, finalAds);
        
        return result;
    }
    
    function _calculateRelevanceScore(AdContent storage ad, string memory lowerQuery) private view returns (uint256) {
        uint256 score = 0;
        
        // Title match (highest weight)
        if (_contains(_toLower(ad.title), lowerQuery)) {
            score += 50;
        }
        
        // Content match
        if (_contains(_toLower(ad.content), lowerQuery)) {
            score += 25;
        }
        
        // Category match
        if (_contains(_toLower(ad.category), lowerQuery)) {
            score += 20;
        }
        
        // Keyword matches
        for (uint i = 0; i < ad.keywords.length; i++) {
            if (_contains(_toLower(ad.keywords[i]), lowerQuery)) {
                score += 15;
            }
        }
        
        // Tag matches
        for (uint i = 0; i < ad.tags.length; i++) {
            if (_contains(_toLower(ad.tags[i]), lowerQuery)) {
                score += 10;
            }
        }
        
        // Engagement boost
        score += (ad.views / 100) + (ad.engagement / 10);
        
        return score;
    }
    
    function _generateResponse(string memory query, uint256[] memory adIds, uint256 resultCount) private view returns (string memory) {
        if (resultCount == 0) {
            return string(abi.encodePacked("No advertisements found for '", query, "'. Try different keywords or browse our categories."));
        }
        
        string memory response = string(abi.encodePacked("Based on your query '", query, "', I found ", _uintToString(resultCount), " relevant advertisements:\n\n"));
        
        for (uint i = 0; i < resultCount && i < 3; i++) { // Limit to top 3 for response
            AdContent storage ad = advertisements[adIds[i]];
            response = string(abi.encodePacked(
                response,
                _uintToString(i + 1), ". ", ad.title, "\n",
                "Category: ", ad.category, "\n",
                "Summary: ", _truncateString(ad.content, 100), "...\n\n"
            ));
        }
        
        if (resultCount > 3) {
            response = string(abi.encodePacked(response, "And ", _uintToString(resultCount - 3), " more results available."));
        }
        
        return response;
    }
    
    // Utility functions
    function _contains(string memory str, string memory substr) private pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory substrBytes = bytes(substr);
        
        if (substrBytes.length == 0) return true;
        if (strBytes.length < substrBytes.length) return false;
        
        for (uint i = 0; i <= strBytes.length - substrBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < substrBytes.length; j++) {
                if (strBytes[i + j] != substrBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }
    
    function _toLower(string memory str) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        for (uint i = 0; i < strBytes.length; i++) {
            if (strBytes[i] >= 0x41 && strBytes[i] <= 0x5A) {
                strBytes[i] = bytes1(uint8(strBytes[i]) + 32);
            }
        }
        return string(strBytes);
    }
    
    function _removeFromArray(uint256[] storage array, uint256 value) private {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }
    
    function _uintToString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
    
    function _truncateString(string memory str, uint256 maxLength) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        if (strBytes.length <= maxLength) return str;
        
        bytes memory truncated = new bytes(maxLength);
        for (uint i = 0; i < maxLength; i++) {
            truncated[i] = strBytes[i];
        }
        
        return string(truncated);
    }
    
    // Getter functions
    function getAd(uint256 adId) public view validAdId(adId) returns (AdContent memory) {
        return advertisements[adId];
    }
    
    function getAdsByCategory(string memory category) public view returns (uint256[] memory) {
        return categoryToAds[category];
    }
    
    function getAdsByKeyword(string memory keyword) public view returns (uint256[] memory) {
        return keywordToAds[keyword];
    }
    
    function getMyAds() public view returns (uint256[] memory) {
        return ownerToAds[msg.sender];
    }
    
    function getAllActiveAds() public view returns (uint256[] memory) {
        uint256[] memory activeAds = new uint256[](totalAds);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextAdId; i++) {
            if (advertisements[i].isActive) {
                activeAds[count] = i;
                count++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = activeAds[i];
        }
        
        return result;
    }
    
    // Analytics functions
    function getAdAnalytics(uint256 adId) public view validAdId(adId) returns (uint256 views, uint256 engagement, uint256 rating) {
        AdContent storage ad = advertisements[adId];
        return (ad.views, ad.engagement, ad.rating);
    }
    
    function getTotalStats() public view returns (uint256 totalViews, uint256 totalEngagement, uint256 activeAds) {
        uint256 views = 0;
        uint256 engagement = 0;
        uint256 active = 0;
        
        for (uint256 i = 1; i < nextAdId; i++) {
            if (advertisements[i].isActive) {
                views += advertisements[i].views;
                engagement += advertisements[i].engagement;
                active++;
            }
        }
        
        return (views, engagement, active);
    }
    
    function getQueryStats(string memory query) public view returns (uint256 count) {
        return queryCount[query];
    }
    
    // Admin functions
    function toggleAdStatus(uint256 adId) public onlyAdOwner(adId) validAdId(adId) {
        advertisements[adId].isActive = !advertisements[adId].isActive;
    }
    
    function incrementEngagement(uint256 adId) public validAdId(adId) {
        advertisements[adId].engagement++;
    }
    
    function rateAd(uint256 adId, uint256 rating) public validAdId(adId) {
        require(rating <= 5, "Rating must be 0-5");
        advertisements[adId].rating = rating;
    }
    
    function updateRAGConfig(uint256 maxResults, uint256 minScore, bool enableAutoGen) public onlyRAGOwner {
        ragConfig.maxResults = maxResults;
        ragConfig.minRelevanceScore = minScore;
        ragConfig.enableAutoGeneration = enableAutoGen;
        
        emit ConfigUpdated(msg.sender, maxResults, minScore);
    }
    
    function transferRAGOwnership(address newOwner) public onlyRAGOwner {
        require(newOwner != address(0), "Invalid address");
        ragConfig.owner = newOwner;
    }
}