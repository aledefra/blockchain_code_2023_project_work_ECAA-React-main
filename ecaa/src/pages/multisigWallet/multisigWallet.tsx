import { ethers } from "ethers";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useContractRead } from "wagmi";
import { useNavigate } from "react-router-dom";
import { defaultInitialize } from "../../utils/createWallet";
import { useLocation, useParams } from "react-router-dom";
import { contractAbi } from "../../contractABIs/multisigABI";

import { ProposalCard } from "../../components/proposal-card";

// const contractAddress = defaultInitialize.newWalletAddress as `0x${string}`;
const alchemyApiKey = "z8b0aKqHNwhW3rp7JdoPv1_dUrOAW1dI";
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
      <div>
        {" "}
        Multisig wallet Balance: {addressBalance?.value.toString()} matic
      </div>
      <div>
        View multisig on{" "}
        <a href={`https://mumbai.polygonscan.com/address/${address}`}>
          Polygon Mumbai scan
        </a>
      </div>
      <button
        onClick={() => {
          navigate(`/wallets/${address}/owners`);
        }}
      >
        {" "}
        Owners' settings{" "}
      </button>
      <button
        onClick={() => {
          navigate(`/wallets/${address}/proposals`);
        }}
      >
        Create Proposal
      </button>
      {numberofProposals !== 0 && (
        <div className="animals-list search-card ">
          Proposals found:
          {proposalCards}
        </div>
      )}
      {numberofProposals === 0 && (
        <p className="not-found"> No proposals found</p>
      )}
    </div>
  );
};
