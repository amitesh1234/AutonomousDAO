// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0

pragma solidity ^0.8.22;

// import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
// import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { GovToken } from "./GovToken.sol";

contract DAOGovernance {
    GovToken public govToken;
    uint256 public proposalCount = 0;

    enum VoteType { NONE, YES, NO }

    struct Proposal {
        string description;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => VoteType) votes;
    }

    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 indexed proposalId, uint256 deadline);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);

    constructor(GovToken _govToken) {
        govToken = _govToken;
    }

    function createProposal(string memory _description, uint256 durationSeconds) external {
        Proposal storage p = proposals[proposalCount];
        p.description = _description;
        p.deadline = block.timestamp + durationSeconds;
        emit ProposalCreated(proposalCount, p.deadline);
        proposalCount++;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.deadline, "Voting closed");
        require(p.votes[msg.sender] == VoteType.NONE, "Already voted");

        uint256 voterPower = govToken.balanceOf(msg.sender);
        require(voterPower > 0, "No voting power");

        if (support) {
            p.yesVotes += voterPower;
            p.votes[msg.sender] = VoteType.YES;
        } else {
            p.noVotes += voterPower;
            p.votes[msg.sender] = VoteType.NO;
        }
        emit Voted(proposalId, msg.sender, support, voterPower);
    }

    function getProposalStatus(uint256 proposalId) external view returns (string memory status) {
        require(proposalId < proposalCount, "Proposal does not exist");
        Proposal storage p = proposals[proposalId];
        require(block.timestamp > p.deadline, "Still active");
        bool passed = p.yesVotes > p.noVotes;
        

        return passed ? "Passed" : "Failed";
    }
    
}