import { useForm } from "react-hook-form";
import { IProposalType } from "../../model/proposalType-model";
import { useLocation, useParams } from "react-router-dom";
import { TransactionProposal } from "./proposal-transfer";
import { NewOwner } from "./proposal-newOwner";
import { RemoveOwner } from "./proposal-removeOwner";
import { ChangeTreshold } from "./proposal-changeTreshold";
import { ChangeNumConfirmations } from "./proposal-numConfirm";
import { ChangeOwner } from "./proposal-changeOwner";
import { TokenTransaction } from "./proposal-transferERC20";
import { NFTTransaction } from "./proposal-transferERC721";

export const CreateProposal = (props: IProposalType) => {
  
  type PChooseTypeProposal = {
    type: number;
  };



  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress || "";
  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  console.log("questo è l'address da dove arrivo:", myAddress);

  //const contractAddress: string = defaultInitialize.newWalletAddress;
  const contractAddress = selectedAddress;
  console.log("questo è il contract address", contractAddress.toString());
  console.log("questo è il selected address", selectedAddress.toString());

  const chooseType : PChooseTypeProposal = {
    type: 0 || 1 || 2 || 3 || 4 || 5 || 6 || 7,
  };

   const {
    register,
    watch,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      chooseType: chooseType.type,
    
    },
  });

  const watchType = watch("chooseType");


  return (
    <div className="createProposal">
      <h1>Create Proposals</h1>

      <div className="row">
        <label className="queryInput" htmlFor="select">
          Choose the type:
        </label>

        <select
          className="selector form-control"
          {...register("chooseType", {
            required: { value: true, message: "Field required" },
          })}
        >
          <option value="">Type</option>
          <option value="Transaction">Transaction</option>
          <option value="NewOwner">New Owner</option>
          <option value="RemoveOwner">Remove Owner</option>
          <option value="ChangeTreshold">ChangeTreshold</option>
          <option value="ChangeNumConfirmations">Change Num Confirmations</option>
          <option value="ChangeOwner">Change Owner</option>
          <option value="TokenTransaction">Token ERC20 transaction</option>
          <option value="NFTTransaction">NFT transaction</option>
        </select>
      </div>

      {watchType && (
        <div className="row">
          {watchType.toString() === "Transaction" && (
            <>
            <TransactionProposal addressTo={""} amount={""}/>
            </>
          )}
        </div>
      )}
        
      {watchType && (
        <div className="row">
          {watchType.toString() === "NewOwner" && (
            <>
              <NewOwner newOwner={""} />
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "RemoveOwner" && (
            <>
             <RemoveOwner removeOwner={""} />
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "ChangeTreshold" && (
            <>
              <ChangeTreshold treshold={""} />
            </>
          )}
        </div>
      )}

{watchType && (
        <div className="row">
          {watchType.toString() === "ChangeNumConfirmations" && (
            <>
              <ChangeNumConfirmations numConfirmations={""} />
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "ChangeOwner" && (
            <>
              <ChangeOwner addressOldOwner={""} addressNewOwnerChanged={""} />
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "TokenTransaction" && (
            <>
              <TokenTransaction addressToTokentransfer={""} addressToken={""} amountToken={""} />
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "NFTTransaction" && (
            <>
              <NFTTransaction addressToNFTtransfer={""} addressNFT={""} idNFT={""} />
            </>
          )}
        </div>
      )}
    </div>
  );
};
