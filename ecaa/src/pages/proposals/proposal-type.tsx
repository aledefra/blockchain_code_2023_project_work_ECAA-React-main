import { useEffect, useState } from "react";
import { contractAbiMulti } from "../../contract-abi";
import { defaultInitialize } from "../../utils/createWallet";
import { Transaction, ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useForm } from "react-hook-form";
import { IProposalType } from "../../model/proposalType-model";
import { MyWallets } from "../multisigWallet/MyWallets";
import { useLocation } from "react-router-dom";


type PchoseType = {
  defaultValues: IProposalType;
};
export const CreateProposal = (props: IProposalType) => {
  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress || '';




  const contractAbi = contractAbiMulti;
  
  //const contractAddress: string = defaultInitialize.newWalletAddress;
const contractAddress = selectedAddress;
  console.log("questo è il contract address", contractAddress.toString())
  console.log("questo è il selected address", selectedAddress.toString())
  
  //Proposal Transaction
  const [addressTo, setAddressTo] = useState("");
  const formattedAddressTo: `0x${string}` = `0x${addressTo}`;
  const [amount, setAmount] = useState("");

  //Proposal New Owner

  const [newOwner, setNewOwner] = useState("");
  const formattedAddressNewOwner: `0x${string}` = `0x${newOwner}`;

    //Proposal Remove Owner

    const [removeOwner, setRemoveOwner] = useState("");
    const formattedAddressRemoveOwner: `0x${string}` = `0x${removeOwner}`;

    //Proposal Change Treshold

    const [treshold, setTreshold] = useState("");

    //Proposal Change Owner

    const [oldAddressOwner, setOldAddressOwner] = useState("");
    const formattedOldAddressOwner: `0x${string}` = `0x${oldAddressOwner}`;
    const [newOwnerChanged, setNewOwnerChanged] = useState("");
    const formattedNewAddressOwner: `0x${string}` = `0x${newOwnerChanged}`;

    //Propose token transaction 

    const [addressToTokenTransaction, setAddressToTokenTransaction] = useState("");
    const formattedToAddressTokenTransaction: `0x${string}` = `0x${addressToTokenTransaction}`;
    const [contractAddressToken, setContractAddressToken] = useState("");
    const formattedContractAddressToken: `0x${string}` = `0x${contractAddressToken}`;
    const [valueToken, setValueToken] = useState("");

    //Propose NFT transaction 

    const [addressToNFTTransaction, setAddressToNFTTransaction] = useState("");
    const formattedToAddressNFTTransaction: `0x${string}` = `0x${addressToNFTTransaction}`;
    const [contractAddressNFT, setContractAddressNFT] = useState("");
    const formattedContractAddressNFT: `0x${string}` = `0x${contractAddressNFT}`;
    const [idToken, setIdToken] = useState("");
    
 

  //chiavi alchemy
  const alchemyApiKey = "z8b0aKqHNwhW3rp7JdoPv1_dUrOAW1dI";
  const provider = new ethers.providers.AlchemyProvider("maticmum", alchemyApiKey);
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: props,
  });

  const watchType = watch("ChooseType");

//Propose Transaction 0

  const {
    config : configTransaction,
    error: prepareErrorTransaction,
    isError: isPrepareErrorTransaction,
  } = usePrepareContractWrite({
    address: contractAddress ,
    abi: contractAbi,
    functionName: "proposeTransaction",
    args: [
      formattedAddressTo,
      amount
    ],   
  });

  const {
    isSuccess: isCreateStarted,
    isLoading: isCreateLoading,
    data: dataTransaction,
    error,
    write: writeTransaction,
  } = useContractWrite(configTransaction);
 

  
  function onSubmitTransaction() {
    if (!writeTransaction) return;
    writeTransaction();
  }


  //Propose New Owner 1
  const {
    config : configNewOwner,
    error: prepareErrorNewOwner,
    isError: isPrepareErrorNewOwner,
  } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "proposeNewOwner",
    args: [
      formattedAddressNewOwner
    ],   
  });

  const {
    isSuccess: isCreateNewOwnerProposal,
    isLoading: isCreateNewOwnerProposalLoading,
    data: dataProposalNewOwner,
    error : errorNewOwner,
    write: writeForNewOwner,
  } = useContractWrite(configNewOwner);


  function onSubmitNewOwner() {
    if (!writeForNewOwner) return;
    writeForNewOwner();
  }

    //Propose Remove Owner 2
    const {
      config : configRemoveOwner,
      error: prepareErrorRemoveOwner,
      isError: isPrepareErrorRemoveOwner,
    } = usePrepareContractWrite({
      address: contractAddress,
      abi: contractAbi,
      functionName: "proposeRemoveOwner",
      args: [
        formattedAddressRemoveOwner
      ],   
    });
  
    const {
      isSuccess: isCreateRemoveOwnerProposal,
      isLoading: isCreateRemoveOwnerProposalLoading,
      data: dataProposalRemoveOwner,
      error : errorRemoveOwner,
      write: writeForRemoveOwner,
    } = useContractWrite(configRemoveOwner);
  
  
    function onSubmitRemoveOwner() {
      if (!writeForRemoveOwner) return;
      writeForRemoveOwner();
    }

//Propose Change Treshold 3 
const {
  config : configChangeTreshold,
  error: prepareErrorChangeTreshold,
  isError: isPrepareErrorChangeTreshold,
} = usePrepareContractWrite({
  address: contractAddress,
  abi: contractAbi,
  functionName: "proposeChangeThreshold",
  args: [
    treshold
  ],   
});

const {
  isSuccess: isCreateChangeTresholdProposal,
  isLoading: isCreateChangeTresholdProposalLoading,
  data: dataProposalChangeTreshold,
  error : errorChangeTreshold,
  write: writeForChangeTreshold,
} = useContractWrite(configChangeTreshold);


function onSubmitChangeTreshold() {
  if (!writeForChangeTreshold) return;
  writeForChangeTreshold();
}

//Propose Change Owner 4 
const {
  config : configChangeOwner,
  error: prepareErrorChangeOwner,
  isError: isPrepareErrorChangeOwner,
} = usePrepareContractWrite({
  address: contractAddress,
  abi: contractAbi,
  functionName: "proposeChangeOwner",
  args: [
    formattedOldAddressOwner,
    formattedNewAddressOwner
  ],   
});

const {
  isSuccess: isCreateChangeOwnerProposal,
  isLoading: isCreateChangeOwnerProposalLoading,
  data: dataProposalChangeOwner,
  error : errorChangeOwner,
  write: writeForChangeOwner,
} = useContractWrite(configChangeOwner);


function onSubmitChangeOwner() {
  if (!writeForChangeTreshold) return;
  writeForChangeTreshold();
}

//Propose Token Transaction 5
const {
  config : configTokenTransaction,
  error: prepareErrorTokenTransaction,
  isError: isPrepareErrorTokenTransaction,
} = usePrepareContractWrite({
  address: contractAddress,
  abi: contractAbi,
  functionName: "proposeTokenTransaction",
  args: [
    formattedToAddressTokenTransaction,
    formattedContractAddressToken,
    valueToken
  ],   
});

const {
  isSuccess: isCreateTokenTransactionProposal,
  isLoading: isCreateTokenTransactionProposalLoading,
  data: dataProposalTokenTransaction,
  error : errorTokenTransaction,
  write: writeForTokenTransaction,
} = useContractWrite(configTokenTransaction);


function onSubmitTokenTransaction() {
  if (!writeForTokenTransaction) return;
  writeForTokenTransaction();
}

//Propose NFT Transaction 6
const {
  config : configNFTTransaction,
  error: prepareErrorNFTTransaction,
  isError: isPrepareErrorNFTTransaction,
} = usePrepareContractWrite({
  address: contractAddress,
  abi: contractAbi,
  functionName: "proposeNFTTransaction",
  args: [
    formattedToAddressNFTTransaction,
    formattedContractAddressNFT,
    idToken
  ],   
});

const {
  isSuccess: isCreateNFTTransactionProposal,
  isLoading: isCreateNFTTransactionProposalLoading,
  data: dataProposalNFTTransaction,
  error : errorNFTTransaction,
  write: writeForNFTTransaction,
} = useContractWrite(configNFTTransaction);


function onSubmitNFTtransaction() {
  if (!writeForNFTTransaction) return;
  writeForNFTTransaction();
}

 




  return (
    <div className="createProposal">
  <h1>Create Proposals</h1>
  
  <p>Address nuovo contratto: {defaultInitialize.newWalletAddress}</p>
  
  <div className="row">
    <label className="queryInput" htmlFor="select">
      Choose the type:
    </label>
  
    <select
      className="selector"
      {...register("ChooseType", {
        required: { value: true, message: "Field required" },
      })}
    >
      <option value="">Type</option>
      <option value="Transaction">Transaction</option>
      <option value="NewOwner">New Owner</option>
      <option value="RemoveOwner">Remove Owner</option>
      <option value="ChangeTreshold">ChangeTreshold</option>
      <option value="ChangeOwner">Change Owner</option>
      <option value="TokenTransaction">Token ERC20 transaction</option>
      <option value="NFTTransaction">NFT transaction</option>
    </select>
  </div>
  
  {watchType && (
    <div className="row">
      {watchType.toString() === "Transaction" && (
        <>
          <form>
            <div className="row">
              <label className="queryInput" htmlFor="owners">
                Insert addressTo:
              </label>
              
              <input
                className="ProposalType"
                id="Transaction"
                {...register("Transaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setAddressTo(e.target.value)}
                value={addressTo}
                placeholder="Transaction"
              />
            </div>
  
            <div className="row">
              <label className="queryInput" htmlFor="valueTransaction">
                Insert value Transaction:
              </label>
  
              <input
                className="input"
                id="valueTransaction"
                {...register("Transaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                placeholder="value-transaction"
              />
            </div>
            
  
            <div>
              <button
                className="btn"
                type="submit"
                onClick={handleSubmit(onSubmitTransaction)}
                disabled={isCreateLoading || isCreateStarted}
                data-create-loading={isCreateLoading}
                data-create-started={isCreateStarted}
              >
                sendProposalTransaction
              </button>
            </div>
  
            {(isPrepareErrorTransaction || error) && (
              <div>Error: {(prepareErrorTransaction || error)?.message}</div>
            )}
          </form>
        </>
      )}
    </div>
  )}

  {watchType && (
    <div className="row">
      {watchType.toString() === "NewOwner" && (
        <>
          <form>
            <div className="row">
              <label className="queryInput" htmlFor="NewOwner">
                Insert address new Owner:
              </label>
              
              <input
                className="ProposalType"
                id="NewOwner"
                {...register("NewOwner", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setNewOwner(e.target.value)}
                value={newOwner}
                placeholder="new owner"
              />
            </div> 
  
            <div>
              <button
                className="btn"
                type="submit"
                onClick={handleSubmit(onSubmitNewOwner)}
                disabled={isCreateLoading || isCreateStarted}
                data-create-loading={isCreateLoading}
                data-create-started={isCreateStarted}
              >
                sendProposalNewOwner
              </button>
            </div>
  
            {(isPrepareErrorNewOwner || error) && (
              <div>Error: {(prepareErrorNewOwner || error)?.message}</div>
            )}
          </form>
        </>
      )}
    </div>
  )}

  {watchType && (
    <div className="row">
      {watchType.toString() === "RemoveOwner" && (
        <>
          <form>
            <div className="row">
              <label className="queryInput" htmlFor="Removeowner">
                Insert address address to delete owner:
              </label>
              
              <input
                className="ProposalType"
                id="RemoveOwner"
                {...register("RemoveOwner", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setRemoveOwner(e.target.value)}
                value={removeOwner}
                placeholder="address to remove owner"
              />
            </div> 
  
            <div>
              <button
                className="btn"
                type="submit"
                onClick={handleSubmit(onSubmitRemoveOwner)}
                disabled={isCreateLoading || isCreateStarted}
                data-create-loading={isCreateLoading}
                data-create-started={isCreateStarted}
              >
                sendProposalNewOwner
              </button>
            </div>
  
            {(isPrepareErrorRemoveOwner || error) && (
              <div>Error: {(prepareErrorRemoveOwner || error)?.message}</div>
            )}
          </form>
        </>
      )}
    </div>
  )}

{watchType && (
    <div className="row">
      {watchType.toString() === "ChangeTreshold" && (
        <>
          <form>
            <div className="row">
              <label className="queryInput" htmlFor="ChangeTreshold">
                Insert number of new treshold:
              </label>
              
              <input
                className="ProposalType"
                id="ChangeTreshold"
                {...register("ChangeThreshold", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setTreshold(e.target.value)}
                value={treshold}
                placeholder="number new treshold"
              />
            </div> 
  
            <div>
              <button
                className="btn"
                type="submit"
                onClick={handleSubmit(onSubmitChangeTreshold)}
                disabled={isCreateLoading || isCreateStarted}
                data-create-loading={isCreateLoading}
                data-create-started={isCreateStarted}
              >
                send new Treshold
              </button>
            </div>
  
            {(isPrepareErrorChangeTreshold || error) && (
              <div>Error: {(prepareErrorChangeTreshold || error)?.message}</div>
            )}
          </form>
        </>
      )}
    </div>
  )}

{watchType && (
    <div className="row">
      {watchType.toString() === "ChangeOwner" && (
        <>
          <form>
            <div className="row">
              <label className="queryInput" htmlFor="ChangeOwner">
                Insert old owner address 
              </label>
              
              <input
                className="ProposalType"
                id="ChangeOwner"
                {...register("ChangeOwner", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setOldAddressOwner(e.target.value)}
                value={oldAddressOwner}
                placeholder="old owner address"
              />
            </div> 
            <div className="row">
              <label className="queryInput" htmlFor="ChangeOwner">
                Insert new owner address:
              </label>
  
              <input
                className="input"
                id="ChangeOwner"
              {...register("ChangeOwner", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setNewOwnerChanged(e.target.value)}
                value={newOwnerChanged}
                placeholder="new owner address"
              />
            </div>
  
            <div>
              <button
                className="btn"
                type="submit"
                onClick={handleSubmit(onSubmitChangeOwner)}
                disabled={isCreateLoading || isCreateStarted}
                data-create-loading={isCreateLoading}
                data-create-started={isCreateStarted}
              >
                send proposal change owner
              </button>
            </div>
  
            {(isPrepareErrorChangeOwner || error) && (
              <div>Error: {(prepareErrorChangeOwner || error)?.message}</div>
            )}
          </form>
        </>
      )}
    </div>
  )}

{watchType && (
    <div className="row">
      {watchType.toString() === "TokenTransaction" && (
        <>
          <form>
            <div className="row">
              <label className="queryInput" htmlFor="TokenTransaction">
                Insert token transaction 
              </label>
              
              <input
                className="ProposalType"
                id="TokenTransaction"
                {...register("TokenTransaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setAddressToTokenTransaction(e.target.value)}
                value={addressToTokenTransaction}
                placeholder="address to send token"
              />
            </div> 
            <div className="row">
              <label className="queryInput" htmlFor="TokenTransaction">
                Insert token contract address
              </label>
  
              <input
                className="input"
                id="TokenTransaction"
              {...register("TokenTransaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setContractAddressToken(e.target.value)}
                value={contractAddressToken}
                placeholder="contract address token"
              />
            </div>

            <div className="row">
              <label className="queryInput" htmlFor="TokenTransaction">
                Insert value send
              </label>
  
              <input
                className="input"
                id="TokenTransaction"
              {...register("TokenTransaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setValueToken(e.target.value)}
                value={valueToken}
                placeholder="amount token send"
              />
            </div>
            
  
            <div>
              <button
                className="btn"
                type="submit"
                onClick={handleSubmit(onSubmitTokenTransaction)}
                disabled={isCreateLoading || isCreateStarted}
                data-create-loading={isCreateLoading}
                data-create-started={isCreateStarted}
              >
                send proposal change owner
              </button>
            </div>
  
            {(isPrepareErrorTokenTransaction || error) && (
              <div>Error: {(prepareErrorTokenTransaction || error)?.message}</div>
            )}
          </form>
        </>
      )}
    </div>
  )}

{watchType && (
    <div className="row">
      {watchType.toString() === "NFTTransaction" && (
        <>
          <form>
            <div className="row">
              <label className="queryInput" htmlFor="NFTTransaction">
                Insert NFT transaction 
              </label>
              
              <input
                className="ProposalType"
                id="NFTTransaction"
                {...register("NFTTransaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setAddressToNFTTransaction(e.target.value)}
                value={addressToNFTTransaction}
                placeholder="address to send token"
              />
            </div> 
            <div className="row">
              <label className="queryInput" htmlFor="NFTTransaction">
                Insert NFT contract address
              </label>
  
              <input
                className="input"
                id="NFTTransaction"
              {...register("NFTTransaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setContractAddressNFT(e.target.value)}
                value={contractAddressNFT}
                placeholder="contract address NFT"
              />
            </div>

            <div className="row">
              <label className="queryInput" htmlFor="NFTTransaction">
                Insert id NFT
              </label>
  
              <input
                className="input"
                id="NFTTransaction"
              {...register("NFTTransaction", {
                  required: { value: true, message: "Field required" },
                })}
                onChange={(e) => setIdToken(e.target.value)}
                value={idToken}
                placeholder="id NFT send"
              />
            </div>
            
  
            <div>
              <button
                className="btn"
                type="submit"
                onClick={handleSubmit(onSubmitNFTtransaction)}
                disabled={isCreateLoading || isCreateStarted}
                data-create-loading={isCreateLoading}
                data-create-started={isCreateStarted}
              >
                send proposal change owner
              </button>
            </div>
  
            {(isPrepareErrorNFTTransaction || error) && (
              <div>Error: {(prepareErrorNFTTransaction || error)?.message}</div>
            )}
          </form>
        </>
      )}
    </div>
  )}






</div>
  )}

 
 
    

