# 🏛️ Minimal DAO Ecosystem

A complete minimal DAO ecosystem built with:

- **ERC-20-based governance token** (GovToken)
- **ETH-based staking with reward accrual**
- **On-chain DAO governance with proposals and voting**

Developed using **Hardhat**, **TypeScript**, and **Ignition** (EVM-compatible).

---

## 🔧 Environment Setup

```bash
git clone https://github.com/your-username/minimal-dao.git
cd minimal-dao

# Install dependencies
npm install

# Create .env file
touch .env
```


.env contents:
PRIVATE_KEY=your_wallet_private_key_without_0x
INFURA_API_KEY=your_infura_or_alchemy_project_id


---

## 🔧 Architecture Overview


User
 │
 ├── stakes ETH ──────────────┐
 │                            ↓
 │                     ┌────────────┐
 │                     │  Staking   │
 │                     └────────────┘
 │                             │
 │                             ▼
 │                    Mint GovToken (ERC-20)
 │                             │
 │                             ▼
 │                    ┌──────────────┐
 │                    │  GovToken    │
 │                    └──────────────┘
 │                             │
 └── uses GovToken to vote     ▼
                       ┌──────────────────┐
                       │ DAO Governance   │
                       └──────────────────┘

---

## How to Deploy

1. Compile Contracts

```bash
npx hardhat compile
```

2. Deploy USing Ignition

```bash
npx hardhat ignition deploy ignition/modules/DAOModule.ts --network sepolia
```

This will deploy:

GovToken
Staking (ETH-based, mints GovToken)
DAOGovernance (proposal voting)

Make sure your .env is configured before running.

---

## How to Test

```bash
npx hardhat test

The test suite covers:

✅ Staking and Unstaking ETH

⏳ GovToken Reward Accrual

🪙 Controlled Token Minting

🗳️ Proposal Creation and Voting

❌ Unauthorized Access Reverts

Includes test for emitted events and voting results.


---

## Public Contract Address

GovToken: 0xfBb8E023Ab050f0B16970ac6a216a53043d73494
Staking: 0x601EEe50ADEa0E1a389122A4a43366e2d445e23A
Governance: 0x5462F5937078430611c54378A76Ce8fD8856ad90



---

## 🔧 Architecture Overview

```bash
minimal-dao/
├── contracts/
│   ├── GovToken.sol
│   ├── Staking.sol
│   └── DAOGovernance.sol
├── ignition/
│   └── modules/
│       └── DAOModule.ts
├── test/
│   └── dao.test.ts
├── .env
├── hardhat.config.ts
└── README.md

---

## Features & Design

✅ GovToken
ERC-20 token

Minting only allowed via the Staking contract

✅ Staking
Accepts ETH as the staking asset

Tracks stake time and accrues rewards linearly

Minting ratio: customizable (e.g. 1 GovToken per second per ETH)

Functions: stake(), unstake(), claimGovToken()

✅ DAOGovernance
createProposal(description, durationSeconds)

vote(proposalId, support)

getProposalStatus(proposalId)

Emits ProposalCreated, Voted

Simple yes/no voting logic

Uses GovToken.balanceOf() at time of voting (not snapshot-based)


---

## Author
Built by Amitesh — Blockchain & AI