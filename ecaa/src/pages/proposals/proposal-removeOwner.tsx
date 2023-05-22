import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useParams } from "react-router-dom";

  type PRemoveOwnerProposal = {
    removeOwner: string;
  };

export const RemoveOwner = (props: PRemoveOwnerProposal) => {

  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  //Proposal Remove Owner 2

  const [removeOwner, setRemoveOwner] = useState<PRemoveOwnerProposal>({
    removeOwner: "",
  });
const {
    register,
    handleSubmit,
    } = useForm({
    mode: "onSubmit",
    defaultValues: {
      removeOwner: removeOwner.removeOwner,
    },
  });

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

return (
 <form>
                <div className="row">
                  <label className="queryInput" htmlFor="Removeowner">
                    Insert owner's address to remove:
                  </label>

                  <input
                    className="ProposalType form-control"
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
                    placeholder="owner's address to remove"
                  />
                </div>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitRemoveOwner)}
                    disabled={isCreateRemoveOwnerProposalLoading || isCreateRemoveOwnerProposal}
                    data-create-loading={isCreateRemoveOwnerProposalLoading}
                    data-create-started={isCreateRemoveOwnerProposal}
                  >
                    Send
                  </button>
                </div>

                {(isPrepareErrorRemoveOwner || errorRemoveOwner) && (
                  <div>
                    Error: {(prepareErrorRemoveOwner || errorRemoveOwner)?.message}
                  </div>
                )}
              </form>
)

}