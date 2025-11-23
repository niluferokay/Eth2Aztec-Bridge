# Eth2Aztec Bridge
A lightweight cross-chain onramp that lets users claim USDC on Ethereum Sepolia and bridge it privately into the Aztec Obsidian network.

## Features
- TestUSDC faucet (1000 tUSDC every 24h)
- Smart contracts deployed on Sepolia
- Backend signer using Express + Ethers.js
- React UI with wallet connect and tx status
- Built-in Human.tech → Aztec private bridge

## Stack
Solidity · Hardhat · Node.js · Express · Ethers.js  
React · Vite · Tailwind · shadcn/ui  
Human.tech Bridge · Aztec Obsidian

## Run Locally
```bash
npm install
npm run dev
```
## Create .env:
```
SEPOLIA_RPC_URL=...
PRIVATE_KEY=...
PORT=3000
```
