import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const externalContracts = {
  "5920": {
    "YesNoMarket": {
      "address": "0xf8AD2166411BE559b3DBa7b969587178ABE07Ab3",
      "abi": [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Claimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "MarketCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            }
          ],
          "name": "Resolved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "StreamerFeeClaimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claimStreamerFee",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationSeconds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "createMarket",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "getMarket",
          "outputs": [
            {
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "yesPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "yesCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalPool",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserStake",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "yesAmt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noAmt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextMarketId",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "resolve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ]
    }
  },
  "5921": {
    "YesNoMarket": {
      "address": "0xf8AD2166411BE559b3DBa7b969587178ABE07Ab3",
      "abi": [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Claimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "MarketCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            }
          ],
          "name": "Resolved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "StreamerFeeClaimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claimStreamerFee",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationSeconds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "createMarket",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "getMarket",
          "outputs": [
            {
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "yesPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "yesCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalPool",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserStake",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "yesAmt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noAmt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextMarketId",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "resolve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ]
    }
  },
  "5922": {
    "YesNoMarket": {
      "address": "0xf8AD2166411BE559b3DBa7b969587178ABE07Ab3",
      "abi": [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Claimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "MarketCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            }
          ],
          "name": "Resolved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "StreamerFeeClaimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claimStreamerFee",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationSeconds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "createMarket",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "getMarket",
          "outputs": [
            {
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "yesPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "yesCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalPool",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserStake",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "yesAmt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noAmt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextMarketId",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "resolve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ]
    }
  },
  "5923": {
    "YesNoMarket": {
      "address": "0xf8AD2166411BE559b3DBa7b969587178ABE07Ab3",
      "abi": [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Claimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "MarketCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            }
          ],
          "name": "Resolved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "StreamerFeeClaimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claimStreamerFee",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationSeconds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "createMarket",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "getMarket",
          "outputs": [
            {
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "yesPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "yesCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalPool",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserStake",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "yesAmt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noAmt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextMarketId",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "resolve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ]
    }
  },
  "5924": {
    "YesNoMarket": {
      "address": "0xf8AD2166411BE559b3DBa7b969587178ABE07Ab3",
      "abi": [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Claimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "MarketCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            }
          ],
          "name": "Resolved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "StreamerFeeClaimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "claimStreamerFee",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "durationSeconds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "createMarket",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            }
          ],
          "name": "getMarket",
          "outputs": [
            {
              "internalType": "address",
              "name": "streamer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "question",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "yesPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noPool",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "yesCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalPool",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserStake",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "yesAmt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "noAmt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nextMarketId",
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
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "resolve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcomeYes",
              "type": "bool"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ]
    }
  }
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
