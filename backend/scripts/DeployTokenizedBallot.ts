import { ethers, run } from "hardhat"
import { BigNumber, ContractFactory } from "ethers"
import * as dotenv from "dotenv"

dotenv.config()

const MINT_VALUE: BigNumber = ethers.utils.parseUnits("10", "ether")
const TARGET_BLOCK_NUMBER: Number = 12345
const PROPOSALS: string[] = ["Proposal 1", "Proposal 2", "Proposal 3"]

async function main() {
    const myERC20Account = ethers.utils.getAddress(process.env.MY_ERC20_ACCOUNT ?? ``)

    const [deployer] = await ethers.getSigners()
    const voteContractFactory = await ethers.getContractFactory("MyERC20Votes")
    const voteContract = await voteContractFactory.deploy()
    const receipt = await voteContract.deployTransaction.wait()
    console.log(
        `The MyERC20Votes contract was deployed at address ${voteContract.address} at the block ${receipt.blockNumber}`
    )

    // Verify the contract on Etherscan
    console.log("Verifying the MyERC20Votes contract...")
    await run("verify:verify", {
        address: voteContract.address,
        constructorArguments: [],
    })
    console.log("Contract MyERC20Votes verified")

    // Mint some tokens to my account
    const mintTx = await voteContract.connect(deployer).mint(myERC20Account, MINT_VALUE)
    const mintTxReceipt = await mintTx.wait()
    console.log(
        `Minted ${ethers.utils.formatUnits(MINT_VALUE)} to the address ${myERC20Account} at block ${
            mintTxReceipt.blockNumber
        }`
    )

    const proposalNamesBytes32 = PROPOSALS.map((name) => ethers.utils.formatBytes32String(name))
    console.log("Deploying the TokenizedBallot contract with the account:", deployer.address)

    // Compile and deploy the TokenizedBallot contract
    const TokenizedBallotFactory: ContractFactory = await ethers.getContractFactory(
        "TokenizedBallot"
    )
    const tokenizedBallot = await TokenizedBallotFactory.connect(deployer).deploy(
        proposalNamesBytes32,
        voteContract.address,
        TARGET_BLOCK_NUMBER
    )

    console.log("Waiting for deployment...")
    await tokenizedBallot.deployed()

    console.log("Waiting for additional confirmations...")
    await deployer.provider!.waitForTransaction(tokenizedBallot.deployTransaction.hash, 5)

    console.log("TokenizedBallot contract deployed at:", tokenizedBallot.address)

    console.log("Verifying the TokenizedBallot contract...")
    await run("verify:verify", {
        address: tokenizedBallot.address,
        constructorArguments: [proposalNamesBytes32, voteContract.address, TARGET_BLOCK_NUMBER],
    })
    console.log("Contract TokenizedBallot verified successfully")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
