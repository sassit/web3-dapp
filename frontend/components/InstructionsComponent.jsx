import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import {
	useSigner,
	useNetwork,
	useBalance,
	useContractWrite,
	useContractReads,
} from 'wagmi';
import { useState, useEffect } from 'react';
import TokenizedBallotJson from '../assets/TokenizedBallot.json';
import MyERC20VotesJson from '../assets/MyERC20Votes.json';
import { utils } from 'ethers'

export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Voting DApp
				</h1>
			</header>

			<div className={styles.buttons_container}>
					<PageBody></PageBody>
			</div>
			<div className={styles.footer}>
				Footer
			</div>
		</div>
	);
}

function PageBody() {
	return (
		<div className={styles.buttons_container}>
			<WalletInfo></WalletInfo>
			<RequestTokens></RequestTokens>
			<Vote></Vote>
			<Delegate></Delegate>
			<Results></Results>
		</div>
	)
}

function WalletInfo() {
	const { data: signer, isError, isLoading } = useSigner()
	const { chain, chains } = useNetwork()
	if (signer) return (
		<>
			<p>Your account address is {signer._address}</p>
			<p>Connected to the {chain.name} network</p>
			<WalletBalance></WalletBalance>
		</>
	)
	else if (isLoading) return (
		<>
			<p>Loading...</p>
		</>
	)
	else return (
		<>
			<p>Connect account to continue</p>
		</>
	)
}

function WalletBalance() {
	const { data: signer } = useSigner()
	const { data, isError, isLoading } = useBalance({
    address: signer._address,
  })

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>
  return (
    <div>
      Wallet balance: {data?.formatted} {data?.symbol}
    </div>
  )
}

function RequestTokens() {
	const { data: signer } = useSigner()
	const [txData, setTxData] = useState(null);
	const [txError, setTxError] = useState(null);
  const [isLoading, setLoading] = useState(false);
	if (isLoading) return <p>Requesting tokens to be minted...</p>;
	return (
		<>
			<h1>
				Request Tokens
			</h1>
			{txData && (
				<div>
					<p>Transaction completed!</p>
					<a href={"https://mumbai.polygonscan.com/tx/" + txData.hash} target="_blank">{txData.hash}</a>
				</div>
			)}
			{txError && (
				<div>
					<p>Transaction failed due to: {txError}</p>
				</div>
			)}
			<button onClick={()=> mint(signer, "signature", setLoading, setTxData, setTxError)}>Request token</button>
		</>
	)
}

function mint(signer, setLoading, setTxData, setTxError) {
	setLoading(true);
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ address: signer._address, amount: '10' })
	};
	fetch('http://localhost:3001/token/mint', requestOptions)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
			return response.text().then(text => { throw new Error(text) })
		})
		.then((data) => {
			setTxData(data);
			setLoading(false);
		})
		.catch(err => {
			setTxError(err.message);
			setLoading(false);
		})
}

function Vote() {
	const [voteAmount, setVoteAmount] = useState(1);
	const [proposals, setProposals] = useState(null);
	const [proposalIndex, setProposalIndex] = useState(null);
	const { data: porposalsData } = useContractReads({
		contracts: [{
			abi: TokenizedBallotJson.abi,
			address: process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_ADDRESS,
			functionName: 'proposals',
			args: [0],
		}, {
			abi: TokenizedBallotJson.abi,
			address: process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_ADDRESS,
			functionName: 'proposals',
			args: [1],
		}, {
			abi: TokenizedBallotJson.abi,
			address: process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_ADDRESS,
			functionName: 'proposals',
			args: [2],
		}]
	})
	useEffect(() => {
		setProposals(porposalsData)
	})
	const { data, error, write } = useContractWrite({
		abi: TokenizedBallotJson.abi,
		address: process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_ADDRESS,
		functionName: 'vote',
		args: [
			proposalIndex,
			voteAmount,
		]
	})
	return (
		<>
			<h1>Vote</h1>
			{data && (
				<div>
					<p>Vote completed!</p>
					<a href={"https://mumbai.polygonscan.com/tx/" + data.hash} target="_blank">{data.hash}</a>
				</div>
			)}
			{error && (
				<div>
					<p>Vote failed due to: {error.reason ? error.reason : error.data.message}</p>
				</div>
			)}
			<select onChange={(ev) => setProposalIndex(ev.target.value)}>
				<option disabled selected>Select the proposal to vote to</option>
				{proposals && proposals.map((proposal, idx) => (
					<option value={idx}>{utils.parseBytes32String(proposal.name)}</option>
				))}
			</select>
			<input
				value={voteAmount}
				placeholder="Put your voting amount"
				type="number"
				onChange={(ev) => setVoteAmount(ev.target.value)}
			/>
			<button onClick={()=> write?.()}>Vote</button>
		</>
	)
}

function Delegate() {
	const [delegateAddress, setDelegateAddress] = useState();
	const { data, error, write } = useContractWrite({
		abi: MyERC20VotesJson.abi,
		address: process.env.NEXT_PUBLIC_ERC20_TOKEN_ADDRESS,
		functionName: 'delegate',
		args: [delegateAddress]
	})
	return (
		<>
			<h1>Delegate</h1>
			{data && (
				<div>
					<p>Delegation completed!</p>
					<a href={"https://mumbai.polygonscan.com/tx/" + data.hash} target="_blank">{data.hash}</a>
				</div>
			)}
			{error && (
				<div>
					<p>Delegate failed due to: {error.reason}</p>
				</div>
			)}
			<input
				value={delegateAddress}
				placeholder="Put the address to delegate to"
				type="text"
				onChange={(ev) => setDelegateAddress(ev.target.value)}
			/>
			<button onClick={()=> write?.()}>Delegate</button>
		</>
	)
}

function Results() {
	const [contractData, setContractData] = useState(null);
	const { data, error, isLoading } = useContractReads({
		contracts: [{
			abi: TokenizedBallotJson.abi,
			address: process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_ADDRESS,
			functionName: 'winningProposal'
		}, {
			abi: TokenizedBallotJson.abi,
			address: process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_ADDRESS,
			functionName: 'winnerName'
		}],
	})
	useEffect(() => {
		setContractData(data)
	})
	return (
		<>
			<h1>Results</h1>
			{!contractData && (
				<>Loading result information...</>
			)}
			{contractData && (
				<div>
					<p>Winning proposal index: {parseInt(contractData[0]._hex)}</p>
					<p>Winning proposal name: {utils.parseBytes32String(contractData[1])}</p>
				</div>
			)}
		</>
	)
}

