import { ethers, run } from "hardhat"
import { BigNumber, ContractFactory } from "ethers"
import * as dotenv from "dotenv"

dotenv.config()

const MINT_VALUE: BigNumber = ethers.utils.parseUnits("10", "ether")
const TREASURE_ID = 333
const TREASURE_NAME = "MyFirstNFT"
const TREASURE_URI = "https://ipfs.io/ipfs"

async function main() {
  const [deployer, acc1, acc2] = await ethers.getSigners()

    // Deploy TreasureCollection
    const treasureCollectionFactory = await ethers.getContractFactory("TreasureCollection")
    const treasureCollectionContract = await treasureCollectionFactory.deploy()
    const treasureCollectionReceipt = await treasureCollectionContract.deployTransaction.wait()
    console.log(
        `The TreasureCollection contract was deployed at address ${treasureCollectionContract.address} at the block ${treasureCollectionReceipt.blockNumber}`
    )

    // Mint nft tokens to acc1
    const treasureCollectionMintTx = await treasureCollectionContract.connect(deployer).mint(
      acc1.address,
      TREASURE_ID,
      MINT_VALUE,
      ethers.utils.toUtf8Bytes(`{name: '${TREASURE_NAME}', uri: '${TREASURE_URI}'}`),
    )
    const treasureCollectionMintTxReceipt = await treasureCollectionMintTx.wait()
    console.log(
        `Minted ${ethers.utils.formatUnits(MINT_VALUE)} NFTs to the address ${acc1.address} at block ${
          treasureCollectionMintTxReceipt.blockNumber
        }`
    )

    // Deploy TreasureVotes
    const treasureVotesFactory = await ethers.getContractFactory("TreasureVotes")
    const treasureVotesContract = await treasureVotesFactory.deploy()
    const treasureVotesReceipt = await treasureVotesContract.deployTransaction.wait()
    console.log(
        `The TreasureVotes contract was deployed at address ${treasureVotesContract.address} at the block ${treasureVotesReceipt.blockNumber}`
    )

    // Mint voting tokens to acc1
    const treasureVotesMintTx = await treasureVotesContract.connect(deployer).mint(acc2.address, MINT_VALUE)
    const treasureVotesMintTxReceipt = await treasureVotesMintTx.wait()
    console.log(
        `Minted ${ethers.utils.formatUnits(MINT_VALUE)} Votes to the address ${acc2.address} at block ${
          treasureVotesMintTxReceipt.blockNumber
        }`
    )

    // Deploy TreasureMarketplace
    console.log("Deploying the TreasureMarketplace contract with the account:", deployer.address)
    const marketplaceName = ethers.utils.toUtf8Bytes("Encode-Solidity-Bootcamp-Q2-2023")

    // Compile and deploy the TreasureMarketplace contract
    const treasureMarketplaceFactory = await ethers.getContractFactory(
        "TreasureMarketplace"
    )
    const treasureMarketplaceContract = await treasureMarketplaceFactory.deploy(
        marketplaceName,
        treasureCollectionContract.address,
        treasureVotesContract.address,
    )

    console.log("Waiting for deployment...")
    await treasureMarketplaceContract.deployed()
    console.log("TreasureMarketplace contract deployed at:", treasureMarketplaceContract.address)

    // Publish a Treasure NFT
    const tx = await treasureCollectionContract.connect(acc1).setApprovalForAll(treasureMarketplaceContract.address, true)
    await tx.wait()
    const publishTreasureTx = await treasureMarketplaceContract.connect(acc1).publishTreasure(
        acc1.address,
        TREASURE_ID,
        MINT_VALUE,
        ethers.utils.formatBytes32String(TREASURE_NAME),
        ethers.utils.formatBytes32String(TREASURE_URI)
    )
    const publishTreasureTxReceipt = await publishTreasureTx.wait()
    console.log(
      `Published ${ethers.utils.formatUnits(MINT_VALUE)} NFTs at block ${
        publishTreasureTxReceipt.blockNumber
      }`
    )

    // Read first published Treasure NFTs
    const firstPublishedTreasure = await treasureMarketplaceContract.connect(deployer).treasures(0)
    console.log('The first published NFT Treasure is:', firstPublishedTreasure)

    // Vote for a treasure
    console.log(`Voting by 1 for Treasure with ID ${TREASURE_ID}`)
    const delegateVotesTx = await treasureVotesContract.connect(acc2).delegate(acc2.address)
    await delegateVotesTx.wait()
    const voteTx = await treasureMarketplaceContract.connect(acc2).voteTreasure(
      TREASURE_ID,
      MINT_VALUE,
    )
    const voteTxReceipt = await voteTx.wait()
    console.log(
      `Voted by 1 for Treasure with ID ${TREASURE_ID} at block ${
        voteTxReceipt.blockNumber
      }`
    )

    // Winning treasure
    const winnerName = await treasureMarketplaceContract.connect(deployer).winnerName()
    const winnerVotes = await treasureMarketplaceContract.connect(deployer).winnerVotes()
    console.log('Winner name', ethers.utils.parseBytes32String(winnerName))
    console.log('Winner votes', winnerVotes)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
