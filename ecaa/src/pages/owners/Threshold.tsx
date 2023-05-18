import { useEffect, useState } from "react";
import { contractAbi } from "../multisigWallet/multisigABI";
import { useParams } from "react-router-dom";
import {
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
} from "wagmi";

type Props = {
	owners: string[] | undefined;
};

export const Threshold = ({ owners }: Props) => {
	const { address: contractAddress } = useParams();

	const [newThreshold, setNewThreshold] = useState(1);

	// Getters
	const { data: numThreshold }: { data: number | undefined } = useContractRead({
		address: contractAddress as `0x${string}`,
		abi: contractAbi,
		functionName: "numThreshold",
	});

	// Change number of confirmations required
	const prepare = usePrepareContractWrite({
		address: contractAddress as `0x${string}`,
		abi: contractAbi,
		functionName: "proposeChangeThreshold",
		args: [newThreshold],
	});
	const write = useContractWrite(prepare.config);

	return (
		<div className="col-md">
			<h2>Threshold: {numThreshold?.toString()} / {owners?.length}</h2>
			
			<h4>Change the Threshold</h4>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					write?.write?.();
				}}
			>
				<select
					className="form-control"
					value={newThreshold}
					onChange={(e) => setNewThreshold(Number(e.target.value))}
				>
					{owners?.map((owner, i, array) =>
						array.length - 1 !== i ? (
							<option key={i} value={i + 1}>
								{i + 1}
							</option>
						) : null
					)}
				</select>
				<input
					className="btn btn-primary mt-2"
					type="submit"
					value="Change"
					disabled={
						newThreshold.toString() === numThreshold?.toString() ||
						prepare.isError ||
						write.isLoading
					}
					data-create-loading={write.isLoading}
				/>
				{prepare.isError && (
					<p className="error">Error: {(prepare.error as any).reason}</p>
				)}
			</form>
		</div>
	);
};
