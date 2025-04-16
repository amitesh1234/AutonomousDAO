// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DAOModule = buildModule("DAOModule", (m) => {
  const initialOwner = m.getAccount(0);

  // Deploy implementation contract
  const govTokenImpl = m.contract("GovToken");

  // Deploy ProxyAdmin contract
  const proxyAdmin = m.contract(
    "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol:ProxyAdmin", [initialOwner]
  );

  // Encode initialization call
  const initializeCall = m.encodeFunctionCall(
    govTokenImpl,
    "initialize",
    [initialOwner]
  );

  // Deploy TransparentUpgradeableProxy
  const govTokenProxy = m.contract("TransparentUpgradeableProxy", [
    govTokenImpl,  // implementation address
    proxyAdmin,    // admin address (ProxyAdmin)
    initializeCall // initialization data
  ], {
    id: "TransparentUpgradeableProxy2",
  });

  const govToken = m.contractAt("GovToken", govTokenProxy, {
    id: "GovToken2",
  });
  const rewardRatePerSecond = 100;
  const govStakingImpl = m.contract("GovStaking");


  const govStakingInitCalldata = m.encodeFunctionCall(govStakingImpl, "initialize", [
    govTokenProxy,
    rewardRatePerSecond,
  ]);

  const govStakingProxy = m.contract("TransparentUpgradeableProxy", 
    [govStakingImpl, proxyAdmin, govStakingInitCalldata], {
      id: "TransparentUpgradeableProxy3",
    }
  );

  // const govStaking = m.contractAt("GovStaking", govStakingProxy);

  const daoGovernanceImpl = m.contract("DAOGovernance");


  const daoGovernanceInitCalldata = m.encodeFunctionCall(daoGovernanceImpl, "initialize", [
    govTokenProxy
  ]);

  const daoGovernanceProxy = m.contract("TransparentUpgradeableProxy", 
    [daoGovernanceImpl, proxyAdmin, daoGovernanceInitCalldata],
  );

  m.call(govToken, "setStakingContract", [govStakingProxy]);


  return {
    adminAddress: proxyAdmin,
    GovTokenProxyAddress: govTokenProxy,
    GovTokenimplementationAddress: govTokenImpl,
    GovStakingProxyAddress: govStakingProxy,
    GovStakingImplementationAddress: govStakingImpl,
    DAOGovernanceProxyAddress: daoGovernanceProxy,
    DAOGovernanceImplementationAddress: daoGovernanceImpl
  };
});

export default DAOModule;
