import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useParams } from "react-router-dom";

   type PChangeTresholdProposal = {
    treshold: string;
  };

export const ChangeTreshold = (props: PChangeTresholdProposal) => {


  const params = useParams();
  const myAddress = params.address as `0x${string}`;

  //Proposal Change Treshold 3

  const [treshold, setTreshold] = useState<PChangeTresholdProposal>({
    treshold: "",
  });
const {
    register,
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      treshold: treshold.treshold,
    },
  });

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


return (
 <form>
                <div className="row">
                  <label className="queryInput" htmlFor="ChangeTreshold">
                    Insert number of new treshold:
                  </label>

                  <input
                    className="ProposalType form-control"
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
                    className="btn btn-primary mt-2"
                    type="submit"
                    onClick={handleSubmit(onSubmitChangeTreshold)}
                    disabled={isCreateChangeTresholdProposalLoading || isCreateChangeTresholdProposal}
                    data-create-loading={isCreateChangeTresholdProposalLoading}
                    data-create-started={isCreateChangeTresholdProposal}
                  >
                    Send
                  </button>
                </div>

                {(isPrepareErrorChangeTreshold || errorChangeTreshold) && (
                  <div>
                    Error: {(prepareErrorChangeTreshold || errorChangeTreshold)?.message}
                  </div>
                )}
              </form>
)

}