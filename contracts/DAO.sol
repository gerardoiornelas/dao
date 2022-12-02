//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract DAO {
    address owner;
    Token public token;
    uint256 public quorum;
    // create struct for proposal
    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        bool finalized;
        string description;
    }
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) votes;
    mapping(address => mapping(uint256 => bool)) downVotes;

    event Propose(uint id, uint256 amount, address recipient, address creator);

    event Vote(uint256 id, address investor);

    event DownVote(uint256 id, address investor);

    event Finalize(uint256 id);

    constructor(Token _token, uint256 _quorum) {
        owner = msg.sender;
        token = _token;
        quorum = _quorum;
    }

    // Hold funds (treasury)
    receive() external payable {}

    modifier onlyInvestor() {
        require(token.balanceOf(msg.sender) > 0, "must be token holder");
        _;
    }

    // Create Proposal
    function createProposal(
        string memory _name,
        uint256 _amount,
        address payable _recipient,
        string memory _description
    ) external onlyInvestor {
        require(address(this).balance >= _amount);
        require(bytes(_description).length > 0);
        proposalCount++;
        // create propposal (model proposal)
        // take mapping of index propsalCount and assign Proposal Stuct
        proposals[proposalCount] = Proposal(
            proposalCount,
            _name,
            _amount,
            _recipient,
            0,
            false,
            _description
        );

        emit Propose(proposalCount, _amount, _recipient, msg.sender);
    }

    // Vote
    function vote(uint256 _id) external onlyInvestor {
        // Fetch proposal from mapping by id
        Proposal storage proposal = proposals[_id];

        // don't let investors vote twice
        require(!votes[msg.sender][_id], "already voted");

        // Update votes
        proposal.votes += token.balanceOf(msg.sender);

        // track that user has voted
        votes[msg.sender][_id] = true;
        // emit event
        emit Vote(_id, msg.sender);
    }

    // Vote down
    function downVote(uint256 _id) external onlyInvestor {
        // Fetch proposal from mapping by id
        Proposal storage proposal = proposals[_id];

        // don't let investors down-vote twice
        require(!downVotes[msg.sender][_id], "already down-voted");

        // don't let investors down-vote a proposal with no votes
        require(proposal.votes > 0);

        // Update down-votes
        proposal.votes -= token.balanceOf(msg.sender);

        //track that user has down-voted
        downVotes[msg.sender][_id] = true;

        //emit event
        emit DownVote(_id, msg.sender);
    }

    // Get Votes
    function hasVoted(
        uint256 _id
    ) external view onlyInvestor returns (bool voted) {
        voted = votes[msg.sender][_id];
    }

    // Finalize Proposal
    function finalizeProposal(uint256 _id) external onlyInvestor {
        // fetch proposal
        Proposal storage proposal = proposals[_id];

        // ensure proposal is not already finalized
        require(proposal.finalized == false, "proposal already finalized");

        // mark as finalized
        proposal.finalized = true;

        // check that proposal has enough votes
        require(
            proposal.votes >= quorum,
            "must reach quorum to finalize proposal"
        );

        // ccheck that contract has enough ether
        require(address(this).balance >= proposal.amount);

        // transfer funds to recipient
        (bool sent, ) = proposal.recipient.call{value: proposal.amount}("");
        require(sent);

        // emit event
        emit Finalize(_id);
    }
}
