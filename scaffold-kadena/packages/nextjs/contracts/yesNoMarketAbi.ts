export const YES_NO_MARKET_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "question", "type": "string" },
      { "internalType": "uint256", "name": "durationSeconds", "type": "uint256" },
      { "internalType": "uint256", "name": "feeBps", "type": "uint256" }
    ],
    "name": "createMarket",
    "outputs": [{ "internalType": "uint256", "name": "marketId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "marketId", "type": "uint256" }],
    "name": "getMarket",
    "outputs": [
      { "internalType": "address", "name": "streamer", "type": "address" },
      { "internalType": "string", "name": "question", "type": "string" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "bool", "name": "resolved", "type": "bool" },
      { "internalType": "bool", "name": "outcome", "type": "bool" },
      { "internalType": "uint256", "name": "yesPool", "type": "uint256" },
      { "internalType": "uint256", "name": "noPool", "type": "uint256" },
      { "internalType": "uint256", "name": "feeBps", "type": "uint256" },
      { "internalType": "uint256", "name": "yesCount", "type": "uint256" },
      { "internalType": "uint256", "name": "noCount", "type": "uint256" },
      { "internalType": "uint256", "name": "totalPool", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserStake",
    "outputs": [
      { "internalType": "uint256", "name": "yesAmt", "type": "uint256" },
      { "internalType": "uint256", "name": "noAmt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "internalType": "bool", "name": "outcomeYes", "type": "bool" }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "internalType": "bool", "name": "outcomeYes", "type": "bool" }
    ],
    "name": "resolve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "marketId", "type": "uint256" }],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "marketId", "type": "uint256" }],
    "name": "claimStreamerFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextMarketId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "streamer", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "question", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "feeBps", "type": "uint256" }
    ],
    "name": "MarketCreated",
    "type": "event"
  }
] as const;
