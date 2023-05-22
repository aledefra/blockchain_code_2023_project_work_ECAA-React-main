import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import {  useParams } from "react-router-dom";

    type PChangeOwnersProposal = {
    addressOldOwner: string;
    addressNewOwnerChanged: string;
  };

export const ChangeOwner = (props: PChangeOwnersProposal) => {


  const params = useParams();
  const myAddress = params.address as `0x${string}`;

   //Proposal Change Owner 5

  const [changeOwnerProposal, setOwnerProposal] =
    useState<PChangeOwnersProposal>({
      addressOldOwner: "",
      addressNewOwnerChanged: "",
    });

const {
    register,
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
           addressOldOwner: changeOwnerProposal.addressOldOwner,
      addressNewOwnerChanged: changeOwnerProposal.addressNewOwnerChanged,
    },
  });


 //Propose Change Owner 5
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



return (

                 <form>
                <div className="row">
                  <label className="queryInput" htmlFor="ChangeOwner">
                    Insert old owner address to change:
                  </label>

                  <input
                    className="ProposalType form-control"
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
                    Insert new owner address to add:
                  </label>

                  <input
                    className="input form-control"
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
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitChangeOwner)}
                    disabled={isCreateChangeOwnerProposalLoading || isCreateChangeOwnerProposal}
                    data-create-loading={isCreateChangeOwnerProposalLoading}
                    data-create-started={isCreateChangeOwnerProposal}
                  >
                    Send
                  </button>
                </div>

                {(isPrepareErrorChangeOwner || errorChangeOwner) && (
                  <div>
                    Error: {(prepareErrorChangeOwner || errorChangeOwner)?.message}
                  </div>
                )}
              </form>

)

}