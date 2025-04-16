// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0

pragma solidity ^0.8.22;

// import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { GovToken } from "./GovToken.sol";

contract GovStaking is ReentrancyGuard {
    // IERC20 public baseToken;
    GovToken public govToken;
    uint256 public rewardRatePerSecond;

    struct StakeInfo {
        uint256 amount;
        uint256 lastClaimed;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(GovToken _govToken, uint256 _rewardRatePerSecond) {
        govToken = _govToken;
        rewardRatePerSecond = _rewardRatePerSecond;
    }

     function stake() external payable {
        require(msg.value > 0, "Stake > 0");

        StakeInfo storage info = stakes[msg.sender];
        if (info.amount > 0) {
            _claim();
        }

        info.amount += msg.value;
        info.lastClaimed = block.timestamp;

        emit Staked(msg.sender, msg.value);
    }

    function unstake() external nonReentrant {
        uint256 amount = stakes[msg.sender].amount;
        require(amount > 0, "ERR402: Unstake");
        _claim();
        stakes[msg.sender].amount = 0;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "ETH transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    function claimGovToken() external nonReentrant {
        uint256 reward = _claim();
        emit RewardClaimed(msg.sender, reward);
    }

    function _claim() internal returns (uint256) {
        StakeInfo storage info = stakes[msg.sender];
        uint256 timeDiff = block.timestamp - info.lastClaimed;
        uint256 reward = 0;
        if (info.amount > 0 && timeDiff > 0) {
            reward = timeDiff * rewardRatePerSecond * info.amount / 1e18;
            govToken.mint(msg.sender, reward);
        }
        info.lastClaimed = block.timestamp;
        return reward;
    }
}