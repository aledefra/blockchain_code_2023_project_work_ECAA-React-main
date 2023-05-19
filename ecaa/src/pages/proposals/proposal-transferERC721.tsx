import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useLocation, useParams } from "react-router-dom";
import { _alchemyKey } from "../../utils/key";

  type PNFTTransactionProposal = {
    addressToNFTtransfer: string;
    addressNFT: string;
    idNFT: string;
  };

export const NFTTransaction = (props: PNFTTransactionProposal) => {

  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress || "";
  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  //Propose NFT transaction 7

  const [addressToNFTTransaction, setAddressToNFTTransaction] =
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
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      addressToNFTtransfer: addressToNFTTransaction.addressToNFTtransfer,
      addressNFT: addressToNFTTransaction.addressNFT,
      idNFT: addressToNFTTransaction.idNFT,
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
      addressToNFTTransaction.addressToNFTtransfer,
      addressToNFTTransaction.addressNFT,
      addressToNFTTransaction.idNFT,
    ],
  });

  const {
    isSuccess: isCreateNFTTransactionProposal,
    isLoading: isCreateNFTTransactionProposalLoading,
    data: dataProposalNFTTransaction,
    error: errorNFTTransaction,
    write: writeForNFTTransaction,
  } = useContractWrite(configNFTTransaction);

  function onSubmitNFTtransaction() {
    if (!writeForNFTTransaction) return;
    writeForNFTTransaction();
  }


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
                      setAddressToNFTTransaction((addressToNFTTransaction) => ({
                        ...addressToNFTTransaction,
                        addressToNFTtransfer: e.target.value,
                      }))
                    }
                    value={addressToNFTTransaction.addressToNFTtransfer}
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
                      setAddressToNFTTransaction((addressToNFTTransaction) => ({
                        ...addressToNFTTransaction,
                        addressNFT: e.target.value,
                      }))
                    }
                    value={addressToNFTTransaction.addressNFT}
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
                      setAddressToNFTTransaction((addressToNFTTransaction) => ({
                        ...addressToNFTTransaction,
                        idNFT: e.target.value,
                      }))
                    }
                    value={addressToNFTTransaction.idNFT}
                    placeholder="id NFT send"
                  />
                </div>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitNFTtransaction)}
                    disabled={isCreateNFTTransactionProposalLoading || isCreateNFTTransactionProposal}
                    data-create-loading={isCreateNFTTransactionProposalLoading}
                    data-create-started={isCreateNFTTransactionProposal}
                  >
                    Send
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