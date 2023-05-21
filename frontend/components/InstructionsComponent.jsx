import styles from "../styles/InstructionsComponent.module.css";
import { useSigner, useNetwork, useBalance } from 'wagmi'
import { useState, useEffect } from 'react';

export default function InstructionsComponent() {
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Ballot
				</h1>
				<p>
					Encode Ballot Weekend project
				</p>
			</header>

			<div className={styles.buttons_container}>
				<PageBody />
			</div>

			<div className={styles.footer}>
				Footer
			</div>
		</div>
	);
};

function PageBody() {
	return (
		<div>
			<WalletInfo />
		</div>
	);
}

function WalletInfo() {
	const { data: signer, isLoading } = useSigner()
	const { chain } = useNetwork()

	if (signer) return (
		<>
			<p>Your account address is {signer._address}</p>
			<p>Connected to the {chain.name} network</p>
			<button onClick={() => signMessage(signer, "I love potatoes")}>Sign</button>
			<WalletBalance />
			<ApiInfo />
		</>
	)
	else if (isLoading) return (<p>Loading...</p>)
	else return (<><p>Connect account to continue</p></>)
}

function signMessage(signer, message) {
	signer.signMessage(message).then(
		(signature) => {
			console.log(signature)
		}, (error) => { console.errror(error) })
}

function WalletBalance() {
	const { data: signer } = useSigner()
	const { data, isError, isLoading } = useBalance({ address: signer._address })

	if (isLoading) return <div>Fetching balance ...</div>
	if (isError) return <div>Fetching balance ...</div>
	return (
		<div>Balance {data?.formatted} {data?.symbol}</div>
	)
}

function ApiInfo() {
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetch('https://random-data-api.com/api/v2/users')
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, []);

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No profile data</p>;

	return (
		<div>
			<h1>{data.username}</h1>
			<p>{data.email}</p>
		</div>
	);
}
