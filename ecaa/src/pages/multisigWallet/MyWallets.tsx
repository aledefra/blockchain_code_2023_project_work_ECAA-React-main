import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { _alchemyKey } from "../../utils/key";

const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
_alchemyKey

);

export type SavedContract = {
	address: string;
	name: string;
};

export const MyWallets = () => {
	
	const [contracts, setContracts] = useState<SavedContract[]>([]);
	const [walletToAdd, setWalletToAdd] = useState<string>("");
	const [walletName, setWalletName] = useState<string>("");

	useEffect(() => {
		setContracts(JSON.parse(localStorage.getItem("contracts") || "[]"));
	}, []);

	const addWallet =async () => {
		// check if wallet is already saved
		if (contracts.find((c) => c.address === walletToAdd)) {
			alert("Wallet already saved");
			return;
		}
		const hexString =
        "0x363d3d373d3d3d363d73275a1065d8dd790c57d0033e5a74d704cd2130be5af43d82803e903d91602b57fd5bf3";
		if(await provider.getCode(walletToAdd) !== hexString) {
	    alert("The address you entered is not a multisig wallet address");
        return;

		}

		// add wallet to local storage
		const newContracts = [
			...contracts,
			{
				address: walletToAdd,
				name: walletName,
			},
		];
		localStorage.setItem("contracts", JSON.stringify(newContracts));
		setContracts(newContracts);
	}

	const removeWallet = (addressToRemove: string) => {
		const newContracts = contracts.filter(
			(c) => c.address !== addressToRemove
		);
		localStorage.setItem("contracts", JSON.stringify(newContracts));
		setContracts(newContracts);
	}


	return (
		<div className="MyMultisig">
			<h1>My Wallets</h1>
			<div>
				<table className="table table-striped">
					<thead>
						<tr>
							<th>Name</th>
							<th>Address</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{contracts.map((contract) => (
							<tr key={contract.address}>
								<td>{contract.name}</td>
								<td>{contract.address}</td>
								<td>
									<a
										className="btn btn-primary"
										href={`/wallets/${contract.address}`}
									>
										Open
									</a>
									<button
										className="btn btn-outline-danger ms-2"
										onClick={() =>
											removeWallet(contract.address)
										}
									>
										Remove
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<hr />

				<h2>Add Wallet</h2>
				<div className="form-group">
					<label htmlFor="walletAddress">Wallet Address</label>
					<input
						type="text"
						className="form-control"
						id="walletAddress"
						placeholder="0x..."
						value={walletToAdd}
						onChange={(e) => setWalletToAdd(e.target.value)}
					/>

					<label htmlFor="walletName">Wallet Name</label>
					<input
						type="text"
						className="form-control"
						id="walletName"
						placeholder="My Wallet"
						value={walletName}
						onChange={(e) => setWalletName(e.target.value)}
					/>

					<button
						className="btn btn-primary mt-2"
						onClick={addWallet}
					>
						Add Wallet
					</button>
				</div>
			</div>
		</div>
	);
};
