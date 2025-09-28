import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const externalContracts = {
  "5940": {
    "Moderator": {
      "address": "0x88F0e295693cdAcBE98b4e00D1488303c6476c44",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "initialOwner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderator",
              "type": "address"
            }
          ],
          "name": "ModeratorActionPerformed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "ModeratorAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "name": "ModeratorStatusChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "name": "ModeratorUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "ServiceExpired",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            }
          ],
          "name": "ServicePurchased",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "activeModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "addModerator",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "addressToModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "emergencyPauseService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "expireService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getActivePurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllServicePricing",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "_moderatorIds",
              "type": "uint256[]"
            }
          ],
          "name": "getBatchModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "getModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getModeratorStats",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            }
          ],
          "name": "getServicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserPurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isActiveModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "isModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "moderatorData",
          "outputs": [
            {
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "profileImageURI",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "actionsCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextServiceId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "performModeratorAction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            }
          ],
          "name": "purchaseModeratorService",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "purchasedServices",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "servicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "pricePerHour",
              "type": "uint256"
            }
          ],
          "name": "setServicePricing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "toggleModeratorStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "updateModerator",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "userPurchases",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    }
  },
  "5941": {
    "Moderator": {
      "address": "0x88F0e295693cdAcBE98b4e00D1488303c6476c44",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "initialOwner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderator",
              "type": "address"
            }
          ],
          "name": "ModeratorActionPerformed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "ModeratorAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "name": "ModeratorStatusChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "name": "ModeratorUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "ServiceExpired",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            }
          ],
          "name": "ServicePurchased",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "activeModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "addModerator",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "addressToModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "emergencyPauseService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "expireService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getActivePurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllServicePricing",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "_moderatorIds",
              "type": "uint256[]"
            }
          ],
          "name": "getBatchModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "getModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getModeratorStats",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            }
          ],
          "name": "getServicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserPurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isActiveModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "isModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "moderatorData",
          "outputs": [
            {
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "profileImageURI",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "actionsCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextServiceId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "performModeratorAction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            }
          ],
          "name": "purchaseModeratorService",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "purchasedServices",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "servicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "pricePerHour",
              "type": "uint256"
            }
          ],
          "name": "setServicePricing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "toggleModeratorStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "updateModerator",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "userPurchases",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    }
  },
  "5942": {
    "Moderator": {
      "address": "0x88F0e295693cdAcBE98b4e00D1488303c6476c44",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "initialOwner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderator",
              "type": "address"
            }
          ],
          "name": "ModeratorActionPerformed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "ModeratorAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "name": "ModeratorStatusChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "name": "ModeratorUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "ServiceExpired",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            }
          ],
          "name": "ServicePurchased",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "activeModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "addModerator",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "addressToModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "emergencyPauseService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "expireService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getActivePurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllServicePricing",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "_moderatorIds",
              "type": "uint256[]"
            }
          ],
          "name": "getBatchModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "getModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getModeratorStats",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            }
          ],
          "name": "getServicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserPurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isActiveModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "isModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "moderatorData",
          "outputs": [
            {
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "profileImageURI",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "actionsCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextServiceId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "performModeratorAction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            }
          ],
          "name": "purchaseModeratorService",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "purchasedServices",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "servicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "pricePerHour",
              "type": "uint256"
            }
          ],
          "name": "setServicePricing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "toggleModeratorStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "updateModerator",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "userPurchases",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    }
  },
  "5943": {
    "Moderator": {
      "address": "0x88F0e295693cdAcBE98b4e00D1488303c6476c44",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "initialOwner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderator",
              "type": "address"
            }
          ],
          "name": "ModeratorActionPerformed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "ModeratorAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "name": "ModeratorStatusChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "name": "ModeratorUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "ServiceExpired",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            }
          ],
          "name": "ServicePurchased",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "activeModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "addModerator",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "addressToModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "emergencyPauseService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "expireService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getActivePurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllServicePricing",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "_moderatorIds",
              "type": "uint256[]"
            }
          ],
          "name": "getBatchModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "getModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getModeratorStats",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            }
          ],
          "name": "getServicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserPurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isActiveModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "isModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "moderatorData",
          "outputs": [
            {
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "profileImageURI",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "actionsCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextServiceId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "performModeratorAction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            }
          ],
          "name": "purchaseModeratorService",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "purchasedServices",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "servicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "pricePerHour",
              "type": "uint256"
            }
          ],
          "name": "setServicePricing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "toggleModeratorStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "updateModerator",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "userPurchases",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    }
  },
  "5944": {
    "Moderator": {
      "address": "0x88F0e295693cdAcBE98b4e00D1488303c6476c44",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "initialOwner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderator",
              "type": "address"
            }
          ],
          "name": "ModeratorActionPerformed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "ModeratorAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "name": "ModeratorStatusChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "moderatorId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "name": "ModeratorUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "ServiceExpired",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            }
          ],
          "name": "ServicePurchased",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "activeModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "addModerator",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "addressToModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "emergencyPauseService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            }
          ],
          "name": "expireService",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getActivePurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModerators",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllModeratorsWithInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllServicePricing",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "_moderatorIds",
              "type": "uint256[]"
            }
          ],
          "name": "getBatchModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "getModeratorInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "moderatorId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "moderatorAddress",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "profileImageURI",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "actionsCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.ModeratorInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getModeratorStats",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            }
          ],
          "name": "getServicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserPurchases",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "serviceId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "serviceType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "durationHours",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "cost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isActive",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ModeratorWithPurchases.PurchasedService[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isActiveModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "isModerator",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "moderatorData",
          "outputs": [
            {
              "internalType": "address",
              "name": "moderatorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "profileImageURI",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "actionsCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextModeratorId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextServiceId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "performModeratorAction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            }
          ],
          "name": "purchaseModeratorService",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "purchasedServices",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationHours",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "cost",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "servicePricing",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "serviceType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "pricePerHour",
              "type": "uint256"
            }
          ],
          "name": "setServicePricing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            }
          ],
          "name": "toggleModeratorStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalModerators",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_moderatorId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_profileImageURI",
              "type": "string"
            }
          ],
          "name": "updateModerator",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "userPurchases",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    }
  }
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
