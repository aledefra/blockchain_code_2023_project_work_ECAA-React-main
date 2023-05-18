import { ethers } from "ethers";
import React, { useEffect } from "react";
import { IProposal } from "../model/proposalType-model";
import { Link, useLocation, useParams } from "react-router-dom";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";

type Props = {
  index: number;
  contractAbi: any;
};

enum ProposalTypeEnum {
  Transaction,
  NewOwner,
  RemoveOwner,
  ChangeThreshold,
  ChangeNumConfirmations,
  ChangeOwner,
  TokenTransaction,
  NFTTransaction
}

export const ProposalCard = (props: Props) => {
  const index = props.index;
  const contractAbi = props.contractAbi;
  const location = useLocation();
  const params = useParams();
  const address = params.address;
  const fixedAddress = address as `0x${string}`;

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





  const decodedData = () => {
    
    if (proposal?.proposalType === ProposalTypeEnum.Transaction) {
      const [to, value] = ethers.utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        proposal?.proposalData ?? ""
      );
      return <p>Send {value.toString()} to address {to}</p>
    }

    if (proposal?.proposalType === ProposalTypeEnum.NewOwner) {
      const [newOwner] = ethers.utils.defaultAbiCoder.decode(
        ['address'],
        proposal?.proposalData ?? ""
      );
      return <p>New Owner: {newOwner}</p>
    }

    if (proposal?.proposalType === ProposalTypeEnum.RemoveOwner) {
      const [addressToRemove] = ethers.utils.defaultAbiCoder.decode(
        ['address'],
        proposal?.proposalData ?? ""
      );
      return <p>Address to remove: {addressToRemove}</p>
    }

    if (proposal?.proposalType === ProposalTypeEnum.ChangeThreshold) {
      const [newThreshold] = ethers.utils.defaultAbiCoder.decode(
        ['uint256'],
        proposal?.proposalData ?? ""
      );
      return <p>New Threshold: {newThreshold.toString()}</p>
    }

    if (proposal?.proposalType === ProposalTypeEnum.ChangeNumConfirmations) {
      const [newNumConfirmations] = ethers.utils.defaultAbiCoder.decode(
        ['uint256'],
        proposal?.proposalData ?? ""
      );
      return <p>New Number of Confirmations: {newNumConfirmations.toString()}</p>
    }

    if (proposal?.proposalType === ProposalTypeEnum.ChangeOwner) {
      const [oldOwner, newOwner, imHere, lock, timeToUnlock] = ethers.utils.defaultAbiCoder.decode(
        ['address', 'address', 'bool', 'bool', 'uint256'],
        proposal?.proposalData ?? ""
      );
      return <p>
        Old Owner: {oldOwner}<br/>
        New Owner: {newOwner}<br/>
        I'm Here: {imHere.toString()}<br/>
        Lock: {lock.toString()}<br/>
        Time to Unlock:{timeToUnlock.toString()}
      </p>
    }

    if (proposal?.proposalType === ProposalTypeEnum.TokenTransaction) {
      const [to, tokenAddress, value] = ethers.utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint256'],
        proposal?.proposalData ?? ""
      );
      return <p>Send {value.toString()} of token {tokenAddress} to address {to}</p>
    }

    if (proposal?.proposalType === ProposalTypeEnum.NFTTransaction) {
      const [to, nftAddress, tokenId] = ethers.utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint256'],
        proposal?.proposalData ?? ""
      );
      return <p>Send NFT ID {tokenId.toString()} of token {nftAddress} to address {to}</p>
    }

    return <p>Unknown Proposal Type</p>
  }


  return (
    <div className="proposal-card">
      <b>Index: {proposal?.index.toString()}</b>
      <p>Executed: {proposal?.executed.toString()}</p>
      <p>numConfirmations: {proposal?.numConfirmations.toString()}</p>
      <p>ProposalType: {
        proposal?.proposalType === ProposalTypeEnum.Transaction ? "Transaction" :
        proposal?.proposalType === ProposalTypeEnum.NewOwner ? "New Owner" :
        proposal?.proposalType === ProposalTypeEnum.RemoveOwner ? "Remove Owner" :
        proposal?.proposalType === ProposalTypeEnum.ChangeThreshold ? "Change Threshold" :
        proposal?.proposalType === ProposalTypeEnum.ChangeNumConfirmations ? "Change Number of Confirmations" :
        proposal?.proposalType === ProposalTypeEnum.ChangeOwner ? "Change Owner" :
        proposal?.proposalType === ProposalTypeEnum.TokenTransaction ? "Token Transaction" :
        proposal?.proposalType === ProposalTypeEnum.NFTTransaction ? "NFT Transaction" :
        "Unknown"}
      </p>
      DATA:
      {decodedData()}
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
