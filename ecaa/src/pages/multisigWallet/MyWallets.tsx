import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useContractRead } from "wagmi";
import { defaultInitialize } from "../../utils/createWallet";
import { useLocation, useNavigate } from "react-router-dom";
import { contractAbiMulti } from "../../contract-abi";
import { _alchemyKey } from "../../utils/key";

const contractAddress = defaultInitialize.newWalletAddress;

const contractAbi = contractAbiMulti;

const alchemyApiKey = _alchemyKey;

export type SavedContract = {
	address: string;
	name: string;
};

export const MyWallets = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [contracts, setContracts] = useState<SavedContract[]>([]);
	const [selectedAddress, setSelectedAddress] = useState("");

	const { address } = useAccount();
	const { data, isError, isLoading } = useContractRead({
		abi: contractAbi,
		functionName: "getOwners",
	});

	useEffect(() => {
		setContracts(JSON.parse(localStorage.getItem("contracts") || "[]"));
	}, []);

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedAddress(event.target.value);
	};

	const handleCreateProposal = () => {
		// Controlla se è stato selezionato un indirizzo
		if (selectedAddress) {
			// Effettua l'azione desiderata con l'indirizzo selezionato
			navigate(`/wallets/${selectedAddress}/proposals`, {
				state: { contractAddress: selectedAddress },
			});
		} else {
			// Nessun indirizzo selezionato, gestisci l'errore o mostra un messaggio all'utente
		}
	};

	return (
		<div className="MyMultisig">
			<h1>MyWallets</h1>
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
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="row">
					<label className="queryInput" htmlFor="select">
						Select an address:
					</label>
					<select value={selectedAddress} onChange={handleSelectChange}>
						<option value="">Select</option>
						{contracts.map((contract) => (
							<option key={contract.address} value={contract.address}>
								{contract.name}
							</option>
						))}
					</select>
				</div>

				{address && <div>Address: {selectedAddress}</div>}

				<button type="button" onClick={handleCreateProposal}>
					Create Proposal
				</button>
			</div>
		</div>
	);
};
