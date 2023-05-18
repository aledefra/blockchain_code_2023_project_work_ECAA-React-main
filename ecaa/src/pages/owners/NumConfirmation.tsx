import { useEffect, useState } from "react";
import { contractAbi } from "../../contractABIs/multisigABI";
import { useParams } from "react-router-dom";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

type Props = {
  owners: string[] | undefined;
};

export const NumConfirmation = ({ owners }: Props) => {
  const { address: contractAddress } = useParams();

  const [newNumberConfirmation, setNewNumberConfirmation] = useState(1);

  // Getters
  const { data: numConfirmationsRequired }: { data: number | undefined } =
    useContractRead({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: "numConfirmationsRequired",
    });

  // Change number of confirmations required
  const prepare = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "proposeChangeThreshold",
    args: [newNumberConfirmation],
  });
  const write = useContractWrite(prepare.config);

  return (
    <div className="col-md">
      <h2>
        Number of confirmations required: {numConfirmationsRequired?.toString()}{" "}
        / {owners?.length}
      </h2>

      <h4>Change the number of confirmations required</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.write?.();
        }}
      >
        <select
          className="form-control"
          value={newNumberConfirmation}
          onChange={(e) => setNewNumberConfirmation(Number(e.target.value))}
        >
          {owners?.map((owner, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <input
          type="submit"
          className="btn btn-primary mt-2"
          value="Change"
          disabled={
            newNumberConfirmation.toString() ===
              numConfirmationsRequired?.toString() ||
            prepare.isError ||
            write.isLoading
          }
          data-create-loading={write.isLoading}
        />
        {prepare.isError && (
          <p className="error">Error: {(prepare.error as any).reason}</p>
        )}
      </form>
    </div>
  );
};
