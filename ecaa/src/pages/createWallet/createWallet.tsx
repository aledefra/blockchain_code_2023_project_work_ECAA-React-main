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
export const CreateWallet = (props: PcreateWallet) => {

  const[creatingWallet, setCreatingWallet] = useState("");
  const[owners, setOwners] = useState("");
  const[confirmations, setConfirmations] = useState("");
  const[treshold, setTreshold] = useState("");
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
      handleSubmit,
      formState: { errors } 
    } = useForm({
    mode: "onSubmit",

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
      address:contractAddress,
      abi: contractAbi,
      functionName: "createWallet",
      args:[
     owners.split(",").map((address) => address.trim()),
     parseInt(confirmations),
     parseInt(treshold),
   ],
      //args:[["0x4165279351bFA40e821ac16AeA60ed29d9c1Bb29", "0x63ce1ec5bf1163dc7dcf2c1d7f5d5f3d56c6fcbb"],1 , 1],
      enabled: Boolean(debouncedCreatingContract),
    });
   
   
    const {
      isSuccess: isCreateStarted, 
      isLoading: isCreateLoading,
      data: dataContract,
      error,
      write,
     } = useContractWrite(config);
console.log(config);
console.log(dataContract);
     function handleit() {
     if (!write) return;
     write();
      
     }
  
//funzione per deployare
  const {isSuccess: txSuccess } = useWaitForTransaction({
    hash: dataContract?.hash
   })
    const isCreateWallet = txSuccess;
      
      if(isCreateWallet){    
          
      contract.once("ProxyCreated", async (_address) => {
        
        setNewWalletAddress(_address);
        console.log("multisig creato:", newWalletAddress);
        
        //navigate(`/wallets/${_address}}`);
    });

  console.log(error?.message);

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
       <p>Proxy Contract Address: {contractAddress}</p> 
        {isCreateWallet && <p>Hash transaction: {dataContract?.hash}</p>}
        {isCreateWallet &&<p>address nuovo contratto: {newWalletAddress}</p>}
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
            onChange={(e) => setOwners(e.target.value)}
            value={owners}
            //placeholder="owners"
          />
        
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
            onChange={(e) => setConfirmations(e.target.value)}
            value={confirmations}
            //placeholder="numConfirmaionRequired"
          />

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
            onChange={(e) => setTreshold(e.target.value)}
            value={treshold}
            
          />

        </div>
        
     
        <div>
      {isConnected && !isCreateWallet &&(
        <button
        className="btn" 
        type="submit"
        onClick={handleSubmit(handleit)}
        value={creatingWallet}
        disabled={isCreateLoading || isCreateStarted}
        //per il css
        data-create-loading = {isCreateLoading}
        data-create-started = {isCreateStarted}
        
        >
            {isCreateLoading && "Waiting for approval"}
            {isCreateStarted && "Creating..."}
            {!isCreateLoading && !isCreateStarted && "Create Wallet"}
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
