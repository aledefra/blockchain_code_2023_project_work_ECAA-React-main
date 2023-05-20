import { TokenTransaction } from "../proposals/proposal-transferERC20";
import { NFTTransaction } from "../proposals/proposal-transferERC721";
import { TransactionProposal } from "../proposals/proposal-transfer";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ConnectorAlreadyConnectedError, useBalance, useContractRead, useToken } from "wagmi";
import { useParams } from "react-router-dom";
import { contractAbiERC20 } from "../../contractABIs/ERC20prova";
import { contractAbiERC721 } from "../../contractABIs/ERC721prova";
import { IProposal } from "../../model/proposalType-model";


type PAddressERC20 = {
  addressERC20: string;
};
type PAddressERC721 = {
  addressERC721: string;
};

type PChooseTransfer = {
  coin: string;
  erc20: string;
  erc721: string;
  eth: string;
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
      chooseTransaction: "",
      addressERC20: "",
      addressERC721: "",
    },
  });
  const watchType = watch("chooseTransaction");

  const [addressERC20, setAddressERC20] = useState("");
  

  const [addressERC721, setAddressERC721] = useState("");

  //ERC20 Balance
  const { data: balanceMyContract, isFetched } = useContractRead({
    address: contractERC20,
    abi: contractAbiERC20,
    functionName: "balanceOf",
    args: [address],
    
  });
 
  //ERC20
    const { data, isError, isLoading } = useToken({
      address: contractERC20,
      chainId: 137,
    })
   
    const nameERC20 = data?.name;
    const symbolERC20 = data?.symbol;
    const decimalsERC20 = data?.decimals;
    const totalSupplyERC20 = data?.totalSupply;



  //ERC721 Balance
  const { 
    data: balanceMyContractERC721, 
    isFetched: isFetchedERC721 } = useContractRead({
    address: contractERC721,
    abi: contractAbiERC721,
    functionName: "balanceOf",
    args: [address],

  });
 
  //ERC721
  const { 
    data : dataNft, 
    isError : isErrorNFT, 
    isLoading : isLoadingNFT
   } = useToken({
    address: contractERC721,
    chainId: 137,

  })
  console.log("questo è dataNft:", dataNft?.name)
  console.log("questo è dataNft:", dataNft?.symbol)
  console.log("questo è dataNft:", dataNft?.decimals)
  console.log("questo è il balance del contratto ERC721:", balanceMyContractERC721?.toString());
  
  console.log("questo è il nome del token:", nameERC20)
  console.log("address da ricercare:",address)
  console.log("questo è il contratto:", contractERC20)
  console.log("questo è balance:", balanceMyContract?.toString());

  //console.log("questo è abi:", contractAbiERC20)



  const onSubmitAddressERC20 = (data: PAddressERC20) => {
    console.log(data);
    console.log("questo è l'address del ERC20", data.addressERC20);
  };
  const onSubmitAddressERC721 = (data: PAddressERC721) => {
    console.log("questo è l'address del NFT", data.addressERC721);
  };

  return (
    <div>
      <div className="row">
        <select
          className="selector form-control"
          {...register("chooseTransaction", {
            required: { value: true, message: "Field required" },
          })}
        >
          <option value="">Choose Asset</option>
          <option value="coin">Coin</option>
          <option value="erc20">ERC20</option>
          <option value="erc721">ERC721</option>
        </select>
      </div>
  
      {watchType && (
        <div className="row">
          {watchType.toString() === "coin" && (
            <>
              <div className="row">
                <select
                  className="selector form-control"
                  {...register("chooseTransaction", {
                    required: { value: true, message: "Field required" },
                  })}
                >
                  <option value="">Choose Asset</option>
                  <option value="matic">Matic</option>
                  <option value="eth">ETH</option>
                </select>
              </div> 
          </> 
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
              {watchType.toString() === "eth" && (
                <>
                <h1>Balance SmartContract Coin</h1>
              <div>
                <h4>Multisig Wallet Balance:</h4>
              </div>
              <h2>Transfer Coin</h2>
              <TransactionProposal addressTo={""} amount={""} />
            </>
              )}
        </div>
      
        

      )}
  
      {watchType && (
        <div className="row">
          {watchType.toString() === "erc20" && (
            <>
              <div className="row">
                <select
                  className="selector form-control"
                  {...register("chooseTransaction", {
                    required: { value: true, message: "Field required" },
                  })}
                >
                  <option value="">Choose Asset</option>
                  <option value="erc20Save">{nameERC20}</option>
                  <option value="newErc20">NEW</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}
      {watchType.toString() === "erc20Save" && (
        <>
          <h1>Balance SmartContract ERC20</h1>
          <div>
            <h4>Multisig Wallet Balance ERC20:</h4>
          </div>
  
          <h1>MYERC20</h1>
          <div>
            <h2>Name : {nameERC20}</h2>
            <h2>Symbol : {symbolERC20}</h2>
            <h2>Decimals : {decimalsERC20}</h2>
          </div>
          <h2>Transfer ERC20</h2>
          <TokenTransaction
            addressToTokentransfer={""}
            addressToken={addressERC20}
            amountToken={""}
          />
        </>
      )}
      {watchType.toString() === "newErc20" && (
        <>
    <div>
      <h2>Transfer ERC20</h2>
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
          {watchType.toString() === "erc721" && (
            <>
              <h2>Transfer ERC721</h2>
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