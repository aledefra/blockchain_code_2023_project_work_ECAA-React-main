import { IProposal } from "../model/proposalType-model";
import { Link, useLocation, useParams } from "react-router-dom";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";

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

    const {
      config: prepareConfirmConfig,
      error: errorPrepareConfirm,
      isError,
    } = usePrepareContractWrite({
      address: fixedAddress,
      abi: contractAbi,
      functionName: "confirmProposal",
      args: [`${proposal?.index}`],
    });

    const {
      isSuccess,
      isLoading, 
      data: 
      error,
      write: writeConfirmProposal,
    } = useContractWrite(prepareConfirmConfig);
 function onSubmitConfirm() {
   if (!writeConfirmProposal) return;
   writeConfirmProposal();
 }


 const {
   config: prepareExecuteConfig,
   error: errorExecuteConfirm,
   isError : isErrorExecute,
 } = usePrepareContractWrite({
   address: fixedAddress,
   abi: contractAbi,
   functionName: "executeProposal",
   args: [`${proposal?.index}`],
 });

 const {
   isSuccess : isSuccessExecute,
   isLoading : isLoadingExecute,
   data,
   write: writeExecuteProposal,
 } = useContractWrite(prepareExecuteConfig);
 function onSubmitExecute() {
   if (!writeExecuteProposal) return;
   writeExecuteProposal();
 }
const revokePrepare = usePrepareContractWrite({
   address: fixedAddress,
   abi: contractAbi,
   functionName: "revokeConfirmation",
   args: [`${proposal?.index}`],
 });

 const revokeConfirmation = useContractWrite(revokePrepare.config);
 function onSubmitRevoke() {
   if (!revokeConfirmation.write) return;
   revokeConfirmation.write();
 }





  return (
    <div className="proposal-card">
      <b>Index: {proposal?.index.toString()}</b>
      <p>Executed: {proposal?.executed.toString()}</p>
      <p>numConfirmations: {proposal?.numConfirmations.toString()}</p>
      <p>ProposalType: {proposal?.proposalType}</p>
      <p>proposalData: {proposal?.proposalData}</p>

      <button onClick={onSubmitConfirm}>Confirm</button>
      <button onClick={onSubmitExecute}>Execute</button>
      <button onClick={onSubmitRevoke}>Revoke</button>
      {revokePrepare.isError && (
        <div>Error: {(revokePrepare.error as any).reason}</div>
      )}
      {revokeConfirmation.isError && (
        <div>Error: {(revokeConfirmation.error as any).reason}</div>
      )}
    </div>
  );
};
