import { ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { IInitialize } from "../../model/initialize-model";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDebounce } from "use-debounce";

 
 type PcreateWallet = {
    defaultValue: IInitialize; 
}

const contractAbi = [{"inputs":[{"internalType":"address","name":"_implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"proxy","type":"address"}],"name":"ProxyCreated","type":"event"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_numConfirmationsRequired","type":"uint256"},{"internalType":"uint256","name":"_numTreshold","type":"uint256"}],"name":"createWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementationContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

const contractAddress = "0x078c1b2e22677C910dbEA73885Cef1ED679E2e3d";
export const CreateWallet = (props : PcreateWallet) => {

  const[creatingWallet, setCreatingWallet] = useState("");
  const[owners, setOwners] = useState(Number);
  const[confirmations, setConfirmations] = useState(Number);
  const[treshold, setTreshold] = useState(Number);
  const[newWalletAddress, setNewWalletAddress] = useState("");

 //parametri per la creazione del wallet
  const debouncedOwners = useDebounce(owners, 500)
  const debouncedConfirmations = useDebounce(confirmations, 500)
  const debouncedTreshold = useDebounce(treshold, 500)
  const debouncedCreatingContract = useDebounce(creatingWallet, 500)

  
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const { connect, connectors,  } = useConnect();
    const navigate = useNavigate();
    const { 
      register, 
      formState: { errors } 
    } = useForm({
    mode: "onSubmit",
    defaultValues: props.defaultValue
    });
  

    //preparo il contratto
    const alchemyApiKey = "z8b0aKqHNwhW3rp7JdoPv1_dUrOAW1dI";
    const provider = new ethers.providers.AlchemyProvider("maticmum", alchemyApiKey);
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);


    //preparo la funzione per creare il wallet
    const { 
      config, 
      error: prepareError, 
      isError: isPrepareError, 
    } = usePrepareContractWrite({
      address: contractAddress,
      abi: contractAbi,
      functionName: "createWallet",
      //args:[debouncedOwners, debouncedConfirmations, debouncedTreshold],
      args:[["0x4165279351bFA40e821ac16AeA60ed29d9c1Bb29", "0x63ce1ec5bf1163dc7dcf2c1d7f5d5f3d56c6fcbb"],1 , 1],
      enabled: Boolean(debouncedCreatingContract),
    });
   
   
    const {
      isSuccess: isCreateStarted, 
      isLoading: isCreateLoading,
      data: dataContract,
      error,
      write,
     } = useContractWrite(config);
  
//funzione per deployare
  const {isSuccess: txSuccess } = useWaitForTransaction({
    hash: dataContract?.hash
   })
    const isCreateWallet = txSuccess;
      
      if(isCreateWallet){    
          
      contract.once("ProxyCreated", async (_address) => {
        console.log("multisig creato:", _address);
        setNewWalletAddress(_address);
        
        //navigate(`/wallets/${_address}}`);
    });

}

          
    return (
      <div className="createWallet">
              {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}

      <div>
        {address && <div>Address: {address}</div>}
        {balance && <div>Balance: {balance.formatted}</div>}
        {error && <div>Error: {error.message} </div>}
      </div>

      <div>
       <p>Contract Address: {contractAddress}</p> 
        <p>Hash transaction: {dataContract?.hash}</p>
        <p>address nuovo contratto: {newWalletAddress}</p>
    </div>

        <div>
            view on{" "}
        <a href=
        {`https://mumbai.polygonscan.com/tx/${dataContract?.hash}`}
        >Polygon Mumbai scan:</a>
        </div>

        
        <form
      onSubmit={(e) => {
        e.preventDefault()
        write?.()
      }}
    >
      

        <div className="row">
          <label className="queryInput" htmlFor="owners">
            Insert owners:
          </label>

          <input
            className="input"
            id="owners"           
            {...register("owners", {
              required: { value: true, message: "Field required" },
              //minLength: { value: 1, message: "Min 1 character allowed" },
            })}
            onChange={(e) => setOwners(e.target.valueAsNumber)}
            value={owners}
            //placeholder="owners"
          />
          {errors.owners && errors.owners?.message}
        </div>

        <div className="row">
          <label className="queryInput" htmlFor="numConfirmationsRequired">
            Insert Number of Confermation Required:
          </label>

          <input
            className="input"
            id="numConfirmationsRequired"
            {...register("numConfirmationsRequired", {
              required: { value: true, message: "Field required" },
            })}
            onChange={(e) => setConfirmations(e.target.valueAsNumber)}
            value={confirmations}
            //placeholder="numConfirmaionRequired"
          />
          {errors. numConfirmationsRequired && errors.numConfirmationsRequired?.message}
        </div>
        
        <div className="row">
          <label className="queryInput" htmlFor="numTreshold">
            Insert numero Treshold:
          </label>

          <input
            className="input"
            id="numTreshold"   
            {...register("numTreshold", {
              required: { value: true, message: "Field required" },
            })}
            onChange={(e) => setTreshold(e.target.valueAsNumber)}
            value={treshold}
            
          />
          {errors.numTreshold && errors.numTreshold?.message}
        </div>
        
     
        <div>
      {isConnected && !isCreateWallet &&(
        <button
        className="btn" 
        type="submit"
        onChange={(e) => setCreatingWallet(creatingWallet)}
        value={creatingWallet}
        disabled={isCreateLoading || isCreateStarted}
        //per il css
        data-create-loading = {isCreateLoading}
        data-create-started = {isCreateStarted}
        
        >
            {isCreateLoading && "Waiting for approval"}
            {isCreateStarted && "Creating..."}
            {!isCreateLoading && !isCreateStarted && "CreateWallet"}
        </button>
        
      )}
      </div>

      
      {(isPrepareError || error) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </form>
  </div>
    ); 
}