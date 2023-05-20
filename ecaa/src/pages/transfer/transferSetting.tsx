import { TokenTransaction } from "../proposals/proposal-transferERC20";
import { NFTTransaction } from "../proposals/proposal-transferERC721";
import { TransactionProposal } from "../proposals/proposal-transfer";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useBalance } from "wagmi";
import { useParams } from "react-router-dom";

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
};

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

  const {
    data: addressBalance,
    isError: balanceError,
    isLoading: balanceLoading,
  } = useBalance({
    address: address as `0x${string}`,
  });

  const {
    data: addressBalanceErc20,
    isError: balanceErrorErc20,
    isLoading: balanceLoadingErc20,
  } = useBalance({
    address: addressERC20 as `0x${string}`,
  });

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
              <h1>Balance SmartContract Coin</h1>
              <div>
                <h4>Multisig Wallet Balance:</h4>
                <h1>{addressBalance?.value.toString()} MATIC</h1>
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
            <h1>Balance SmartContract ERC20</h1>
              <div>
                <h4>Multisig Wallet Balance ERC20:</h4>
                <h1>{addressBalanceErc20?.value.toString()} {addressBalanceErc20?.symbol}</h1>
              </div>
              <form>
                <input
                  type="text"
                  className="input form-control"
                  id="AddressERC20"
                  placeholder="Address ERC20"
                  {...register("addressERC20", {
                    required: { value: true, message: "Field required" },
                  })}
                  onChange={(e) => setAddressERC20(e.target.value)}
                  
                  value={addressERC20}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit(onSubmitAddressERC20)}
                >
                  Submit
                </button>
              </form>

              <h2>Transfer ERC20</h2>
              <TokenTransaction
                addressToTokentransfer={""}
                addressToken={""}
                amountToken={""}
              />
            </>
          )}
        </div>

      )}
      {watchType && (
        <div className="row">
          {watchType.toString() === "erc721" && (
            <>
            <form>
                <input
                  type="AddressERC721"
                  className="input form-control"
                  id="AddressERC721"
                  placeholder="Address ERC721"
                  {...register("addressERC721", {
                    required: { value: true, message: "Field required" },
                  })}
                  onChange={(e) => setAddressERC721(e.target.value)}
                  value={addressERC721}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit(onSubmitAddressERC721)}
                >
                  Submit
                </button>

              </form>
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
