# Final Project: Encode club solidity bootcamp Q2-2023 Early Cohort - Group 9

## Treasure Marketplace Project
This is a marketplace for IPFS-stored images.

- The solution consist in a Marketplace Smart Contract that is based on the ERC1155 NFT and the ERC20 from OpenZeppelin.
- The Marketplace publishing flow corresponds with:
  - An image is uploaded via IPFS protocol
  - Then an account mints an amount of ERC1155 tokens by using the assigned IPFS CID
  - Finally, transfer an amount of ERC1155 tokens to the Marketplace Contract to be available for votes
- The Marketplace trading consist in a ballot system as follows:
    - An account can vote for an ERC1155 NFT by paying in ERC20 tokens
    - The winners repartition is equitable between all the accounts that have voted for the winner NFT

## What's next?
- Implement the voting close and the winners repartition
- Define the disregarding terms for winners repartition
- Allow account to un-publish an owned ERC1155 NFT by its ID
