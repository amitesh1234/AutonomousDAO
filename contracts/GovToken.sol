// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovToken is ERC20, Ownable {
    address public stakingContract;

    event StakingContractSet(address indexed stakingContract);
    event GovTokenMinted(address indexed to, uint256 amount);

    constructor() ERC20("GovToken", "GOV") Ownable(msg.sender){}

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