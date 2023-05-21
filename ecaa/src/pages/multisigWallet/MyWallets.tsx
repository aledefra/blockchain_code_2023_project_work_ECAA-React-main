import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useContractRead } from "wagmi";
import { defaultInitialize } from "../../utils/createWallet";
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
	
	const [contracts, setContracts] = useState<SavedContract[]>([]);
	const { address } = useAccount();
	const { data, isError, isLoading } = useContractRead({
		abi: contractAbi,
		functionName: "getOwners",
	});

	useEffect(() => {
		setContracts(JSON.parse(localStorage.getItem("contracts") || "[]"));
	}, []);


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
		</div>
	</div>
	);
};
