
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useParams } from "react-router-dom";

  type PChangeNumConfirmationsProposal = {
    numConfirmations: string;
  };

export const ChangeNumConfirmations = (props: PChangeNumConfirmationsProposal) => {

  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  //Proposal Change Num Confirmations 4

  const [numConfirmations, setNumConfirmations] = useState<PChangeNumConfirmationsProposal>({
    numConfirmations: "",
  });

const {
    register,
    handleSubmit,
    } = useForm({
    mode: "onSubmit",
    defaultValues: {
      numConfirmations: numConfirmations.numConfirmations,
    },
  });


//Propose Change num Confirmations 4
  const {
    config: configChangeNumConfirmations,
    error: prepareErrorChangeNumConfirmations,
    isError: isPrepareErrorChangeNumConfirmations,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeChangeNumConfirmations",
    args: [numConfirmations.numConfirmations],
  });

  const {
    isSuccess: isCreateChangeNumConfirmationsProposal,
    isLoading: isCreateChangeNumConfirmationsProposalLoading,
    data: dataProposalChangeNumConfirmations,
    error: errorChangeNumConfirmations,
    write: writeForChangeNumConfirmations,
  } = useContractWrite(configChangeNumConfirmations);

  function onSubmitChangeNumConfirmations() {
    if (!writeForChangeNumConfirmations) return;
    writeForChangeNumConfirmations();
  }


return (
    
 <form>
                <div className="row">
                  <label className="queryInput" htmlFor="ChangeNumConfirmations">
                    Insert new number of confirmations required:
                  </label>

                  <input
                    className="ProposalType form-control"
                    id="ChangeNumConfirmations"
                    {...register("numConfirmations", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setNumConfirmations((numConfirmations) => ({
                        ...numConfirmations,
                        numConfirmations: e.target.value,
                      }))
                    }
                    value={numConfirmations.numConfirmations}
                    placeholder="number new treshold"
                  />
                </div>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitChangeNumConfirmations)}
                    disabled={isCreateChangeNumConfirmationsProposalLoading || isCreateChangeNumConfirmationsProposal}
                    data-create-loading={isCreateChangeNumConfirmationsProposalLoading}
                    data-create-started={isCreateChangeNumConfirmationsProposal}
                  >
                    Send
                  </button>
                </div>

                {(isPrepareErrorChangeNumConfirmations || errorChangeNumConfirmations) && (
                  <div>
                    Error: {(prepareErrorChangeNumConfirmations || errorChangeNumConfirmations)?.message}
                  </div>
                )}
     </form>
    )
}