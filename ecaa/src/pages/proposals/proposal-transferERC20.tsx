import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useLocation, useParams } from "react-router-dom";
import { _alchemyKey } from "../../utils/key";

  type PTokenTransactionProposal = {
    addressToTokentransfer: string;
    addressToken: string;
    amountToken: string;
  };

export const TokenTransaction = (props: PTokenTransactionProposal) => {

  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress || "";
  const params = useParams();
  const myAddress = params.address as `0x${string}`;

const contractAddress = myAddress; 
const alchemyApiKey = _alchemyKey;
const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
  alchemyApiKey
); 

const contract = new ethers.Contract(contractAddress, contractAbi, provider);

     //Propose token transaction 6

  const [tokenTransaction, setTokenTransaction] =
    useState<PTokenTransactionProposal>({
      addressToTokentransfer: "",
      addressToken: "",
      amountToken: "",
    });

const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      addressToTokentransfer: tokenTransaction.addressToTokentransfer,
      addressToken: tokenTransaction.addressToken,
      amountToken: tokenTransaction.amountToken,
    },
  });


//Propose Token Transaction 6
  const {
    config: configTokenTransaction,
    error: prepareErrorTokenTransaction,
    isError: isPrepareErrorTokenTransaction,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeTokenTransaction",
    args: [
      tokenTransaction.addressToTokentransfer,
      tokenTransaction.addressToken,
      tokenTransaction.amountToken,
    ],
  });

  const {
    isSuccess: isCreateTokenTransactionProposal,
    isLoading: isCreateTokenTransactionProposalLoading,
    data: dataProposalTokenTransaction,
    error: errorTokenTransaction,
    write: writeForTokenTransaction,
  } = useContractWrite(configTokenTransaction);

  function onSubmitTokenTransaction() {
    if (!writeForTokenTransaction) return;
    writeForTokenTransaction();
  }



return (

                <form>
                <div className="row">
                  <label className="queryInput" htmlFor="TokenTransaction">
                    Insert recive address ERC-20 token:
                  </label>

                  <input
                    className="ProposalType form-control"
                    id="TokenTransaction"
                    {...register("addressToTokentransfer", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setTokenTransaction((tokenTransaction) => ({
                        ...tokenTransaction,
                        addressToTokentransfer: e.target.value,
                      }))
                    }
                    value={tokenTransaction.addressToTokentransfer}
                    placeholder="address to send token"
                  />
                </div>
                <div className="row">
                  <label className="queryInput" htmlFor="TokenTransaction">
                    Insert token ERC-20 contract address:
                  </label>

                  <input
                    className="input form-control"
                    id="TokenTransaction"
                    {...register("addressToken", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setTokenTransaction((tokenTransaction) => ({
                        ...tokenTransaction,
                        addressToken: e.target.value,
                      }))
                    }
                    value={tokenTransaction.addressToken}
                    placeholder="contract address token"
                  />
                </div>

                <div className="row">
                  <label className="queryInput" htmlFor="TokenTransaction">
                    Insert send amount:
                  </label>

                  <input
                    className="input form-control"
                    id="TokenTransaction"
                    {...register("amountToken", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setTokenTransaction((tokenTransaction) => ({
                        ...tokenTransaction,
                        amountToken: e.target.value,
                      }))
                    }
                    value={tokenTransaction.amountToken}
                    placeholder="amount token send"
                  />
                </div>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitTokenTransaction)}
                    disabled={isCreateTokenTransactionProposalLoading || isCreateTokenTransactionProposal}
                    data-create-loading={isCreateTokenTransactionProposalLoading}
                    data-create-started={isCreateTokenTransactionProposal}
                  >
                    Send
                  </button>
                </div>

                {(isPrepareErrorTokenTransaction || errorTokenTransaction) && (
                  <div>
                    Error: {(prepareErrorTokenTransaction || errorTokenTransaction)?.message}
                  </div>
                )}
              </form>

)

}