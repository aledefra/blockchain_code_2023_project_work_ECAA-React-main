import { useEffect, useState } from "react";
import { contractAbi } from "../../contractABIs/multisigABI";
import { defaultInitialize } from "../../utils/createWallet";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useForm } from "react-hook-form";
import { IProposalType } from "../../model/proposalType-model";
import { useLocation, useParams } from "react-router-dom";

export const CreateProposal = (props: IProposalType) => {
  type PCreateProposal = {
    defaultValues: IProposalType;
  };
  type PChooseTypeProposal = {
    type: number;
  };

  type PTransactionProposal = {
    addressTo: string;
    amount: string;
  };

  type PNewOwnerProposal = {
    newOwner: string;
  };
  type PRemoveOwnerProposal = {
    removeOwner: string;
  };
  type PChangeTresholdProposal = {
    treshold: string;
  };

  type PChangeOwnersProposal = {
    addressOldOwner: string;
    addressNewOwnerChanged: string;
  };
  type PTokenTransactionProposal = {
    addressToTokentransfer: string;
    addressToken: string;
    amountToken: string;
  };
  type PNFTTransactionProposal = {
    addressToNFTtransfer: string;
    addressNFT: string;
    idNFT: string;
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

  const [chooseType, setChoseType] = useState<PChooseTypeProposal>({
    type: 0 || 1 || 2 || 3 || 4 || 5 || 6,
  });

  //Proposal Transaction 0
  const [transactionProposal, setTransactionProposal] =
    useState<PTransactionProposal>({
      addressTo: "",
      amount: "",
    });

  //Proposal New Owner 1

  const [newOwner, setNewOwner] = useState<PNewOwnerProposal>({
    newOwner: "",
  });

  //Proposal Remove Owner 2

  const [removeOwner, setRemoveOwner] = useState<PRemoveOwnerProposal>({
    removeOwner: "",
  });

  //Proposal Change Treshold 3

  const [treshold, setTreshold] = useState<PChangeTresholdProposal>({
    treshold: "",
  });

  //Proposal Change Owner

  const [changeOwnerProposal, setOwnerProposal] =
    useState<PChangeOwnersProposal>({
      addressOldOwner: "",
      addressNewOwnerChanged: "",
    });

  //Propose token transaction

  const [tokenTransaction, setTokenTransaction] =
    useState<PTokenTransactionProposal>({
      addressToTokentransfer: "",
      addressToken: "",
      amountToken: "",
    });

  //Propose NFT transaction

  const [addressToNFTTransaction, setAddressToNFTTransaction] =
    useState<PNFTTransactionProposal>({
      addressToNFTtransfer: "",
      addressNFT: "",
      idNFT: "",
    });

  //chiavi alchemy
  const alchemyApiKey = "z8b0aKqHNwhW3rp7JdoPv1_dUrOAW1dI";
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    alchemyApiKey
  );
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
      chooseType: chooseType.type,
      addressTo: transactionProposal.addressTo,
      amount: transactionProposal.amount,
      newOwner: newOwner.newOwner,
      removeOwner: removeOwner.removeOwner,
      treshold: treshold.treshold,
      addressOldOwner: changeOwnerProposal.addressOldOwner,
      addressNewOwnerChanged: changeOwnerProposal.addressNewOwnerChanged,
      addressToTokentransfer: tokenTransaction.addressToTokentransfer,
      addressToken: tokenTransaction.addressToken,
      amountToken: tokenTransaction.amountToken,
      addressToNFTtransfer: addressToNFTTransaction.addressToNFTtransfer,
      addressNFT: addressToNFTTransaction.addressNFT,
      idNFT: addressToNFTTransaction.idNFT,
    },
  });

  const watchType = watch("chooseType");

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
    isSuccess: isCreateStarted,
    isLoading: isCreateLoading,
    data: dataTransaction,
    error,
    write: writeTransaction,
  } = useContractWrite(configTransaction);

  function onSubmitTransaction() {
    if (!writeTransaction) return;
    writeTransaction();
  }

  //Propose New Owner 1
  const {
    config: configNewOwner,
    error: prepareErrorNewOwner,
    isError: isPrepareErrorNewOwner,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeNewOwner",
    args: [newOwner.newOwner],
  });

  const {
    isSuccess: isCreateNewOwnerProposal,
    isLoading: isCreateNewOwnerProposalLoading,
    data: dataProposalNewOwner,
    error: errorNewOwner,
    write: writeForNewOwner,
  } = useContractWrite(configNewOwner);

  function onSubmitNewOwner() {
    if (!writeForNewOwner) return;
    writeForNewOwner();
  }

  //Propose Remove Owner 2
  const {
    config: configRemoveOwner,
    error: prepareErrorRemoveOwner,
    isError: isPrepareErrorRemoveOwner,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeRemoveOwner",
    args: [removeOwner.removeOwner],
  });

  const {
    isSuccess: isCreateRemoveOwnerProposal,
    isLoading: isCreateRemoveOwnerProposalLoading,
    data: dataProposalRemoveOwner,
    error: errorRemoveOwner,
    write: writeForRemoveOwner,
  } = useContractWrite(configRemoveOwner);

  function onSubmitRemoveOwner() {
    if (!writeForRemoveOwner) return;
    writeForRemoveOwner();
  }

  //Propose Change Treshold 3
  const {
    config: configChangeTreshold,
    error: prepareErrorChangeTreshold,
    isError: isPrepareErrorChangeTreshold,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeChangeThreshold",
    args: [treshold.treshold],
  });

  const {
    isSuccess: isCreateChangeTresholdProposal,
    isLoading: isCreateChangeTresholdProposalLoading,
    data: dataProposalChangeTreshold,
    error: errorChangeTreshold,
    write: writeForChangeTreshold,
  } = useContractWrite(configChangeTreshold);

  function onSubmitChangeTreshold() {
    if (!writeForChangeTreshold) return;
    writeForChangeTreshold();
  }

  //Propose Change Owner 4
  const {
    config: configChangeOwner,
    error: prepareErrorChangeOwner,
    isError: isPrepareErrorChangeOwner,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeChangeOwner",
    args: [
      changeOwnerProposal.addressOldOwner,
      changeOwnerProposal.addressNewOwnerChanged,
    ],
  });

  const {
    isSuccess: isCreateChangeOwnerProposal,
    isLoading: isCreateChangeOwnerProposalLoading,
    data: dataProposalChangeOwner,
    error: errorChangeOwner,
    write: writeForChangeOwner,
  } = useContractWrite(configChangeOwner);

  function onSubmitChangeOwner() {
    if (!writeForChangeOwner) return;
    writeForChangeOwner();
  }

  console.log("aaaaaa")

  //Propose Token Transaction 5
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

  //Propose NFT Transaction 6
  const {
    config: configNFTTransaction,
    error: prepareErrorNFTTransaction,
    isError: isPrepareErrorNFTTransaction,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeNFTTransaction",
    args: [
      addressToNFTTransaction.addressToNFTtransfer,
      addressToNFTTransaction.addressNFT,
      addressToNFTTransaction.idNFT,
    ],
  });

  const {
    isSuccess: isCreateNFTTransactionProposal,
    isLoading: isCreateNFTTransactionProposalLoading,
    data: dataProposalNFTTransaction,
    error: errorNFTTransaction,
    write: writeForNFTTransaction,
  } = useContractWrite(configNFTTransaction);

  function onSubmitNFTtransaction() {
    if (!writeForNFTTransaction) return;
    writeForNFTTransaction();
  }

  return (
    <div className="createProposal">
      <h1>Create Proposals</h1>

      <p>Address nuovo contratto: {defaultInitialize.newWalletAddress}</p>

      <div className="row">
        <label className="queryInput" htmlFor="select">
          Choose the type:
        </label>

        <select
          className="selector"
          {...register("chooseType", {
            required: { value: true, message: "Field required" },
          })}
        >
          <option value="">Type</option>
          <option value="Transaction">Transaction</option>
          <option value="NewOwner">New Owner</option>
          <option value="RemoveOwner">Remove Owner</option>
          <option value="ChangeTreshold">ChangeTreshold</option>
          <option value="ChangeOwner">Change Owner</option>
          <option value="TokenTransaction">Token ERC20 transaction</option>
          <option value="NFTTransaction">NFT transaction</option>
        </select>
      </div>

      {watchType && (
        <div className="row">
          {watchType.toString() === "Transaction" && (
            <>
              <form>
                <div className="row">
                  <label className="queryInput" htmlFor="owners">
                    Insert addressTo:
                  </label>

                  <input
                    className="ProposalType"
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
                    className="input"
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
                    className="btn"
                    type="submit"
                    onClick={handleSubmit(onSubmitTransaction)}
                    disabled={isCreateLoading || isCreateStarted}
                    data-create-loading={isCreateLoading}
                    data-create-started={isCreateStarted}
                  >
                    sendProposalTransaction
                  </button>
                </div>

                {(isPrepareErrorTransaction || error) && (
                  <div>
                    Error: {(prepareErrorTransaction || error)?.message}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "NewOwner" && (
            <>
              <form>
                <div className="row">
                  <label className="queryInput" htmlFor="NewOwner">
                    Insert address new Owner:
                  </label>

                  <input
                    className="ProposalType"
                    id="NewOwner"
                    {...register("newOwner", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setNewOwner((newOwner) => ({
                        ...newOwner,
                        newOwner: e.target.value,
                      }))
                    }
                    value={newOwner.newOwner}
                    placeholder="new owner"
                  />
                </div>

                <div>
                  <button
                    className="btn"
                    type="submit"
                    onClick={handleSubmit(onSubmitNewOwner)}
                    disabled={isCreateLoading || isCreateStarted}
                    data-create-loading={isCreateLoading}
                    data-create-started={isCreateStarted}
                  >
                    sendProposalNewOwner
                  </button>
                </div>

                {(isPrepareErrorNewOwner || error) && (
                  <div>Error: {(prepareErrorNewOwner || error)?.message}</div>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "RemoveOwner" && (
            <>
              <form>
                <div className="row">
                  <label className="queryInput" htmlFor="Removeowner">
                    Insert address address to delete owner:
                  </label>

                  <input
                    className="ProposalType"
                    id="RemoveOwner"
                    {...register("removeOwner", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setRemoveOwner((removeOwner) => ({
                        ...removeOwner,
                        removeOwner: e.target.value,
                      }))
                    }
                    value={removeOwner.removeOwner}
                    placeholder="address to remove owner"
                  />
                </div>

                <div>
                  <button
                    className="btn"
                    type="submit"
                    onClick={handleSubmit(onSubmitRemoveOwner)}
                    disabled={isCreateLoading || isCreateStarted}
                    data-create-loading={isCreateLoading}
                    data-create-started={isCreateStarted}
                  >
                    sendProposalNewOwner
                  </button>
                </div>

                {(isPrepareErrorRemoveOwner || error) && (
                  <div>
                    Error: {(prepareErrorRemoveOwner || error)?.message}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "ChangeTreshold" && (
            <>
              <form>
                <div className="row">
                  <label className="queryInput" htmlFor="ChangeTreshold">
                    Insert number of new treshold:
                  </label>

                  <input
                    className="ProposalType"
                    id="ChangeTreshold"
                    {...register("treshold", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setTreshold((treshold) => ({
                        ...treshold,
                        treshold: e.target.value,
                      }))
                    }
                    value={treshold.treshold}
                    placeholder="number new treshold"
                  />
                </div>

                <div>
                  <button
                    className="btn"
                    type="submit"
                    onClick={handleSubmit(onSubmitChangeTreshold)}
                    disabled={isCreateLoading || isCreateStarted}
                    data-create-loading={isCreateLoading}
                    data-create-started={isCreateStarted}
                  >
                    send new Treshold
                  </button>
                </div>

                {(isPrepareErrorChangeTreshold || error) && (
                  <div>
                    Error: {(prepareErrorChangeTreshold || error)?.message}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "ChangeOwner" && (
            <>
              <form>
                <div className="row">
                  <label className="queryInput" htmlFor="ChangeOwner">
                    Insert old owner address
                  </label>

                  <input
                    className="ProposalType"
                    id="ChangeOwner"
                    {...register("addressOldOwner", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setOwnerProposal((changeOwnerProposal) => ({
                        ...changeOwnerProposal,
                        addressOldOwner: e.target.value,
                      }))
                    }
                    value={changeOwnerProposal.addressOldOwner}
                    placeholder="old owner address"
                  />
                </div>
                <div className="row">
                  <label className="queryInput" htmlFor="ChangeOwner">
                    Insert new owner address:
                  </label>

                  <input
                    className="input"
                    id="ChangeOwner"
                    {...register("addressNewOwnerChanged", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setOwnerProposal((changeOwnerProposal) => ({
                        ...changeOwnerProposal,
                        addressNewOwnerChanged: e.target.value,
                      }))
                    }
                    value={changeOwnerProposal.addressNewOwnerChanged}
                    placeholder="new owner address"
                  />
                </div>

                <div>
                  <button
                    className="btn"
                    type="submit"
                    onClick={handleSubmit(onSubmitChangeOwner)}
                    disabled={isCreateLoading || isCreateStarted}
                    data-create-loading={isCreateLoading}
                    data-create-started={isCreateStarted}
                  >
                    send proposal change owner
                  </button>
                </div>

                {(isPrepareErrorChangeOwner || error) && (
                  <div>
                    Error: {(prepareErrorChangeOwner || error)?.message}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "TokenTransaction" && (
            <>
              <form>
                <div className="row">
                  <label className="queryInput" htmlFor="TokenTransaction">
                    Insert token transaction:
                  </label>

                  <input
                    className="ProposalType"
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
                    Insert token contract address:
                  </label>

                  <input
                    className="input"
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
                    Insert value send
                  </label>

                  <input
                    className="input"
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
                    className="btn"
                    type="submit"
                    onClick={handleSubmit(onSubmitTokenTransaction)}
                    disabled={isCreateLoading || isCreateStarted}
                    data-create-loading={isCreateLoading}
                    data-create-started={isCreateStarted}
                  >
                    send proposal change owner
                  </button>
                </div>

                {(isPrepareErrorTokenTransaction || error) && (
                  <div>
                    Error: {(prepareErrorTokenTransaction || error)?.message}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {watchType && (
        <div className="row">
          {watchType.toString() === "NFTTransaction" && (
            <>
              <form>
                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert NFT transaction
                  </label>

                  <input
                    className="ProposalType"
                    id="NFTTransaction"
                    {...register("addressToNFTtransfer", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setAddressToNFTTransaction((addressToNFTTransaction) => ({
                        ...addressToNFTTransaction,
                        addressToNFTtransfer: e.target.value,
                      }))
                    }
                    value={addressToNFTTransaction.addressToNFTtransfer}
                    placeholder="address to send token"
                  />
                </div>
                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert NFT contract address
                  </label>

                  <input
                    className="input"
                    id="NFTTransaction"
                    {...register("addressNFT", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setAddressToNFTTransaction((addressToNFTTransaction) => ({
                        ...addressToNFTTransaction,
                        addressNFT: e.target.value,
                      }))
                    }
                    value={addressToNFTTransaction.addressNFT}
                    placeholder="contract address NFT"
                  />
                </div>

                <div className="row">
                  <label className="queryInput" htmlFor="NFTTransaction">
                    Insert id NFT
                  </label>

                  <input
                    className="input"
                    id="NFTTransaction"
                    {...register("idNFT", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setAddressToNFTTransaction((addressToNFTTransaction) => ({
                        ...addressToNFTTransaction,
                        idNFT: e.target.value,
                      }))
                    }
                    value={addressToNFTTransaction.idNFT}
                    placeholder="id NFT send"
                  />
                </div>

                <div>
                  <button
                    className="btn"
                    type="submit"
                    onClick={handleSubmit(onSubmitNFTtransaction)}
                    disabled={isCreateLoading || isCreateStarted}
                    data-create-loading={isCreateLoading}
                    data-create-started={isCreateStarted}
                  >
                    send proposal change owner
                  </button>
                </div>

                {(isPrepareErrorNFTTransaction || error) && (
                  <div>
                    Error: {(prepareErrorNFTTransaction || error)?.message}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
