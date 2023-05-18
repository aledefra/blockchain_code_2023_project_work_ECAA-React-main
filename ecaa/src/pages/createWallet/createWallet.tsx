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
<<<<<<< Updated upstream
import { contractAbiMulti } from "../../contractABIs/proxycontract-abi";
=======
import { contractAbiMulti } from "../../contract-abi";
>>>>>>> Stashed changes

type PcreateWallet = {
  defaultValue: IInitialize;
};

const contractAbi = contractAbiMulti;

const contractAddress = "0x078c1b2e22677C910dbEA73885Cef1ED679E2e3d";

export const CreateWallet = (props: PcreateWallet) => {
  const [owners, setOwners] = useState("");
  const [confirmations, setConfirmations] = useState("");
  const [treshold, setTreshold] = useState("");
  const [name, setName] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");

  //parametri per la creazione del wallet
  const debouncedOwners = useDebounce(owners, 500);
  console.log("Debounced", debouncedOwners);
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
  const alchemyApiKey = "z8b0aKqHNwhW3rp7JdoPv1_dUrOAW1dI";
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    alchemyApiKey
  );
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  const formattedOwners = debouncedOwners[0]
    .split(",")
    .map((address) => address.trim());
  console.log("formatted owners", formattedOwners);

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
    //args:[["0x4165279351bFA40e821ac16AeA60ed29d9c1Bb29", "0x63ce1ec5bf1163dc7dcf2c1d7f5d5f3d56c6fcbb"],1 , 1],
<<<<<<< Updated upstream
=======
    
>>>>>>> Stashed changes
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
    const handleProxyCreated = async (_address: Address) => {
      setNewWalletAddress(_address);
      console.log("multisig creato:", newWalletAddress);
    };

    contract.once("ProxyCreated", handleProxyCreated);
  }, []);

  useEffect(() => {
    if (newWalletAddress) {
      const savedContracts = JSON.parse(
        localStorage.getItem("contracts") || "[]"
      );
      const newContract = { address: newWalletAddress, name: name };
      localStorage.setItem(
        "contracts",
        JSON.stringify([...savedContracts, newContract])
      );

      props.defaultValue.newWalletAddress = newWalletAddress;
      navigate(`/wallets`);
    }
  }, [newWalletAddress]);

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
          view tx on{" "}
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
<<<<<<< Updated upstream
              //minLength: { value: 1, message: "Min 1 character allowed" },
=======
            //minLength: { value: 1, message: "Min 1 character allowed" },
>>>>>>> Stashed changes
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

        {(isPrepareError || error) && (
          <div>Error: {(prepareError || error)?.message}</div>
        )}
      </form>
    </div>
  );
};
