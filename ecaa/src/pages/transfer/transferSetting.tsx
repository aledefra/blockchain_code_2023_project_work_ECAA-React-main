import { TokenTransaction } from "../proposals/proposal-transferERC20";
import { NFTTransaction } from "../proposals/proposal-transferERC721";
import { TransactionProposal } from "../proposals/proposal-transfer";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useContractRead, useToken } from "wagmi";
import { useParams } from "react-router-dom";
import { contractAbiERC20 } from "../../contractABIs/ERC20prova";
import { contractAbiERC721 } from "../../contractABIs/ERC721prova";
import { ProposalCard } from "../../components/proposal-card";


type PAddressERC20 = {
  addressERC20: string;
};
type PAddressERC721 = {
  addressERC721: string;
};

type PAsset = {
  Asset: "Asset";
  token: "token";
  nft: "nft";
  
};


const contractERC20 = "0x8918a904A7967871AbC20653ABDFd3a002C9eF74";
const contractERC721= "0x6aDF43B861ab54D5C45bC1EEB80929b5B8d0C0E9";

export const TransferSetting = () => {
  const params = useParams();
  const address = params.address;
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      Asset: "",
    },
  });

  const watchType = watch("Asset");


  const [asset,setAsset] = useState<PAsset>({
    Asset: "Asset",
    token: "token",
    nft: "nft",
  });

  

  //ERC20 Balance ??
  const { data: balanceMyContract, isFetched } = useContractRead({
    address: contractERC20,
    abi: contractAbiERC20,
    functionName: "balanceOf",
    args: [address],
    
  });
 
  //ERC20 Token
    const { data, isError, isLoading } = useToken({
      address: contractERC20,
      chainId: 137,
    })
   
    const nameERC20 = data?.name;
    const symbolERC20 = data?.symbol;
    const decimalsERC20 = data?.decimals;


  //ERC721 Balance ??
  const { 
    data: balanceMyContractERC721, 
    isFetched: isFetchedERC721 } = useContractRead({
    address: contractERC721,
    abi: contractAbiERC721,
    functionName: "balanceOf",
    args: [address],

  });
 

  return (
    <div>
      <div className="row">
        <select
          className="selector form-control"
          {...register("Asset", {
            required: { value: true, message: "Field required" },
            
          })}
        >
          <option value="Assets">Choose Assets</option>
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
                  className="selector form-control"
                  {...register("Asset", {
                    required: { value: true, message: "Field required" },
                  })}
                >
                  <option value="Assets">Choose Asset</option>
                  <option value="matic">Matic</option>
                  <option value="savedToked">{nameERC20}</option>
                  <option value="newErc20">New Token</option>
                </select>
              </div> 
          </> 
          )}
            </div>
      )}
          
              {watchType.toString() === "matic" && (
                <>
                <h1>Balance SmartContract Coin</h1>
              <div>
                <h4>Multisig Wallet Balance:</h4>
              </div>
              <h2>Transfer Coin</h2>
              <TransactionProposal addressTo={""} amount={""} />
            </>
              )}

                 
  
      {watchType.toString() === "savedToked" && (
        <>         
          <div>
            <h2>Name : {nameERC20}</h2>
            <h2>Symbol : {symbolERC20}</h2>
            <h2>Decimals : {decimalsERC20}</h2>
          </div>
          <h2>Transfer Token</h2>
          <TokenTransaction
            addressToTokentransfer={""}
            addressToken = {contractERC20}
            amountToken={""}
          />
        </>
      )}
      {watchType.toString() === "newErc20" && (
        <>
    <div>
      <h2>Transfer Token</h2>
      <TokenTransaction
        addressToTokentransfer={""}
        addressToken={""}
        amountToken={""}
      />
    </div>
        </>
      )}
       
      {watchType && (
        <div className="row">
          {watchType.toString() === "nft" && (
            <>
              <h2>Transfer NFT</h2>
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