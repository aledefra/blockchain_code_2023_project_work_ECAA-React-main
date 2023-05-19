import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";

type PNewOwnerProposal = {
    newOwner: string;
  };
export const NewOwner = (props: PNewOwnerProposal) => {



  const location = useLocation();
    const selectedAddress = location.state?.selectedAddress || "";
    const params = useParams();
    const myAddress = params.address as `0x${string}`;
  
    //Proposal New Owner 1
  
    const [newOwner, setNewOwner] = useState<PNewOwnerProposal>({
      newOwner: "",
    });
  const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm({
      mode: "onSubmit",
      defaultValues: {
        newOwner: newOwner.newOwner,
      },
    });
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
  return (
  <form>
                  <div className="row">
                    <label className="queryInput" htmlFor="NewOwner">
                      Insert address new Owner:
                    </label>
  
                    <input
                      className="ProposalType form-control"
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
                      className="btn btn-primary mt-2"
                      type="submit"
                      onClick={handleSubmit(onSubmitNewOwner)}
                      disabled={isCreateNewOwnerProposalLoading || isCreateNewOwnerProposal}
                      data-create-loading={isCreateNewOwnerProposalLoading}
                      data-create-started={isCreateNewOwnerProposal}
                    >
                      Send
                    </button>
                  </div>
  
                  {(isPrepareErrorNewOwner || errorNewOwner) && (
                    <div>Error: {(prepareErrorNewOwner || errorNewOwner)?.message}</div>
                  )}
                </form>
  )
  }
  