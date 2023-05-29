import { ethers } from "ethers";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  Address,
} from "wagmi";
import { IInitialize } from "../../model/initialize-model";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { contractAbiMulti } from "../../contract-abi";

type PcreateWallet = {
  defaultValue: IInitialize;
};


const contractAbi = contractAbiMulti;

const proxyContractAddress = "0x5d5963918eB969531Cdaccb9D8374208f7c371b2";
const LogicContractAddress = "0xb27B8640CBccDa874182A9001bcCfA39B154C227";


export const CreateWallet = (props: PcreateWallet) => {
  const [confirmations, setConfirmations] = useState("");
  const [treshold, setTreshold] = useState("");
  const [name, setName] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");

  //parametri per la creazione del wallet
  const debouncedConfirmations = useDebounce(confirmations, 500);
  const debouncedTreshold = useDebounce(treshold, 500);
  

  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    getValues,
  } = useForm({
    mode: "onSubmit",
    defaultValues: props.defaultValue,
  });
  const { fields, append, remove} = useFieldArray({
    control,
    name: "owners",
  });

  //preparo il contratto
  const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    alchemyApiKey
  );
  const contract = new ethers.Contract(proxyContractAddress, contractAbi, provider);
  
  //preparo la funzione per creare il wallet
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: proxyContractAddress,
    abi: contractAbi,
    functionName: "createWallet",
    args: [
      getValues("owners").map((owner: { address: string }) =>
        owner.address.trim()
      ),
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

    //check if there are duplicate owners
    const owners = getValues("owners").map((owner: { address: string }) => owner.address.trim());
    for (let i = 0; i < owners.length; i++) {
      for (let j = i + 1; j < owners.length; j++) {
        if (owners[i] === owners[j]) {
          alert("You cannot insert duplicate owners");
          return;
        }
      }
    }

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
      <div>
        <h1>Create Wallet</h1>

        {isConnected && <p>Proxy Contract Address: {proxyContractAddress}</p>}
        {isConnected && (
          <p>Multisig Logic Contract Address: {LogicContractAddress}</p>
        )}
        {isCreateWallet && (
          <p>Multisig created, transaction hash: {dataContract?.hash}</p>
        )}
        {isCreateWallet && <p>Address new multisig: {newWalletAddress}</p>}
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

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              append({ address: "" });
            }}
          >
            Add Owner
          </button>

          <div className="mb-2">
            {fields.map((item, index, array) => (
              <>
                <div key={item.id} className="input-group my-1">
                  <input
                    placeholder="0x..."
                    className="form-control"
                    {...register(`owners.${index}.address`)}
                  />
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="row">
          <label className="queryInput" htmlFor="numConfirmationsRequired">
            Insert Number of Confirmation Required:
          </label>

          <input
            className="form-control"
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
            className="form-control"
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
            className="form-control"
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
              className="btn btn-primary mt-2"
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
        {prepareError && (
          <p className="error">Error: {(prepareError as any).reason}</p>
        )}
      </form>
    </div>
  );
};

