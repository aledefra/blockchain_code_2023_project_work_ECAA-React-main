import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useContractRead } from "wagmi";
import { CreateWallet } from "../createWallet/createWallet";
import { defaultInitialize } from "../../utils/createWallet";
import { useLocation } from "react-router-dom";
import {contractAbi} from "./multisigABI"
import { IProposal } from "../../model/proposalType-model";
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

  const FetchProposal = () => {
    const { data: Proposal } = useContractRead({
      address: "0xECD22BD9761CBb3Eda09377Dd70cA9ea71BA2fA3",
      abi: contractAbi,
      functionName: "proposals",
      args: [`${index}`],
    });
    const prop = Proposal as IProposal;

    const proposal = {
      index: parseInt(prop.index.toString()),
      executed: prop.executed,
      numConfirmations: parseInt(prop.numConfirmations.toString()),
      proposalType: prop.proposalType,
      proposalData: prop.proposalData,
    };
    // console.log("Proposal: ", proposal);
    return proposal;
  };

  const dataList = [];
  for (let i = 0; i < numberofProposals; i++) {
    const data = FetchProposal();
    dataList.push(data);
  }
  console.log("DataList: ", dataList);

  // I forgot to indexx++ but if i do so it will crash

  return (
    <div className="MyMultisig">
      {dataList.length !== 0 && (
        <div className="animals-list search-card ">
          Proposals found:
          {dataList.map((proposal) => (
            <ProposalCard key={proposal.index} proposal={proposal} />
          ))}
        </div>
      )}
      {dataList.length === 0 && (
        <p className="not-found"> No proposals found</p>
      )}
    </div>
  );
};

