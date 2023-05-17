import { ethers } from "ethers";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useContractRead } from "wagmi";
import { CreateWallet } from "../createWallet/createWallet";
import { defaultInitialize } from "../../utils/createWallet";
import { useLocation } from "react-router-dom";
import { contractAbi } from "./multisigABI";
import { ProposalCard } from "../../components/proposal-card";

const contractAddress = defaultInitialize.newWalletAddress;
const alchemyApiKey = "z8b0aKqHNwhW3rp7JdoPv1_dUrOAW1dI";
const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
  alchemyApiKey
);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

export const MultisigWallet = () => {
  const [index, setIndex] = useState(0);
  const location = useLocation();
  // const contractAddress  = location.state?.contractAddress || "";
  //console.log(defaultInitialize, defaultInitialize.newWalletAddress);

  //const NewContract = new ethers.Contract(addressNewContract._address, addressNewContract.abi, provider);

  const { address } = useAccount();

  const { data: NumberOfProposal } = useContractRead({
    address: "0xECD22BD9761CBb3Eda09377Dd70cA9ea71BA2fA3",
    abi: contractAbi,
    functionName: "getProposalsCount",
  });

  const numberofProposals = parseInt(NumberOfProposal as string);

  console.log("Number of proposals: ", numberofProposals);

  //using address 0xECD22BD9761CBb3Eda09377Dd70cA9ea71BA2fA3, which is a multisig wallet where i am the owner and i created 3 custom proposals.
  //Later on, i will use the address of the wallet i created with the createWallet function.

  //MAYBE we can get the proposals from the event??

  const proposalCards = [];
  for (let i = 0; i < numberofProposals; i++) {
    proposalCards.push(
      <ProposalCard key={i} index={i} contractAbi={contractAbi} />
    );
  }

  return (
    <div className="MyMultisig">
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
