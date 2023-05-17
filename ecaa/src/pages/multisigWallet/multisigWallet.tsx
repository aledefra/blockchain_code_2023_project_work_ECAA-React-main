import { useContractRead, useBalance } from "wagmi";
import { useParams } from "react-router-dom";
import { contractAbi } from "../../contractABIs/multisigABI";
import { ProposalCard } from "../../components/proposal-card";

export const MultisigWallet = () => {
  const params = useParams();
  const address = params.address;
  const fixedAddress = address as `0x${string}`;
  
  const {
    data: addressBalance,
    isError: balanceError,
    isLoading: balanceLoading,
  } = useBalance({
    address: fixedAddress,
  });

  const { data: NumberOfProposal } = useContractRead({
    address: fixedAddress,
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
      <div>
        {" "}
        Multisig wallet Balance: {addressBalance?.value.toString()} matic
      </div>
      <div>
        View multisig on{" "}
        <a href={`https://mumbai.polygonscan.com/address/${fixedAddress}`}>
          Polygon Mumbai scan
        </a>
      </div>
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
