const { DoneAll } = require("@mui/icons-material");
const { wait } = require("@testing-library/user-event/dist/utils");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("DAO", () => {
  let token,
    dao,
    deployer,
    funder,
    investor1,
    investor2,
    investor3,
    investor4,
    investor5,
    user,
    recipient,
    transaction;

  beforeEach(async () => {
    // Set up accounts
    let accounts = await ethers.getSigners();
    deployer = accounts[0];
    funder = accounts[1];
    recipient = accounts[2];
    investor1 = accounts[3];
    investor2 = accounts[4];
    investor3 = accounts[5];
    investor4 = accounts[6];
    investor5 = accounts[7];
    user = accounts[8];

    // Deploy Token
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Dapp University", "DAPP", "1000000");

    // Send tokens to investors - each gets 20%
    transaction = await token
      .connect(deployer)
      .transfer(investor1.address, tokens(200000));
    await transaction.wait();
    transaction = await token
      .connect(deployer)
      .transfer(investor2.address, tokens(200000));
    await transaction.wait();
    transaction = await token
      .connect(deployer)
      .transfer(investor3.address, tokens(200000));
    await transaction.wait();
    transaction = await token
      .connect(deployer)
      .transfer(investor4.address, tokens(200000));
    await transaction.wait();
    transaction = await token
      .connect(deployer)
      .transfer(investor5.address, tokens(200000));
    await transaction.wait();

    // Get contract
    const DAO = await ethers.getContractFactory("DAO");
    // Deploy contract - pass args to deploy() if needed
    dao = await DAO.deploy(token.address, "500000000000000000000001");

    // Send 100 ether to dao after deployed from funder.
    // dao.address is the contract address.
    await funder.sendTransaction({ to: dao.address, value: ether(100) });
  });

  describe("Deployment", () => {
    it("sends ether to dao", async () => {
      expect(await ethers.provider.getBalance(dao.address)).to.equal(
        ether(100)
      );
    });

    it("returns token address", async () => {
      expect(await dao.token()).to.equal(token.address);
    });

    it("returns quorum", async () => {
      expect(await dao.quorum()).to.equal("500000000000000000000001");
    });
  });

  describe("Proposal Creation", () => {
    let transaction, result;
    describe("Success", () => {
      beforeEach(async () => {
        transaction = await dao
          .connect(investor1)
          .createProposal("Propsal 1", ether(100), recipient.address);
        result = await transaction.wait();
      });

      it("updates proposal count", async () => {
        expect(await dao.proposalCount()).to.equal(1);
      });

      it("updates proposal mapping", async () => {
        const proposal = await dao.proposals(1);
        expect(await proposal.id).to.equal(1);
        expect(await proposal.amount).to.equal(ether(100));
        expect(await proposal.recipient).to.equal(recipient.address);
      });

      it("emits propose event", async () => {
        await expect(transaction)
          .to.emit(dao, "Propose")
          .withArgs(1, ether(100), recipient.address, investor1.address);
      });
    });

    describe("Failure", () => {
      it("rejects invalide amount", async () => {
        await expect(
          dao
            .connect(investor1)
            .createProposal("Proposal 1", ether(1000), recipient.address)
        ).to.be.reverted;
      });

      it("rejects non investor", async () => {
        await expect(
          dao
            .connect(user)
            .createProposal("Proposal 1", ether(100), recipient.address)
        ).to.be.reverted;
      });
    });
  });

  describe("Voting", () => {
    let transaction, result;
    beforeEach(async () => {
      transaction = await dao
        .connect(investor1)
        .createProposal("Propsal 1", ether(100), recipient.address);
      result = await transaction.wait();
    });
    describe("Success", () => {
      beforeEach(async () => {
        transaction = await dao.connect(investor1).vote(1);
        result = await transaction.wait();
      });

      it("updates vote count", async () => {
        const proposal = await dao.proposals(1);
        expect(proposal.votes).to.equal(tokens(200000));
      });
      it("emits vote event", async () => {
        await expect(transaction)
          .to.emit(dao, "Vote")
          .withArgs(1, investor1.address);
      });
    });

    describe("Failure", () => {
      it("rejects non-investor", async () => {
        await expect(dao.connect(user).vote(1)).to.be.reverted;
      });
      it("rejects double voting", async () => {
        transaction = await dao.connect(investor1).vote(1);
        result = await transaction.wait();
        await expect(dao.connect(investor1).vote(1)).to.be.reverted;
      });
    });
  });

  describe("Governance", () => {
    let transaction, result;

    describe("Success", () => {
      beforeEach(async () => {
        // create proposal
        transaction = await dao
          .connect(investor1)
          .createProposal("Propsal 1", ether(100), recipient.address);
        result = await transaction.wait();

        // vote
        transaction = await dao.connect(investor1).vote(1);
        result = await transaction.wait();
        transaction = await dao.connect(investor2).vote(1);
        result = await transaction.wait();
        transaction = await dao.connect(investor3).vote(1);
        result = await transaction.wait();

        // finalize proposal
        transaction = await dao.connect(investor1).finalizeProposal(1);
        result = await transaction.wait();
      });
      it("transfer funds to recipient", async () => {
        expect(await ethers.provider.getBalance(recipient.address)).to.equal(
          tokens(10100)
        );
      });
      it("updates ateh proposal to finalized", async () => {
        const proposal = await dao.proposals(1);
        expect(proposal.finalized).to.equal(true);
      });
      it("emits a Finalzie event", async () => {
        await expect(transaction).to.emit(dao, "Finalize").withArgs(1);
      });
    });
    describe("Failure", () => {
      beforeEach(async () => {
        // create proposal
        transaction = await dao
          .connect(investor1)
          .createProposal("Propsal 1", ether(100), recipient.address);
        result = await transaction.wait();

        // vote
        transaction = await dao.connect(investor1).vote(1);
        result = await transaction.wait();
        transaction = await dao.connect(investor2).vote(1);
        result = await transaction.wait();
      });
      it("rejects finalization if not enough votes", async () => {
        await expect(dao.connect(investor1).finalizeProposal(1)).to.be.reverted;
      });
      it("rejects finalization from a non-investor", async () => {
        transaction = await dao.connect(investor3).vote(1);
        result = await transaction.wait();

        await expect(dao.connect(user).finalizeProposal(1)).to.be.reverted;
      });
      it("rejects propsoal if already finalized", async () => {
        transaction = await dao.connect(investor3).vote(1);
        result = await transaction.wait();
        // finalize proposal
        transaction = await dao.connect(investor1).finalizeProposal(1);
        result = await transaction.wait();
        // try to finalize again
        await expect(dao.connect(investor1).finalizeProposal(1)).to.be.reverted;
      });
    });
  });
});
