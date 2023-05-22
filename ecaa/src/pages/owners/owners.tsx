import { useEffect, useState } from "react";
import { contractAbi } from "../../contractABIs/multisigABI";
import { IProposalType } from "../../model/proposalType-model";
import { useParams } from "react-router-dom";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { NumConfirmation } from "./NumConfirmation";
import { Threshold } from "./Threshold";

export const Owners = (props: IProposalType) => {
  const { address: contractAddress } = useParams();

  const [newOwnerInput, setNewOwnerInput] = useState("");
  const [ownerToRemove, setOwnerToRemove] = useState<string | undefined>(
    undefined
  );

  const [changeOwnerOld, setChangeOwnerOld] = useState<string>("");
  const [changeOwnerNew, setChangeOwnerNew] = useState<string>("");

  // Getters
  const { data: owners }: { data: string[] | undefined } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "getOwners",
  });

  // Remove owner
  const removeOwnerPrepare = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "proposeRemoveOwner",
    args: [ownerToRemove],
  });
  const removeOwnerWrite = useContractWrite(removeOwnerPrepare.config);
  useEffect(() => {
    if (ownerToRemove) {
      removeOwnerWrite?.write?.();
      setOwnerToRemove(undefined);
    }
  }, [ownerToRemove]);

  // Change owner
  const changeOwnerPrepare = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "proposeChangeOwner",
    args: [changeOwnerOld, changeOwnerNew],
  });
  const changeOwnerWrite = useContractWrite(changeOwnerPrepare.config);

  // Add owner
  const addOwnerPrepare = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "proposeNewOwner",
    args: [newOwnerInput],
  });
  const addOwnerWrite = useContractWrite(addOwnerPrepare.config);

  return (
    <div>
      <h1>Owners ({owners?.length})</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addOwnerWrite?.write?.();
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="New owner address"
          value={newOwnerInput}
          onChange={(e) => setNewOwnerInput(e.target.value)}
        />
        <input
          type="submit"
          className="btn btn-primary mt-2"
          value="Add Owner"
          disabled={
            newOwnerInput === "" ||
            addOwnerPrepare.isError ||
            addOwnerWrite.isLoading
          }
          data-create-loading={addOwnerWrite.isLoading}
        />
        {newOwnerInput !== "" && addOwnerPrepare.isError && (
          <p className="error">
            Error: {(addOwnerPrepare.error as any).reason}
          </p>
        )}
      </form>

      {removeOwnerWrite.isError && (
        <p className="error">Error: {(removeOwnerWrite.error as any).reason}</p>
      )}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Address</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {owners?.map((owner, i) => (
            <tr key={i}>
              <td>{owner}</td>
              <td>
                <button
                  className="btn btn-danger"
                  disabled={removeOwnerWrite.isLoading}
                  data-create-loading={removeOwnerWrite.isLoading}
                  onClick={() => setOwnerToRemove(owner)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div className="row">
        <NumConfirmation owners={owners} />
        <Threshold owners={owners} />
      </div>

      <hr />

      <h2>Change owner</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //check if old owner is in owners array
          if (!owners?.includes(changeOwnerOld)) {
            alert("Old owner is not an owner");
            return;
          }
          //check if old owner and new owner are the same
          if (changeOwnerOld === changeOwnerNew) {
            alert("Old owner and new owner can't be the same");
            return;
          }
          //check if new owner is in owners array
          if (owners?.includes(changeOwnerNew)) {
            alert("New owner is already an owner");
            return;
          }
          
          changeOwnerWrite?.write?.();
        }}
      >
        <label htmlFor="changeOwnerOld">Old owner address</label>
        <input
          type="text"
          id="changeOwnerOld"
          className="form-control"
          placeholder="Old owner address"
          value={changeOwnerOld}
          onChange={(e) => setChangeOwnerOld(e.target.value)}
        />

        <label htmlFor="changeOwnerNew">New owner address</label>
        <input
          type="text"
          id="changeOwnerNew"
          className="form-control"
          placeholder="New owner address"
          value={changeOwnerNew}
          onChange={(e) => setChangeOwnerNew(e.target.value)}
        />
        <input
          type="submit"
          className="btn btn-primary mt-2"
          value="Change Owner"
          disabled={changeOwnerOld === "" || changeOwnerNew === ""}
        />
      </form>


    </div>
  );
};
