import { useEffect, useState } from "react";
import { contractAbi } from "../multisigWallet/multisigABI";
import { IProposalType } from "../../model/proposalType-model";
import { useParams } from "react-router-dom";
import {
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
} from "wagmi";
import { NumConfirmation } from "./NumConfirmation";
import { Threshold } from "./Threshold";

export const Owners = (props: IProposalType) => {
	const { address: contractAddress } = useParams();

	const [newOwnerInput, setNewOwnerInput] = useState("");
	const [ownerToRemove, setOwnerToRemove] = useState<string | undefined>(
		undefined
	);

	// Getters
	const { data: owners }: { data: string[] | undefined } = useContractRead({
		address: contractAddress as `0x${string}`,
		abi: contractAbi,
		functionName: "getOwners",
	});

	// Remove owner
	const removeOwnerPrepare = usePrepareContractWrite({
		address: contractAddress as `0x${string}`,
		abi: contractAbi,
		functionName: "proposeRemoveOwner",
		args: [ownerToRemove],
	});
	const removeOwnerWrite = useContractWrite(removeOwnerPrepare.config);
	useEffect(() => {
		if (ownerToRemove) {
			removeOwnerWrite?.write?.();
			setOwnerToRemove(undefined);
		}
	}, [ownerToRemove]);

	// Add owner
	const addOwnerPrepare = usePrepareContractWrite({
		address: contractAddress as `0x${string}`,
		abi: contractAbi,
		functionName: "proposeNewOwner",
		args: [newOwnerInput],
	});
	const addOwnerWrite = useContractWrite(addOwnerPrepare.config);

	return (
		<div>
			<h1>Owners ({owners?.length})</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					addOwnerWrite?.write?.();
				}}
			>
				<input
					type="text"
					className="form-control"
					placeholder="New owner address"
					value={newOwnerInput}
					onChange={(e) => setNewOwnerInput(e.target.value)}
				/>
				<input
					type="submit"
					className="btn btn-primary mt-2"
					value="Add Owner"
					disabled={
						newOwnerInput === "" ||
						addOwnerPrepare.isError ||
						addOwnerWrite.isLoading
					}
					data-create-loading={addOwnerWrite.isLoading}
				/>
				{newOwnerInput !== "" && addOwnerPrepare.isError && (
					<p className="error">
						Error: {(addOwnerPrepare.error as any).reason}
					</p>
				)}
			</form>

			{removeOwnerWrite.isError && (
				<p className="error">Error: {(removeOwnerWrite.error as any).reason}</p>
			)}
			<table
				className="table table-striped mt-4"
			>
				<thead>
					<tr>
						<th>Address</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{owners?.map((owner, i) => (
						<tr key={i}>
							<td>{owner}</td>
							<td>
								<button
									className="btn btn-danger"
									disabled={removeOwnerWrite.isLoading}
									data-create-loading={removeOwnerWrite.isLoading}
									onClick={() => setOwnerToRemove(owner)}
								>
									Remove
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="row">
			<NumConfirmation owners={owners} />
			<Threshold owners={owners} />
			</div>
		</div>
	);
};
