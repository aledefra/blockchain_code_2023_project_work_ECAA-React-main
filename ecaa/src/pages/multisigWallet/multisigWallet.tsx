import { ethers } from "ethers";
import { useBalance } from "wagmi";
import { useContractRead } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { contractAbi } from "../../contractABIs/multisigABI";
import { ProposalCard } from "../../components/proposal-card";



export const MultisigWallet = () => {
	const params = useParams();
	const address = params.address;
	const navigate = useNavigate();
	

	const {
		data: addressBalance,
		} = useBalance({
		address: address as `0x${string}`,
	});

	const { data: NumberOfProposal } = useContractRead({
		address: address as `0x${string}`,
		abi: contractAbi,
		functionName: "getProposalsCount",
	});


	const numberofProposals = parseInt(NumberOfProposal as string);



	const proposalCards = [];
	for (let i = 0; i < numberofProposals; i++) {
		proposalCards.push(
			<ProposalCard key={i} index={i} contractAbi={contractAbi} />
		);
	}

	return (
		<div className="MyMultisig">
			<h4>Multisig Wallet Balance:</h4>
      <h1>{ethers.utils.formatEther(addressBalance?.value ?? "0")} MATIC</h1>

      <div className="mb-3">
        <a
          className="btn btn-primary"
          href={`https://mumbai.polygonscan.com/address/${address}`}
          target="_blank"
          rel="noreferrer"
          >
        View multisig on Polygon Mumbai Scan
        </a>
      </div>

      <hr />
	  <button
				className="btn btn-primary me-1"
				onClick={() => {
					navigate(`/wallets/${address}/transfer`);
				}}
			>
				Transfer some Balance
			</button>

			<button
				className="btn btn-primary me-1"
				onClick={() => {
					navigate(`/wallets/${address}/owners`);
				}}
			>
				Owners' settings
			</button>
			

			{numberofProposals !== 0 && (
				<div>
					<h2>Proposals:</h2>
					{proposalCards}
				</div>
			)}
			{numberofProposals === 0 && (
				<p className="not-found"> No proposals found</p>
			)}
		</div>
	);
};
