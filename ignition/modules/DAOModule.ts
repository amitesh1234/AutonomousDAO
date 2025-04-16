// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DAOModule = buildModule("DAOModule", (m) => {
  const rewardRatePerSecond = 100;
  const govToken = m.contract("GovToken", []);

  const staking = m.contract("GovStaking", [govToken, rewardRatePerSecond]);
  m.call(govToken, "setStakingContract", [staking]);

  const governance = m.contract("DAOGovernance", [govToken]);

  return { govToken, staking, governance };
});

export default DAOModule;
