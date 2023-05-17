import { IProposal } from "../model/proposalType-model";
import { Link } from "react-router-dom";
import { useContractRead } from "wagmi";

type Props = {
  index: number;
  contractAbi: any;
};

export const ProposalCard = (props: Props) => {
  const index = props.index;
  const contractAbi = props.contractAbi;

  const { data: proposal }: { data?: IProposal } = useContractRead({
    address: "0xECD22BD9761CBb3Eda09377Dd70cA9ea71BA2fA3",
    abi: contractAbi,
    functionName: "proposals",
    args: [`${index}`],
  });

  console.log(proposal);

  return (
    <div className="proposal-card">
      <b>Index: {proposal?.index.toString()}</b>
      <p>Executed: {proposal?.executed.toString()}</p>
      <p>numConfirmations: {proposal?.numConfirmations.toString()}</p>
      <p>ProposalType: {proposal?.ProposalType.toString()}</p>
      <p>proposalData: {proposal?.proposalData}</p>

      <Link to={`/proposals/${proposal?.index}`} state={proposal}>
        <button>Details</button>
      </Link>
    </div>
  );
};
