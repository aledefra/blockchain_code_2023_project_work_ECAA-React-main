import { TokenTransaction } from "../proposals/proposal-transferERC20";
import { NFTTransaction } from "../proposals/proposal-transferERC721";
import { TransactionProposal } from "../proposals/proposal-transfer";
import { useForm } from "react-hook-form";
import { useBalance } from "wagmi";
import { useParams } from "react-router-dom";
import { TokenSavedTransaction } from "../proposals/proposal-tokenSaved";


export const TransferSetting = () => {
  const params = useParams();
  const address = params.address;
  const {
    register,
    watch,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      Asset: "",
    },

  });
  const {
    data: addressBalance,
  } = useBalance({
    address: address as `0x${string}`,
  });

  console.log("addressBalance", addressBalance?.formatted.toString());

  const watchType = watch("Asset");
        
  return (
    <div>
      <div className="row">
        <select
          className="form-select form-select-lg mb-3"
          aria-label=".form-select-lg example"
          {...register("Asset", {
            required: { value: true, message: "Field required" },
          })}
        >
          <option value="">Choose Assets</option>
          <option value="token">Token</option>
          <option value="nft">NFT</option>
        </select>
      </div>

      {watchType && (
        <div className="row">
          {watchType.toString() === "token" && (
            <>
              <div className="row">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                  {...register("Asset", {
                    required: { value: true, message: "Field required" },
                  })}
                >
                  <option value="">Choose Token</option>
                  <option value="matic">Matic</option>
                  <option value="newErc20">New Token</option>
                  <option value="savedToked">My Token</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {watchType.toString() === "matic" && (
        <>
           <div>
            <h4>
              Multisig Wallet Balance: {addressBalance?.formatted.toString()} matic
            </h4>
          </div>
          <h2>Transfer some Matic</h2>
          <TransactionProposal addressTo={""} amount={""} />
        </>
      )}
   
      {watchType.toString() === "newErc20" && (
        <>
          <div>
            <h2>Transfer some Tokens</h2>
            <TokenTransaction 
            
            />              
            
          </div>
        </>
      )}

       {watchType.toString() === "savedToked" && (
        <>
        <div>  
          <TokenSavedTransaction 
          />
     
      </div>
        </>
      )}
      
      {watchType && (
        <div className="row">
          {watchType.toString() === "nft" && (
            <>
              <h2>Transfer an NFT</h2>
              <NFTTransaction
                addressToNFTtransfer={""}
                addressNFT={""}
                idNFT={""}
              />
            </>
          )}
        </div>
      )}
      
    </div>
  );
};