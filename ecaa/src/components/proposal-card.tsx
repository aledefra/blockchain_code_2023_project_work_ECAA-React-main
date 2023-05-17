import { IProposal } from "../model/proposalType-model";
import { Link } from "react-router-dom";

type Props = {
  proposal: IProposal;
};

export const ProposalCard = (props: Props) => {

  const proposal = props.proposal;

  return (
    <div className="proposal-card">
   
      <b>Index: {proposal.index}</b>
      <p>Executed: {proposal.executed}</p>
      <p>numConfirmations: {proposal.numConfirmations}</p>
      <p>ProposalType: {proposal.proposalType}</p>
      <p>proposalData: {proposal.proposalData}</p>

      <Link to={`/proposals/${proposal.index}`} state={proposal}>
        <button>Details</button>
      </Link>
    </div>
  );
};
