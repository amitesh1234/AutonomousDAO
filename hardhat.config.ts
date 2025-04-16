import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ? `0x${process.env.PRIVATE_KEY}` : ""],
    }
  },
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts"
  }
};

export default config;
