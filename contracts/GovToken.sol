// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GovToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    address public stakingContract;

    event StakingContractSet(address indexed stakingContract);
    event GovTokenMinted(address indexed to, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __ERC20_init("GovToken", "GOV");
        __Ownable_init(initialOwner);
    }

    function setStakingContract(address _stakingContract) external onlyOwner {
        stakingContract = _stakingContract;
        emit StakingContractSet(_stakingContract);
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == stakingContract, "Not authorized");
        require(to != address(0), "Cannot mint to zero address");
        _mint(to, amount);
        emit GovTokenMinted(to, amount);
    }
}
