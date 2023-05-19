import { ethers } from "ethers";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useContractRead } from "wagmi";
import { useNavigate } from "react-router-dom";
import { defaultInitialize } from "../../utils/createWallet";
import { useLocation, useParams } from "react-router-dom";
import { contractAbi } from "../../contractABIs/multisigABI";

import { ProposalCard } from "../../components/proposal-card";
import { _alchemyKey } from "../../utils/key";

// const contractAddress = defaultInitialize.newWalletAddress as `0x${string}`;
const alchemyApiKey = _alchemyKey;
const provider = new ethers.providers.AlchemyProvider(
	"maticmum",
	alchemyApiKey
);

export const MultisigWallet = () => {
	const [index, setIndex] = useState(0);
	const params = useParams();
	const address = params.address;
	const navigate = useNavigate();
	const contract = new ethers.Contract(
		address as string,
		contractAbi,
		provider
	);

	const {
		data: addressBalance,
		isError: balanceError,
		isLoading: balanceLoading,
	} = useBalance({
		address: address as `0x${string}`,
	});

	const { data: NumberOfProposal } = useContractRead({
		address: address as `0x${string}`,
		abi: contractAbi,
		functionName: "getProposalsCount",
	});
	console.log("Data:", NumberOfProposal);

	const numberofProposals = parseInt(NumberOfProposal as string);

	console.log("Number of proposals: ", numberofProposals);

	const proposalCards = [];
	for (let i = 0; i < numberofProposals; i++) {
		proposalCards.push(
			<ProposalCard key={i} index={i} contractAbi={contractAbi} />
		);
	}

	return (
		<div className="MyMultisig">
			<h4>Multisig Wallet Balance:</h4>
      <h1>{addressBalance?.value.toString()} MATIC</h1>

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
					navigate(`/wallets/${address}/owners`);
				}}
			>
				Owners' settings
			</button>
			<button
				className="btn btn-primary"
				onClick={() => {
					navigate(`/wallets/${address}/proposals`);
				}}
			>
				Create Proposal
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
