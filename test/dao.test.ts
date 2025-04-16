import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";


describe("Minimal DAO System", function () {
    let govToken: any;
    let staking: any;
    let governance: any;
    let owner: any;
    let user1: any;
    let user2: any;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        // Deploy GovToken
        const GovToken = await ethers.getContractFactory("GovToken");
        govToken = await GovToken.deploy();

        // Deploy StakingContract (ETH-based)
        const Staking = await ethers.getContractFactory("GovStaking");
        staking = await Staking.deploy(govToken.target, 1);

        // Set staking contract in GovToken
        await govToken.setStakingContract(staking.target);

        // Deploy Governance contract
        const DAO = await ethers.getContractFactory("DAOGovernance");
        governance = await DAO.deploy(govToken.target);
    });

    it("should not allow unpermitted minting access", async () => {
        await expect(
            govToken.connect(user1).mint(user2.address, ethers.parseEther("1"))
        ).to.be.revertedWith("Not authorized");
    });

    it("should allow staking and unstaking ETH", async () => {
        await staking.connect(user1).stake({ value: ethers.parseEther("1") });
        await time.increase(5);
        await staking.connect(user1).unstake();
        const balance = await ethers.provider.getBalance(staking.target);
        const govTokenBalance = await govToken.balanceOf(user1.address);
        expect(balance).to.equal(0);
        expect(govTokenBalance).to.be.gt(0);
    });

    it("should accrue rewards over time", async () => {
        await staking.connect(user1).stake({ value: ethers.parseEther("1") });
        await time.increase(10);
        await staking.connect(user1).claimGovToken();
        const reward = await govToken.balanceOf(user1.address);
        expect(reward).to.be.gt(0);
    });


    it("should mint GovTokens from staking contract", async () => {
        await staking.connect(user1).stake({ value: ethers.parseEther("1") });
        await time.increase(5);
        await staking.connect(user1).claimGovToken();
        const balance = await govToken.balanceOf(user1.address);
        expect(balance).to.be.gt(0);
    });

    it("should allow proposal creation and emit event", async () => {
        await staking.connect(user1).stake({ value: ethers.parseEther("1") });
        await time.increase(10);
        await staking.connect(user1).claimGovToken();

        const duration = 3600; // 1 hour
        const tx = await governance.connect(user1).createProposal("Upgrade to v2", duration);

        const blockTimestamp = (await ethers.provider.getBlock("latest"))?.timestamp || 0;

        const expectedDeadline = blockTimestamp + duration;

        await expect(tx)
            .to.emit(governance, "ProposalCreated")
            .withArgs(0, expectedDeadline);

        const proposal = await governance.proposals(0);
        expect(proposal.description).to.equal("Upgrade to v2");
    });

    it("should allow voting and show correct result", async () => {
        await staking.connect(user1).stake({ value: ethers.parseEther("1") });
        await staking.connect(user2).stake({ value: ethers.parseEther("2") });
        await time.increase(10);
        await staking.connect(user1).claimGovToken();
        await staking.connect(user2).claimGovToken();

        await governance.connect(user1).createProposal("Enable feature X", 300);
        await governance.connect(user1).vote(0, true); // yes
        await governance.connect(user2).vote(0, false); // no

        await time.increase(301);
        const status = await governance.getProposalStatus(0);

        expect(status).to.equal("Failed")
    });

});