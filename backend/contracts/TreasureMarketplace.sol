// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
// import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./TreasureCollection.sol";
import "./TreasureVotes.sol";
// IERC1155Receiver
contract TreasureMarketplace is Ownable, ERC1155Holder {
    bytes public name;
    struct Treasure {
        uint256 id;
        bytes32 name;
        bytes32 uri;
    }
    struct TreasureVote {
        address voterAddress;
        uint voteCount;
    }
    TreasureCollection public collection;
    TreasureVotes public votes;
    Treasure[] public treasures;
    mapping(uint256 => TreasureVote[]) public treasureVotes;
    mapping(address => uint256) public votingPowerSpent;

    // uint256 public targetBlockNumber;

    constructor(
        bytes memory _name,
        address treasureCollectionContract,
        address treasureVotesContract
    ) {
        name = _name;
        collection = TreasureCollection(treasureCollectionContract);
        votes = TreasureVotes(treasureVotesContract);
    }

    function publishTreasure(
        address from,
        uint256 id,
        uint256 amount,
        bytes32 _name,
        bytes32 uri
    ) public {
        collection.safeTransferFrom(from, address(this), id, amount, "");
        treasures.push(Treasure({
            id: id,
            name: _name,
            uri: uri
        }));
    }

    function voteTreasure(uint256 id, uint256 amount) external {
        uint256 voteAllocation = votes.getPastVotes(
            msg.sender,
            block.number-1
        );
        uint256 votesSpentAfter = votingPowerSpent[msg.sender] + amount;
        require(votesSpentAfter <= voteAllocation, "Not enough voting power.");
        votingPowerSpent[msg.sender] += amount;
        uint actualVotes = 0;
        for (uint v = 0; v < treasureVotes[id].length; v++) {
            if (treasureVotes[id][v].voterAddress == msg.sender) {
                treasureVotes[id][v].voteCount += amount;
                actualVotes = treasureVotes[id][v].voteCount;
            }
        }
        if (actualVotes == 0) {
            treasureVotes[id].push(TreasureVote({
                voterAddress: msg.sender,
                voteCount: amount
            }));
        }
    }

    function winningTreasure() public view returns (uint winningTreasure_) {
        uint winningVoteCount = 0;
        for (uint t = 0; t < treasures.length; t++) {
            uint totalVoteCount = 0;
            for (uint v = 0; v < treasureVotes[treasures[t].id].length; v++) {
                totalVoteCount += treasureVotes[treasures[t].id][v].voteCount;
            }
            if (totalVoteCount > winningVoteCount) {
                winningVoteCount = totalVoteCount;
                winningTreasure_ = t;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = treasures[winningTreasure()].name;
    }

    function winnerVotes() external view returns (uint winnerVotes_) {
        uint256 winnerId = treasures[winningTreasure()].id;
        winnerVotes_ = 0;
        for (uint v = 0; v < treasureVotes[winnerId].length; v++) {
            winnerVotes_ += treasureVotes[winnerId][v].voteCount;
        }
    }
}
