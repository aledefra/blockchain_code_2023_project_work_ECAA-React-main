import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useLocation, useParams } from "react-router-dom";
import { _alchemyKey } from "../../utils/key";

type PTransactionProposal = {
    addressTo: string;
    amount: string;
  };

export const TransactionProposal = (props: PTransactionProposal) => {  

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
 
    
      //Proposal Transaction 0
      const [transactionProposal, setTransactionProposal] =
        useState<PTransactionProposal>({
          addressTo: "",
          amount: "",
        });
    
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
          addressTo: transactionProposal.addressTo,
          amount: transactionProposal.amount,
        },
      });
    
    
     //Propose Transaction 0
    
      const {
        config: configTransaction,
        error: prepareErrorTransaction,
        isError: isPrepareErrorTransaction,
      } = usePrepareContractWrite({
        address: myAddress,
        abi: contractAbi,
        functionName: "proposeTransaction",
        args: [transactionProposal.addressTo, parseInt(transactionProposal.amount)],
      });
    
      const {
        isSuccess: isCreateStartedTransaction,
        isLoading: isCreateLoadingTransaction,
        data: dataTransaction,
        error,
        write: writeTransaction,
      } = useContractWrite(configTransaction);
    
      function onSubmitTransaction() {
        if (!writeTransaction) return;
        writeTransaction();
      }
    
    
    return (
        
    <form>
                    <div className="row">
                      <label className="queryInput" htmlFor="owners">
                        Insert addressTo:
                      </label>
    
                      <input
                        className="ProposalType form-control"
                        id="Transaction"
                        {...register("addressTo", {
                          required: { value: true, message: "Field required" },
                        })}
                        onChange={(e) =>
                          setTransactionProposal((transactionProposal) => ({
                            ...transactionProposal,
                            addressTo: e.target.value,
                          }))
                        }
                        value={transactionProposal.addressTo}
                        placeholder="Transaction"
                      />
                    </div>
    
                    <div className="row">
                      <label className="queryInput" htmlFor="valueTransaction">
                        Insert value Transaction:
                      </label>
    
                      <input
                        className="input form-control"
                        id="valueTransaction"
                        {...register("amount", {
                          required: { value: true, message: "Field required" },
                        })}
                        onChange={(e) =>
                          setTransactionProposal((transactionProposal) => ({
                            ...transactionProposal,
                            amount: e.target.value,
                          }))
                        }
                        value={transactionProposal.amount}
                        placeholder="value-transaction"
                      />
                    </div>
    
                    <div>
                      <button
                        className="btn btn-primary mt-2"
                        type="submit"
                        onClick={handleSubmit(onSubmitTransaction)}
                        disabled={isCreateLoadingTransaction || isCreateStartedTransaction}
                        data-create-loading={isCreateLoadingTransaction}
                        data-create-started={isCreateStartedTransaction}
                      >
                        Send
                      </button>
                    </div>
    
                    {(isPrepareErrorTransaction || error) && (
                      <div>
                        Error: {(prepareErrorTransaction || error)?.message}
                      </div>
                  )}
                  </form>
            )
};     
                    
                
    