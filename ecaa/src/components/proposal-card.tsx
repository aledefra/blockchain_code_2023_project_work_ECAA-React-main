import { IProposal } from "../model/proposalType-model";
import { Link, useLocation, useParams } from "react-router-dom";
import { useContractRead } from "wagmi";

type Props = {
  index: number;
  contractAbi: any;
};

export const ProposalCard = (props: Props) => {
  const index = props.index;
  const contractAbi = props.contractAbi;
  const location = useLocation();
  const params = useParams();
  const address = params.address;
  const fixedAddress = address as `0x${string}`;
  console.log(address);


  const { data: proposal }: { data?: IProposal } = useContractRead({
    address: fixedAddress,
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
      <p>ProposalType: {proposal?.proposalType}</p>
      <p>proposalData: {proposal?.proposalData}</p>

      <Link to={`/proposals/${proposal?.index}`} state={proposal}>
        <button>Details</button>
      </Link>
    </div>
  );
};
