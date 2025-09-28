// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ModeratorWithPurchases is Ownable {
    using Strings for uint256;

    struct ModeratorData {
        address moderatorAddress;
        string name;
        string description;
        string profileImageURI;
        uint256 createdAt;
        bool isActive;
        uint256 actionsCount;
    }

    struct ModeratorInfo {
        uint256 moderatorId;
        address moderatorAddress;
        string name;
        string description;
        string profileImageURI;
        uint256 createdAt;
        bool isActive;
        uint256 actionsCount;
    }

    struct PurchasedService {
        uint256 serviceId;
        address buyer;
        string serviceType;
        uint256 durationHours;
        uint256 startTime;
        uint256 endTime;
        uint256 cost;
        bool isActive;
        uint256 createdAt;
    }

    // Moderator mappings
    mapping(uint256 => ModeratorData) public moderatorData;
    mapping(address => uint256) public addressToModeratorId;
    mapping(address => bool) public isModerator;
    
    // Purchase mappings
    mapping(uint256 => PurchasedService) public purchasedServices;
    mapping(address => uint256[]) public userPurchases;
    
    uint256 public nextModeratorId = 1;
    uint256 public totalModerators = 0;
    uint256 public activeModerators = 0;
    uint256 public nextServiceId = 1;

    // Service pricing (in wei)
    mapping(string => uint256) public servicePricing;

    event ModeratorAdded(uint256 indexed moderatorId, address indexed moderatorAddress, string name);
    event ModeratorUpdated(uint256 indexed moderatorId, string name, string description);
    event ModeratorStatusChanged(uint256 indexed moderatorId, bool isActive);
    event ModeratorActionPerformed(uint256 indexed moderatorId, address indexed moderator);
    event ServicePurchased(uint256 indexed serviceId, address indexed buyer, string serviceType, uint256 duration, uint256 cost);
    event ServiceExpired(uint256 indexed serviceId);

    constructor(address initialOwner) Ownable(initialOwner) {
        // Set default pricing (in wei, 1 KDA = 10^18 wei)
        servicePricing["RAG Moderator"] = 50000000000000000; // 0.05 KDA per hour
        servicePricing["Ad Moderator"] = 80000000000000000; // 0.08 KDA per hour
        servicePricing["Moderation Agent"] = 120000000000000000; // 0.12 KDA per hour
    }

    modifier onlyModerator() {
        require(isModerator[msg.sender], "Not authorized: must be an active moderator");
        require(moderatorData[addressToModeratorId[msg.sender]].isActive, "Moderator account is inactive");
        _;
    }

    modifier onlyOwnerOrModerator() {
        require(msg.sender == owner() || isModerator[msg.sender], "Not authorized: must be owner or moderator");
        _;
    }

    // ==================== MODERATOR FUNCTIONS ====================

    function addModerator(
        address _moderatorAddress,
        string memory _name,
        string memory _description,
        string memory _profileImageURI
    ) public onlyOwner returns (uint256) {
        require(_moderatorAddress != address(0), "Invalid moderator address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(!isModerator[_moderatorAddress], "Address is already a moderator");
        
        uint256 moderatorId = nextModeratorId++;
        
        moderatorData[moderatorId] = ModeratorData({
            moderatorAddress: _moderatorAddress,
            name: _name,
            description: _description,
            profileImageURI: _profileImageURI,
            createdAt: block.timestamp,
            isActive: true,
            actionsCount: 0
        });
        
        addressToModeratorId[_moderatorAddress] = moderatorId;
        isModerator[_moderatorAddress] = true;
        totalModerators++;
        activeModerators++;
        
        emit ModeratorAdded(moderatorId, _moderatorAddress, _name);
        return moderatorId;
    }

    function updateModerator(
        uint256 _moderatorId,
        string memory _name,
        string memory _description,
        string memory _profileImageURI
    ) public {
        require(_moderatorId > 0 && _moderatorId < nextModeratorId, "Invalid moderator ID");
        require(
            msg.sender == owner() || msg.sender == moderatorData[_moderatorId].moderatorAddress,
            "Not authorized to update this moderator"
        );
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        moderatorData[_moderatorId].name = _name;
        moderatorData[_moderatorId].description = _description;
        moderatorData[_moderatorId].profileImageURI = _profileImageURI;
        
        emit ModeratorUpdated(_moderatorId, _name, _description);
    }

    function toggleModeratorStatus(uint256 _moderatorId) public onlyOwner {
        require(_moderatorId > 0 && _moderatorId < nextModeratorId, "Invalid moderator ID");
        
        bool currentStatus = moderatorData[_moderatorId].isActive;
        moderatorData[_moderatorId].isActive = !currentStatus;
        
        if (currentStatus) {
            activeModerators--;
        } else {
            activeModerators++;
        }
        
        emit ModeratorStatusChanged(_moderatorId, !currentStatus);
    }

    function performModeratorAction() public onlyModerator {
        uint256 moderatorId = addressToModeratorId[msg.sender];
        moderatorData[moderatorId].actionsCount++;
        
        emit ModeratorActionPerformed(moderatorId, msg.sender);
    }

    // ==================== PURCHASE FUNCTIONS ====================

    function purchaseModeratorService(
        string memory serviceType,
        uint256 durationHours
    ) public payable returns (uint256) {
        require(durationHours > 0 && durationHours <= 168, "Duration must be between 1 and 168 hours");
        require(servicePricing[serviceType] > 0, "Invalid service type");
        
        uint256 totalCost = servicePricing[serviceType] * durationHours;
        require(msg.value >= totalCost, "Insufficient payment");
        
        uint256 serviceId = nextServiceId++;
        uint256 endTime = block.timestamp + (durationHours * 3600);
        
        purchasedServices[serviceId] = PurchasedService({
            serviceId: serviceId,
            buyer: msg.sender,
            serviceType: serviceType,
            durationHours: durationHours,
            startTime: block.timestamp,
            endTime: endTime,
            cost: totalCost,
            isActive: true,
            createdAt: block.timestamp
        });
        
        userPurchases[msg.sender].push(serviceId);
        
        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit ServicePurchased(serviceId, msg.sender, serviceType, durationHours, totalCost);
        return serviceId;
    }

    function expireService(uint256 serviceId) public {
        require(serviceId > 0 && serviceId < nextServiceId, "Invalid service ID");
        require(purchasedServices[serviceId].isActive, "Service already expired");
        require(block.timestamp >= purchasedServices[serviceId].endTime, "Service not yet expired");
        
        purchasedServices[serviceId].isActive = false;
        emit ServiceExpired(serviceId);
    }

    function setServicePricing(string memory serviceType, uint256 pricePerHour) public onlyOwner {
        servicePricing[serviceType] = pricePerHour;
    }

    // ==================== VIEW FUNCTIONS ====================

    function getModeratorInfo(uint256 _moderatorId) public view returns (ModeratorInfo memory) {
        require(_moderatorId > 0 && _moderatorId < nextModeratorId, "Invalid moderator ID");
        
        ModeratorData memory data = moderatorData[_moderatorId];
        return ModeratorInfo({
            moderatorId: _moderatorId,
            moderatorAddress: data.moderatorAddress,
            name: data.name,
            description: data.description,
            profileImageURI: data.profileImageURI,
            createdAt: data.createdAt,
            isActive: data.isActive,
            actionsCount: data.actionsCount
        });
    }

    function getAllModerators() public view returns (uint256[] memory) {
        uint256[] memory allModerators = new uint256[](totalModerators);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i < nextModeratorId; i++) {
            if (moderatorData[i].moderatorAddress != address(0)) {
                allModerators[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return allModerators;
    }

    function getActiveModerators() public view returns (uint256[] memory) {
        uint256[] memory activeModeratorsList = new uint256[](activeModerators);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i < nextModeratorId; i++) {
            if (moderatorData[i].moderatorAddress != address(0) && moderatorData[i].isActive) {
                activeModeratorsList[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return activeModeratorsList;
    }

    function getBatchModeratorInfo(uint256[] memory _moderatorIds) public view returns (ModeratorInfo[] memory) {
        ModeratorInfo[] memory infos = new ModeratorInfo[](_moderatorIds.length);
        
        for (uint256 i = 0; i < _moderatorIds.length; i++) {
            infos[i] = getModeratorInfo(_moderatorIds[i]);
        }
        
        return infos;
    }

    function getAllModeratorsWithInfo() public view returns (ModeratorInfo[] memory) {
        uint256[] memory allModerators = getAllModerators();
        return getBatchModeratorInfo(allModerators);
    }

    function getActiveModeratorsWithInfo() public view returns (ModeratorInfo[] memory) {
        uint256[] memory activeModerators = getActiveModerators();
        return getBatchModeratorInfo(activeModerators);
    }

    function isActiveModerator(address _address) public view returns (bool) {
        if (!isModerator[_address]) return false;
        uint256 moderatorId = addressToModeratorId[_address];
        return moderatorData[moderatorId].isActive;
    }

    function getModeratorStats() public view returns (uint256, uint256, uint256) {
        return (totalModerators, activeModerators, nextModeratorId - 1);
    }

    // Purchase view functions
    function getUserPurchases(address user) public view returns (PurchasedService[] memory) {
        uint256[] memory serviceIds = userPurchases[user];
        PurchasedService[] memory services = new PurchasedService[](serviceIds.length);
        
        for (uint256 i = 0; i < serviceIds.length; i++) {
            services[i] = purchasedServices[serviceIds[i]];
        }
        
        return services;
    }

    function getActivePurchases(address user) public view returns (PurchasedService[] memory) {
        uint256[] memory serviceIds = userPurchases[user];
        uint256 activeCount = 0;
        
        // Count active services
        for (uint256 i = 0; i < serviceIds.length; i++) {
            if (purchasedServices[serviceIds[i]].isActive && 
                block.timestamp < purchasedServices[serviceIds[i]].endTime) {
                activeCount++;
            }
        }
        
        // Create array of active services
        PurchasedService[] memory activeServices = new PurchasedService[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < serviceIds.length; i++) {
            if (purchasedServices[serviceIds[i]].isActive && 
                block.timestamp < purchasedServices[serviceIds[i]].endTime) {
                activeServices[currentIndex] = purchasedServices[serviceIds[i]];
                currentIndex++;
            }
        }
        
        return activeServices;
    }

    function getServicePricing(string memory serviceType) public view returns (uint256) {
        return servicePricing[serviceType];
    }

    function getAllServicePricing() public view returns (string[] memory, uint256[] memory) {
        string[] memory serviceTypes = new string[](3);
        uint256[] memory prices = new uint256[](3);
        
        serviceTypes[0] = "RAG Moderator";
        serviceTypes[1] = "Ad Moderator";
        serviceTypes[2] = "Moderation Agent";
        
        prices[0] = servicePricing["RAG Moderator"];
        prices[1] = servicePricing["Ad Moderator"];
        prices[2] = servicePricing["Moderation Agent"];
        
        return (serviceTypes, prices);
    }

    // Withdraw function for owner
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    // Emergency pause for services (if needed)
    function emergencyPauseService(uint256 serviceId) public onlyOwner {
        require(serviceId > 0 && serviceId < nextServiceId, "Invalid service ID");
        purchasedServices[serviceId].isActive = false;
        emit ServiceExpired(serviceId);
    }
}