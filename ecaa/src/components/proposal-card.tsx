import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { IProposal } from "../model/proposalType-model";
import { useNavigate, useParams } from "react-router-dom";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { _alchemyKey } from "../utils/key";


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
  const navigate = useNavigate();
  const params = useParams();
  const address = params.address;
  const fixedAddress = address as `0x${string}`;
 

  //prova reload
  const [isExecuted, setIsExecuted] = useState(false);


  const { data: proposal }: { data?: IProposal } = useContractRead({
    address: fixedAddress,
    abi: contractAbi,
    functionName: "proposals",
    args: [`${index}`],
  });


// confirme proposal

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
      isSuccess: isSuccessStartedConfirm,
      isLoading: isLoadingConfirm, 
      data: dataConfirm,
      error: errorConfirm,
      write: writeConfirmProposal,
    } = useContractWrite(prepareConfirmConfig);
 function onSubmitConfirm() {
   if (!writeConfirmProposal) return;
   writeConfirmProposal();

 }



// execute proposal

 const {
   config: prepareExecuteConfig,
   error: errorExecutePrepare,
   isError : isErrorExecute,
 } = usePrepareContractWrite({
   address: fixedAddress,
   abi: contractAbi,
   functionName: "executeProposal",
   args: [`${proposal?.index}`],
 });

 const {
   isSuccess : isSuccessStartedExecute,
   isLoading : isLoadingExecute,
   data,
   error: writeErrorExecute,
   write: writeExecuteProposal,
 } = useContractWrite(prepareExecuteConfig);
 function onSubmitExecute() {
   if (!writeExecuteProposal) return;
   writeExecuteProposal();

 }

 // revoke proposal
 const {
    config: prepareRevokeConfig,
    error: errorRevokePrepare,
    isError: isErrorRevoke,
 } = usePrepareContractWrite({
   address: fixedAddress,
   abi: contractAbi,
   functionName: "revokeConfirmation",
   args: [`${proposal?.index}`],
 });
 const {
  isSuccess : isSuccessStartedRevoke,
  isLoading : isLoadingRevoke,
  data : dataRevoke,
  error: writeErrorRevoke,
  write: writeRevoke,
} = useContractWrite(prepareRevokeConfig);
function onSubmitRevoke() {
  if (!writeRevoke) return;
  writeRevoke();

}

//function ImHere
const {
  config: prepareImHereConfig,
  error: errorImHerePrepare,
  isError : isErrorImHere,
} = usePrepareContractWrite({
  address: fixedAddress,
  abi: contractAbi,
  functionName: "imAmHere",
  args: [`${proposal?.index}`],
});

const {
  isSuccess: isSuccessStartedImHere,
  isLoading: isLoadingImHere,
  data: dataImHere,
  error: errorImHere,
  write: writeImHere,
} = useContractWrite(prepareImHereConfig);
function onSubmitImHere() {
if (!writeImHere) return;
writeImHere();

}



// prova reload CONFIRM 

useEffect(() => {
  let timerId: NodeJS.Timeout;

  if (isSuccessStartedConfirm) {
    timerId = setTimeout(() => {
      setIsExecuted(true);
    }, 5000); 
  }

  return () => {
    clearTimeout(timerId);
  };
}, [isSuccessStartedConfirm]);

useEffect(() => {
  const reloadPage = () => {
    window.location.reload();
  };

  if (isExecuted) {
    reloadPage();
  }
}, [isExecuted]);



// prova reload EXECUTE
useEffect(() => {
  let timerId: NodeJS.Timeout;

  if (isSuccessStartedExecute) {
    timerId = setTimeout(() => {
      setIsExecuted(true);
    }, 5000); 
  }

  return () => {
    clearTimeout(timerId);
  };
}, [isSuccessStartedExecute]);

useEffect(() => {
  const reloadPage = () => {
    window.location.reload();
  };

  if (isExecuted) {
    reloadPage();
  }
}, [isExecuted]);



// prova reload REVOKE

useEffect(() => {
  let timerId: NodeJS.Timeout;

  if (isSuccessStartedRevoke) {
    timerId = setTimeout(() => {
      setIsExecuted(true);
    }, 5000); 
  }

  return () => {
    clearTimeout(timerId);
  };
}, [isSuccessStartedRevoke]);

useEffect(() => {
  const reloadPage = () => {
    window.location.reload();
  };

  if (isExecuted) {
    
    reloadPage();
    
  }
}, [isExecuted]);



//PROVA RELOAD IMHERE
useEffect(() => {
  let timerId: NodeJS.Timeout;

  if (isSuccessStartedImHere) {
    timerId = setTimeout(() => {
      setIsExecuted(true);
    }, 5000); 
  }

  return () => {
    clearTimeout(timerId);
  };
}, [isSuccessStartedImHere]);

useEffect(() => {
  const reloadPage = () => {
    window.location.reload();
  };

  if (isExecuted) {
    reloadPage();
  }
}, [isExecuted]);



//decode proposal data

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
    <div className="card p-3">
      <b>Index: {proposal?.index.toString()}</b>
      <div>Executed: {proposal?.executed.toString()}</div>
      <div>Number of confirmations: {proposal?.numConfirmations.toString()}</div>
      <div>Proposal Type: {
        proposal?.proposalType === ProposalTypeEnum.Transaction ? "Transaction" :
        proposal?.proposalType === ProposalTypeEnum.NewOwner ? "New Owner" :
        proposal?.proposalType === ProposalTypeEnum.RemoveOwner ? "Remove Owner" :
        proposal?.proposalType === ProposalTypeEnum.ChangeThreshold ? "Change Threshold" :
        proposal?.proposalType === ProposalTypeEnum.ChangeNumConfirmations ? "Change Number of Confirmations" :
        proposal?.proposalType === ProposalTypeEnum.ChangeOwner ? "Change Owner" :
        proposal?.proposalType === ProposalTypeEnum.TokenTransaction ? "Token Transaction" :
        proposal?.proposalType === ProposalTypeEnum.NFTTransaction ? "NFT Transaction" :
        "Unknown"}
      </div>
      <div>{decodedData()}</div>
      Encoded proposal data: {proposal?.proposalData}

        
      <div>
          {
            !proposal?.executed && (
              <button
              className="btn btn-success me-1"
                type="submit"
                onClick={onSubmitConfirm}
                disabled={proposal?.executed}
                //per il css
                data-create-loading-execute={isLoadingConfirm}
                data-create-started-execute={isSuccessStartedConfirm}
              >
                
                {isLoadingConfirm && "Waiting for approval"}
                {isSuccessStartedConfirm && "Executing..."}
                {!isLoadingConfirm && !isSuccessStartedConfirm && "Confirm"}
                {proposal?.numConfirmations.toString() === "_numConfirmationsRequired" && "Confirmed"}
              </button>
              
            )}
          </div>
  
          {errorConfirm && <p className="error">{errorConfirm.message}</p>}
          {errorPrepareConfirm && <p className="error">{(errorPrepareConfirm as any).reason}</p>}
            
              

          <div>
            
          {!proposal?.executed && (
              <button
              className="btn btn-primary me-1"
                type="submit"
                onClick={onSubmitExecute}
                disabled={proposal?.executed}
                //per il css
                data-create-loading-execute={isLoadingExecute}
                data-create-started-execute={isSuccessStartedExecute}
              >
                {isLoadingExecute && "Waiting for approval"}
                {isSuccessStartedExecute && "Executing..."}
                {!isLoadingExecute && !isSuccessStartedExecute && "Execute"}
              </button>
            )}
            {proposal?.executed && (
              <p className="text-success">Executed</p>)}
          </div>
            
          
          {writeErrorExecute && <p className="error">{writeErrorExecute.message}</p>}
          {errorExecutePrepare && <p className="error">{(errorExecutePrepare as any).reason}</p>}
             
        

      <div>
      {!proposal?.executed && (
              <button
              className="btn btn-danger me-1"
                type="submit"
                onClick={onSubmitRevoke}
                disabled={proposal?.executed}
                //per il css
                data-create-loading-execute={isLoadingRevoke}
                data-create-started-execute={isSuccessStartedRevoke}
              >
                {isLoadingRevoke && "Waiting for revoke"}
                {isSuccessStartedRevoke && "Executing revoke..."}
                {!isLoadingRevoke && !isSuccessStartedRevoke && "Revoke"}
                
              </button>
            )}
           
          </div>
          
          {isErrorRevoke && <p className="error">{isErrorRevoke}</p>}
          {errorRevokePrepare && <p className="error">{(errorRevokePrepare as any).reason}</p>}


        {proposal?.proposalType === ProposalTypeEnum.ChangeOwner && !proposal.executed && (
          <div>
            <button
              className="btn btn-primary me-1"
              type="submit"
              onClick={onSubmitImHere}
              disabled={proposal?.executed}
              //per il css
              data-create-loading-ImHere={isLoadingImHere}
              data-create-started-ImHere={isSuccessStartedImHere}
            >
              {isLoadingImHere && "Waiting for approval"}
              {isSuccessStartedImHere && "Executing..."}
              {!isLoadingImHere && !isSuccessStartedImHere && "I'm Here"}
            </button>


            {errorImHere && <p className="error">{errorImHere.message}</p>}
            {errorImHerePrepare && <p className="error">{(errorImHerePrepare as any).reason}</p>}
          </div>
        )}
        
        { proposal?.proposalType === ProposalTypeEnum.ChangeOwner
          || proposal?.proposalType === ProposalTypeEnum.RemoveOwner 
          || proposal?.proposalType === ProposalTypeEnum.NewOwner 
        && proposal.executed && (
          
            <div>
            <button
				className="btn btn-primary me-1"
				onClick={() => {
					navigate(`/wallets/${address}/owners`);
				}}
			>
				Owners' settings
			</button>
            </div>
        )}

    </div>
  );
};

