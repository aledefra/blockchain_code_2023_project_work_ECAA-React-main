import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { _alchemyKey } from "../../utils/key";

  type PNFTTransactionProposal = {
    addressToNFTtransfer: string;
    addressNFT: string;
    idNFT: string;
  };

export const NFTTransaction = (props: PNFTTransactionProposal) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress || "";
  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  //Propose NFT transaction 7

  const [NFTTransaction, setNFTTransaction] =
    useState<PNFTTransactionProposal>({
      addressToNFTtransfer: "",
      addressNFT: "",
      idNFT: "",
    });

const contractAddress = myAddress; 
const alchemyApiKey = _alchemyKey;
const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
  alchemyApiKey
); 

const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      addressToNFTtransfer: NFTTransaction.addressToNFTtransfer,
      addressNFT: NFTTransaction.addressNFT,
      idNFT: NFTTransaction.idNFT,
    },
  });


//Propose NFT Transaction 7
  const {
    config: configNFTTransaction,
    error: prepareErrorNFTTransaction,
    isError: isPrepareErrorNFTTransaction,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeNFTTransaction",
    args: [
      NFTTransaction.addressToNFTtransfer,
      NFTTransaction.addressNFT,
      parseInt(NFTTransaction.idNFT),
    ],
  });

  const {
    isSuccess: isStartedCreateNFTTransactionProposal,
    isLoading: isCreateNFTTransactionProposalLoading,
    data: dataProposalNFTTransaction,
    error: errorNFTTransaction,
    write: writeForNFTTransaction,
  } = useContractWrite(configNFTTransaction);

  function onSubmitNFTtransaction() {
    if (!writeForNFTTransaction) return;
    writeForNFTTransaction();
  }
//reload and navigate to wallet page

const [isExecuted, setIsExecuted] = useState(false);

useEffect(() => {
  let timerId: NodeJS.Timeout;

  if (isStartedCreateNFTTransactionProposal) {
    timerId = setTimeout(() => {
      setIsExecuted(true);
    }, 5000); 
  }

  return () => {
    clearTimeout(timerId);
  };
}, [isStartedCreateNFTTransactionProposal]);

useEffect(() => {
  const goProposal = () => {
    navigate(`/wallets/${myAddress}`);
    
  };

  if (isExecuted) {
    goProposal();
    
  }
  
}, [isExecuted]);

return (

               <form>
                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert recive address NFT:
                  </label>

                  <input
                    className="ProposalType form-control"
                    id="NFTTransaction"
                    {...register("addressToNFTtransfer", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setNFTTransaction((NFTTransaction) => ({
                        ...NFTTransaction,
                        addressToNFTtransfer: e.target.value,
                      }))
                    }
                    value={NFTTransaction.addressToNFTtransfer}
                    placeholder="address to send token"
                  />
                </div>
                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert NFT contract address:
                  </label>

                  <input
                    className="input form-control"
                    id="NFTTransaction"
                    {...register("addressNFT", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setNFTTransaction((NFTTransaction) => ({
                        ...NFTTransaction,
                        addressNFT: e.target.value,
                      }))
                    }
                    value={NFTTransaction.addressNFT}
                    placeholder="contract address NFT"
                  />
                </div>

                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert id NFT:
                  </label>

                  <input
                    className="input form-control"
                    id="NFTTransaction"
                    {...register("idNFT", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setNFTTransaction((NFTTransaction) => ({
                        ...NFTTransaction,
                        idNFT: e.target.value,
                      }))
                    }
                    value={NFTTransaction.idNFT}
                    placeholder="id NFT send"
                  />
                </div>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitNFTtransaction)}
                    disabled={isCreateNFTTransactionProposalLoading || isStartedCreateNFTTransactionProposal}
                    //per css
                    data-create-loading={isCreateNFTTransactionProposalLoading}
                    data-create-started={isCreateNFTTransactionProposalLoading}
                  >
                    {isStartedCreateNFTTransactionProposal && "Waiting for approval"}
                    {isCreateNFTTransactionProposalLoading && "Executing..."}
                    {!isCreateNFTTransactionProposalLoading && !isStartedCreateNFTTransactionProposal && "Send"}
                  </button>
                </div>

                {(isPrepareErrorNFTTransaction || errorNFTTransaction) && (
                  <div>
                    Error: {(prepareErrorNFTTransaction || errorNFTTransaction)?.message}
                  </div>
                )}
              </form>

)

}