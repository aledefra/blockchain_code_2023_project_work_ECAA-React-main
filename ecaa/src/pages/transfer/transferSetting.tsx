import { TokenTransaction } from "../proposals/proposal-transferERC20";
import { NFTTransaction } from "../proposals/proposal-transferERC721";
import { TransactionProposal } from "../proposals/proposal-transfer";
import { useForm } from "react-hook-form";
import { useBalance, useContractRead, useToken } from "wagmi";
import { useParams } from "react-router-dom";
import { contractAbiERC20 } from "../../contractABIs/ERC20prova";
import { contractAbiERC721 } from "../../contractABIs/ERC721prova";



type PAddressERC20 = {
  addressERC20: string;
};
type PAddressERC721 = {
  addressERC721: string;
};


const contractERC20 = "0x8918a904A7967871AbC20653ABDFd3a002C9eF74";
const contractERC721= "0x6aDF43B861ab54D5C45bC1EEB80929b5B8d0C0E9";

export const TransferSetting = () => {
  const params = useParams();
  const address = params.address;
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      Asset: "",
    },
  });
  const {
    data: addressBalance,
    isError: balanceError,
    isLoading: balanceLoading,
  } = useBalance({
    address: address as `0x${string}`,
  });

  console.log("addressBalance", addressBalance?.formatted.toString());

  const watchType = watch("Asset");

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
           <div>
            <h4>
              Multisig Wallet Balance: {addressBalance?.formatted.toString()} matic
            </h4>
          </div>
          <h2>Transfer some Matic</h2>
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
            addressToken={""}
            amountToken={""}
          />
        </>
      )}
      {watchType.toString() === "newErc20" && (
        <>
          <div>
            <h2>Transfer some Tokens</h2>
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