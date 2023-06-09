import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite, useToken } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useLocation, useNavigate, useParams } from "react-router-dom";



  

export const TokenTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress || "";
  const params = useParams();
  const myAddress = params.address as `0x${string}`;

const contractAddress = myAddress; 
const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
  alchemyApiKey
); 

const contract = new ethers.Contract(contractAddress, contractAbi, provider);

     //Propose token transaction 6

  

    const [addressToTokentransfer, setAddressToTokentransfer] = useState("");
    const [addressToken, setAddressToken] = useState("");
    const [amountToken, setAmountToken] = useState("0" || null);

const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      addressToTokentransfer: addressToTokentransfer,
      addressToken: addressToken,
      amountToken: amountToken,
    },
  });

const { data: dataToken } = useToken({
  address: addressToken as `0x${string}`,
  chainId: 137,
});

console.log("DECIMALS",dataToken?.decimals);
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
      addressToTokentransfer,
      addressToken,
      ethers.utils.parseUnits(
        amountToken?.toString() || "0",
        dataToken?.decimals.toString() 
      ),
    ],
    //ethers.utils.parseUnits(amountToken.toString(),dataToken?.decimals.toString()).toString(),
  });
  

  
  

  console.log(dataToken);

  const {
    isSuccess: isStartedCreateTokenTransactionProposal,
    isLoading: isCreateTokenTransactionProposalLoading,
    data: dataProposalTokenTransaction,
    error: errorTokenTransaction,
    write: writeForTokenTransaction,
  } = useContractWrite(configTokenTransaction);

  function onSubmitTokenTransaction() {
    if (!writeForTokenTransaction) return;
    writeForTokenTransaction();

    if (addressToken) {
      const savedNewToken = JSON.parse(
        localStorage.getItem("token") || "[]"
      );
      const newToken = { address: addressToken, name: dataToken?.name};
      localStorage.setItem("token", JSON.stringify([...savedNewToken, newToken]));

      newToken.address = addressToken;
      
      
    }
  }
  
  
//reload and navigate to wallet page

const [isExecuted, setIsExecuted] = useState(false);

useEffect(() => {
  let timerId: NodeJS.Timeout;

  if (isStartedCreateTokenTransactionProposal) {
    timerId = setTimeout(() => {
      setIsExecuted(true);
    }, 5000); 
  }

  return () => {
    clearTimeout(timerId);
  };
}, [isStartedCreateTokenTransactionProposal]);

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
                  <label className="queryInput" htmlFor="TokenTransaction">
                    Insert receiving address for the ERC-20 token:
                  </label>

                  <input
                    className="ProposalType form-control"
                    id="TokenTransaction"
                    {...register("addressToTokentransfer", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setAddressToTokentransfer(e.target.value) 
                    }
                    value={addressToTokentransfer}
                    placeholder="address to send token"
                  />
                </div>
                <div className="row">
                  <label className="queryInput" htmlFor="TokenTransaction">
                    Insert ERC-20 contract address:
                  </label>

                  <input
                    className="input form-control"
                    id="TokenTransaction"
                    {...register("addressToken", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setAddressToken(e.target.value)    
                    }
                    value={addressToken}
                    placeholder="contract address token"
                  />
                </div>

                <div className="row">
                  <label className="queryInput" htmlFor="TokenTransaction">
                    Insert the amount to send:
                  </label>

                  <input
                    className="input form-control"
                    id="TokenTransaction"
                    {...register("amountToken", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setAmountToken(e.target.value)
                    }
                    value={amountToken}
                    placeholder="amount token send"
                  />
                </div>
                
                <div className="row">
                  <label className="queryInput" htmlFor="TokenTransaction">
                    View name token:
                  </label>
                  
                    {dataToken?.name}
                    </div>
                    
                  

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitTokenTransaction)}
                    disabled={isCreateTokenTransactionProposalLoading || isStartedCreateTokenTransactionProposal}
                    data-create-loading={isCreateTokenTransactionProposalLoading}
                    data-create-started={isStartedCreateTokenTransactionProposal}
                  >
                    {isStartedCreateTokenTransactionProposal && "Waiting for approval"}
                    {isCreateTokenTransactionProposalLoading && "Executing..."}
                    {!isCreateTokenTransactionProposalLoading && !isStartedCreateTokenTransactionProposal && "Send"}
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