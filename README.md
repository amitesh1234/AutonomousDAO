# 🏛️ Minimal DAO Ecosystem


# --------FOR THIS UPGRADEABLE PART, STILL WORKING ON TESTS--------------- #

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

```bash
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
```

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
```

The test suite covers:

✅ Staking and Unstaking ETH

⏳ GovToken Reward Accrual

🪙 Controlled Token Minting

🗳️ Proposal Creation and Voting

❌ Unauthorized Access Reverts

Includes test for emitted events and voting results.


---

## Public Contract Address

ProxyAdmin: 0x1513C48B65226eEfBc2B1eE84bcbd2255612Cd1B
GovTokenImpl: 0xa2806C13B4AcEf13d2764A1bcB968Dd8b2B34A82
GovTokenTransparentUpGreadableProxy: 0x00dA338EF05Ed7150F4decB3572eb86FB8028397
GovStakingImpl: 0x201947dbA627B7C32D751E3fAC860e1fbD383F62
GovStakingTransparentUpGreadableProxy: 0x15e8b6475A1BD18B171C2d76dD95377c3a89FC28
DAOGovernanceImpl: 0xAE8BCBDbe0B2BE71b709b2dF32F241C3C2930252
DAOGovernanceTransparentUpGreadableProxy: 0x6955c81a2C813613bb597ba4bceBC87B70b9eB71



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
```
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