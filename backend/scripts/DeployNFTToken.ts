import hre  from "hardhat";
import * as dotenv from "dotenv"

dotenv.config()

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("NFTToken")
    const contract = await contractFactory.deploy()
    await contract.deployed()
    console.log(`The NFT contract is deployed at ${contract.address}`)
    await hre.run(`verify:verify`, {
        address: contract.address,
        constructorArguments: [],
    })
    console.log(`The NFT contract was verified`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
