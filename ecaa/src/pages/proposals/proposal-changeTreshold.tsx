import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useParams } from "react-router-dom";

   type PChangeThresholdProposal = {
    threshold: string;
  };

export const ChangeThreshold = (props: PChangeThresholdProposal) => {


  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  //Proposal Change Treshold 3

  const [threshold, setThreshold] = useState<PChangeThresholdProposal>({
    threshold: "",
  });
const {
    register,
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      threshold: threshold.threshold,
    },
  });

//Propose Change Treshold 3
  const {
    config: configChangeThreshold,
    error: prepareErrorChangeThreshold,
    isError: isPrepareErrorChangeThreshold,
  } = usePrepareContractWrite({
    address: myAddress,
    abi: contractAbi,
    functionName: "proposeChangeThreshold",
    args: [threshold.threshold],
  });

  const {
    isSuccess: isCreateChangeThresholdProposal,
    isLoading: isCreateChangeThresholdProposalLoading,
    data: dataProposalChangeThreshold,
    error: errorChangeThreshold,
    write: writeForChangeThreshold,
  } = useContractWrite(configChangeThreshold);

  function onSubmitChangeThreshold() {
    if (!writeForChangeThreshold) return;
    writeForChangeThreshold();
  }


return (
 <form>
                <div className="row">
                  <label className="queryInput" htmlFor="ChangeThreshold">
                    Insert number of new threshold:
                  </label>

                  <input
                    className="ProposalType form-control"
                    id="ChangeThreshold"
                    {...register("threshold", {
                      required: { value: true, message: "Field required" },
                    })}
                    onChange={(e) =>
                      setThreshold((threshold) => ({
                        ...threshold,
                        treshold: e.target.value,
                      }))
                    }
                    value={threshold.threshold}
                    placeholder="number new threshold"
                  />
                </div>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitChangeThreshold)}
                    disabled={isCreateChangeThresholdProposalLoading || isCreateChangeThresholdProposal}
                    data-create-loading={isCreateChangeThresholdProposalLoading}
                    data-create-started={isCreateChangeThresholdProposal}
                  >
                    Send
                  </button>
                </div>

                {(isPrepareErrorChangeThreshold || errorChangeThreshold) && (
                  <div>
                    Error: {(prepareErrorChangeThreshold || errorChangeThreshold)?.message}
                  </div>
                )}
              </form>
)

}