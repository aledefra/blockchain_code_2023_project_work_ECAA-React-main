import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useNavigate, useParams } from "react-router-dom";
import { _alchemyKey } from "../../utils/key";
import { erc721ABI } from 'wagmi'

  type PNFTTransactionProposal = {
    addressToNFTtransfer: string;
    addressNFT: string;
    idNFT: string;
  };

export const NFTTransaction = (props: PNFTTransactionProposal) => {
  const navigate = useNavigate();
  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  const [addressToNFTtransfer, setAddressToNFTtransfer] = useState("");
  const [addressNFT, setAddressNFT] = useState("");
  const [idNFT, setIdNFT] = useState("");


const alchemyApiKey = _alchemyKey;
const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
  alchemyApiKey
); 

//NFT name
const {
  data: dataNFT,
}  = useContractRead({
  address: addressNFT as `0x${string}` ,
  abi: erc721ABI,
  functionName: "name",
})


const {
    register,
    handleSubmit,
    } = useForm({
    mode: "onSubmit",
    defaultValues: {
      addressToNFTtransfer: addressToNFTtransfer,
      addressNFT: addressNFT,
      idNFT: idNFT,
    },
  });

//prepare Write for NFT transaction
  const {
    config: configNFTTransaction,
    error: prepareErrorNFTTransaction,
    isError: isPrepareErrorNFTTransaction,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeNFTTransaction",
    args: [
      addressToNFTtransfer,
      addressNFT,
      idNFT, 
    ],
  });

  //write for NFT transaction
  const {
    isSuccess: isStartedCreateNFTTransactionProposal,
    isLoading: isCreateNFTTransactionProposalLoading,
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
                    Insert the receiving address for the NFT:
                  </label>

                  <input
                    className="ProposalType form-control"
                    id="NFTTransaction"
                    {...register("addressToNFTtransfer", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      
                      setAddressToNFTtransfer(e.target.value) 
                      }
                      value={addressToNFTtransfer}
                    placeholder="address to send token"
                  />
                </div>
                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert the NFT contract address:
                  </label>

                  <input
                    className="input form-control"
                    id="NFTTransaction"
                    {...register("addressNFT", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                     setAddressNFT(e.target.value)
                    }
                    value={addressNFT}
                    placeholder="contract address NFT"
                  />
                </div>

                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert NFT's id to send:
                  </label>

                  <input
                    className="input form-control"
                    id="NFTTransaction"
                    {...register("idNFT", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setIdNFT(e.target.value)
                    }
                    value={idNFT}
                    placeholder="id NFT send"
                  />
                </div>
                <div>
                  NFT name : {dataNFT}
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