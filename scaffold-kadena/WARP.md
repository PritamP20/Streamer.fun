# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is Scaffold Kadena, a custom fork of Scaffold-ETH 2 specialized for building dApps on Kadena's EVM networks. It supports development across multiple environments: local Hardhat chains, Kadena Sandbox, and Kadena Testnet chains (20-24).

## Architecture

### Multi-Workspace Setup
- **packages/hardhat/**: Smart contract development with specialized Kadena plugins
- **packages/nextjs/**: Frontend React/Next.js application with multi-chain support

### Key Dependencies
- `@kadena/hardhat-chainweb`: Multi-environment Kadena EVM chain interaction
- `@kadena/hardhat-kadena-create2`: Deterministic deployments across chains
- OpenZeppelin Contracts v5.x (note: imports use `utils/` path structure)

### Chain Configuration
The project supports dual environment modes:
- **Localhost**: 2 chains (0, 1) via Hardhat
- **Testnet**: 5 chains (20-24) on Kadena Testnet

Environment switching is controlled via `NEXT_PUBLIC_USE_LOCALHOST` in `packages/nextjs/.env`.

## Essential Commands

### Development Setup
```bash
yarn install                    # Install all dependencies
yarn chain                      # Start local Hardhat chains (2 chains)
yarn deploy:localhost           # Deploy to local chains
yarn start                      # Start Next.js frontend
```

### Contract Development
```bash
yarn hardhat:compile            # Compile contracts
yarn hardhat:test              # Run contract tests
yarn hardhat:clean             # Clean artifacts
yarn format                    # Format contracts and frontend code
```

### Multi-Chain Deployment
```bash
yarn deploy:testnet            # Deploy to all Kadena testnet chains using CREATE2
yarn verify:testnet            # Verify contracts on Blockscout explorers
```

### Account Management
```bash
yarn account:generate          # Generate encrypted deployer account
yarn account:import            # Import existing private key (encrypted)
yarn account:reveal-pk         # Reveal private key for debugging
```

### Testing
```bash
yarn test                      # Run all contract tests
yarn hardhat:test              # Run hardhat tests specifically
```

## Important Notes

### OpenZeppelin v5.x Changes
When using OpenZeppelin contracts, imports have changed:
- ❌ `@openzeppelin/contracts/security/ReentrancyGuard.sol`
- ✅ `@openzeppelin/contracts/utils/ReentrancyGuard.sol`

### Environment Files
Two `.env` files need configuration:
- `packages/hardhat/.env` - For deployer keys and chain configs
- `packages/nextjs/.env` - For frontend environment switching

### Chain-Specific Features
- Each testnet chain has its own Blockscout explorer at `chain-{id}.evm-testnet-blockscout.chainweb.com`
- CREATE2 deployments ensure same contract addresses across all chains
- Contract verification happens automatically during testnet deployment

### Development Workflow
1. Develop contracts in `packages/hardhat/contracts/`
2. Test with local chains using `yarn chain` + `yarn deploy:localhost`
3. Frontend development with `yarn start` (auto-reloads on contract changes)
4. Deploy to testnet with `yarn deploy:testnet` when ready

## Contract Structure

The project includes example contracts:
- `StreamerNFT.sol`: ERC721 with expiration mechanics and on-chain metadata
- `MarketPlace.sol`: NFT marketplace with reentrancy protection
- `YourContract.sol`: Basic scaffold contract template

Tests are located in `packages/hardhat/test/` and use Chai/Ethers.js with Hardhat's multi-chain testing environment.