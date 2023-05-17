import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useContractRead } from "wagmi";
import { defaultInitialize } from "../../utils/createWallet";
import { useLocation, useNavigate } from "react-router-dom";
import { contractAbiMulti } from "../../contractABIs/proxycontract-abi";

console.log(defaultInitialize, defaultInitialize.newWalletAddress);

export type SavedContract = {
  address: string;
  name: string;
};

export const MyWallets = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const { address } = useAccount();

  useEffect(() => {
    setContracts(JSON.parse(localStorage.getItem("contracts") || "[]"));
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(event.target.value);
  };

  // const handleCreateProposal = () => {
  //   // Controlla se è stato selezionato un indirizzo
  //   if (selectedAddress) {
  //     // Effettua l'azione desiderata con l'indirizzo selezionato
  //     navigate("/wallets/proposals", {
  //       state: { contractAddress: selectedAddress },
  //     });
  //   } else {
  //     // Nessun indirizzo selezionato, gestisci l'errore o mostra un messaggio all'utente
  //   }
  // };

  return (
    <div className="MyMultisig">
      <h1>MyWallets</h1>
      <div>
        {contracts.map((contract) => (
          <div key={contract.address}>
            <a href={`/wallets/${contract.address}`}>{contract.name}</a>
          </div>
        ))}

        {/* <div className="row">
          <label className="queryInput" htmlFor="select">
            Select an address:
          </label>
          <select value={selectedAddress} onChange={handleSelectChange}>
            <option value="">Select</option>
            {contracts.map((contract) => (
              <option key={contract.address} value={contract.address}>
                {contract.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* {address && <div>Address: {selectedAddress}</div>}

        <button type="button" onClick={handleCreateProposal}>
          Create Proposal
        </button> */}
      </div>
    </div>
  );
};
