import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type PTransactionProposal = {
    addressTo: string;
    amount: string;
  };

export const TransactionProposal = (props: PTransactionProposal) => {  

const location = useLocation();
const selectedAddress = location.state?.selectedAddress || "";
const params = useParams();
const myAddress = params.address as `0x${string}`;
const navigate = useNavigate();

const contractAddress = myAddress; 
const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
  alchemyApiKey
); 
 
    
      //Proposal Transaction 0
      const [transactionProposal, setTransactionProposal] =
        useState<PTransactionProposal>({
          addressTo: "",
          amount: "0" || null ,
        });
    
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
      const {
        register,
        handleSubmit,
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
        args: [transactionProposal.addressTo, ethers.utils.parseUnits(transactionProposal.amount || "0")],
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

      //reload and navigate to wallet page

      const [isExecuted, setIsExecuted] = useState(false);

      useEffect(() => {
        let timerId: NodeJS.Timeout;
      
        if (isCreateStartedTransaction) {
          timerId = setTimeout(() => {
            setIsExecuted(true);
          }, 5000); 
        }
      
        return () => {
          clearTimeout(timerId);
        };
      }, [isCreateStartedTransaction]);
      
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
                      <label className="queryInput" htmlFor="owners">
                        Insert receiving address:
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
                        placeholder="receiving address"
                      />
                    </div>
    
                    <div className="row">
                      <label className="queryInput" htmlFor="valueTransaction">
                        Insert the amount of matic to send:
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
                        placeholder="amount"
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
                    {isCreateStartedTransaction && "Waiting for approval"}
                    {isCreateLoadingTransaction && "Executing..."}
                    {!isCreateLoadingTransaction && !isCreateStartedTransaction && "Send"}
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
                    
                
    