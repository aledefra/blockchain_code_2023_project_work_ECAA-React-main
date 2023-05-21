import { ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  Address,
} from "wagmi";
import { IInitialize } from "../../model/initialize-model";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { contractAbiMulti } from "../../contract-abi";
import { _alchemyKey } from "../../utils/key";

type PcreateWallet = {
  defaultValue: IInitialize;
};


const contractAbi = contractAbiMulti;

const contractAddress = "0x06a9FAD3C4CECb75AC5c2Dc96aEbb298318826bc";


export const CreateWallet = (props: PcreateWallet) => {
  const [owners, setOwners] = useState("");
  const [confirmations, setConfirmations] = useState("");
  const [treshold, setTreshold] = useState("");
  const [name, setName] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");

  //parametri per la creazione del wallet
  const debouncedOwners = useDebounce(owners, 500);
  const debouncedConfirmations = useDebounce(confirmations, 500);
  const debouncedTreshold = useDebounce(treshold, 500);
  

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { connect, connectors } = useConnect();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: props.defaultValue,
  });

  //preparo il contratto
  const alchemyApiKey = _alchemyKey;
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    alchemyApiKey
  );
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  const formattedOwners = debouncedOwners[0]
    .split(",")
    .map((address) => address.trim());


  //preparo la funzione per creare il wallet
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createWallet",
    args: [
      formattedOwners,
      parseInt(debouncedConfirmations[0]),
      parseInt(debouncedTreshold[0]),
    ],
    
  });

  const {
    isSuccess: isCreateStarted,
    isLoading: isCreateLoading,
    data: dataContract,
    error: writeError,
    write,
  } = useContractWrite(config);


  function onSubmit() {
    if (!write) return;
    write();
  }

  //funzione per deployare
  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: dataContract?.hash,
  });
  const isCreateWallet = txSuccess;

  

  useEffect(() => {
    const handleProxyCreated = async (_address:Address) => {
      setNewWalletAddress(_address);
    };

    contract.once("ProxyCreated", handleProxyCreated);
  }, []);

  useEffect(() => {
    if (newWalletAddress) {
      const savedContracts = JSON.parse(
        localStorage.getItem("contracts") || "[]"
      );
      const newContract = { address: newWalletAddress, name: name };
      localStorage.setItem("contracts", JSON.stringify([...savedContracts, newContract]));

      props.defaultValue.newWalletAddress = newWalletAddress;
      navigate(`/wallets/${newWalletAddress}`);
    }
  }, [newWalletAddress]);

  
//da valutare se può essere utile per passare il numero di conferme da raggiungere
  type PnumConfirmationsRequiredtoExecute = {
      _confirmation: string;  
      };

  const [numConfirmationsRequiredtoExecute, setNumConfirmationsRequiredtoExecute] = useState<PnumConfirmationsRequiredtoExecute>({
    _confirmation: "",
  });
  

  useEffect(() => {
    if (isCreateStarted) {
  setNumConfirmationsRequiredtoExecute({
    _confirmation: confirmations,
  })
    }
  }, [isCreateStarted]);
  

  


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
      </div>

      <div>
        {isConnected && <p>Proxy Contract Address: {contractAddress}</p>}
        {isCreateWallet && (
          <p>Creato multisig, transaction hash: {dataContract?.hash}</p>
        )}
        {isCreateWallet && (
          <p>Address nuovo contratto multisig creato: {newWalletAddress}</p>
        )}
      </div>

      {isCreateWallet && (
        <div>
          view tx oon{" "}
          <a href={`https://mumbai.polygonscan.com/tx/${dataContract?.hash}`}>
            Polygon Mumbai scan
          </a>
        </div>
      )}

      <form>
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
            placeholder="owners comma separated"
          />
        </div>

        <div className="row">
          <label className="queryInput" htmlFor="numConfirmationsRequired">
            Insert Number of Confirmation Required:
          </label>

          <input
            className="input"
            id="numConfirmationsRequired"
            {...register("numConfirmationsRequired", {
              required: { value: true, message: "Field required" },
            })}
            onChange={(e) => setConfirmations(e.target.value)}
            value={confirmations}
            placeholder="numConfirmationsRequired"
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
            placeholder="treshold number"
          />
        </div>

        <div className="row">
          <label className="queryInput" htmlFor="name">
            Insert name:
          </label>

          <input
            className="input"
            id="name"
            {...register("name", {
              required: { value: true, message: "Field required" },
              //minLength: { value: 1, message: "Min 1 character allowed" },
            })}
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="name"
          />
        </div>

        <div>
          {isConnected && !isCreateWallet && (
            <button
              className="btn"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isCreateLoading || isCreateStarted}
              //per il css
              data-create-loading={isCreateLoading}
              data-create-started={isCreateStarted}
            >
              {isCreateLoading && "Waiting for approval"}
              {isCreateStarted && "Creating..."}
              {!isCreateLoading && !isCreateStarted && "Create Wallet"}
            </button>
          )}
        </div>

        {writeError && <p className="error">Error: {writeError.message}</p>}
        {prepareError && <p className="error">Error: {(prepareError as any).reason}</p>}
      </form>
    </div>
  );
};

