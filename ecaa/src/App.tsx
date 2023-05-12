import { ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { useContractEvent } from 'wagmi'


const contractAbi = [{"inputs":[{"internalType":"address","name":"_implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"proxy","type":"address"}],"name":"ProxyCreated","type":"event"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_numConfirmationsRequired","type":"uint256"},{"internalType":"uint256","name":"_numTreshold","type":"uint256"}],"name":"createWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementationContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

const contractAddress = "0x078c1b2e22677C910dbEA73885Cef1ED679E2e3d";

function App() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { connect, connectors } = useConnect();

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createWallet",
    args:[["0x4165279351bFA40e821ac16AeA60ed29d9c1Bb29", "0x63ce1ec5bf1163dc7dcf2c1d7f5d5f3d56c6fcbb"],1 , 1]
  });
 
  
  const { 
    data,
    error,
    write
   } = useContractWrite(config);

  const handleMint = async () => {
    if (!write) return;
    write();
    
  };

const alchemyApiKey = "";
const provider = new ethers.providers.AlchemyProvider("maticmum", alchemyApiKey);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

contract.once("ProxyCreated", (address) => {
  console.log("multisig creato:", address);
  console.log(data);
});


  return (
    <div className="App">
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}

      <div>
        {address && <div>Address: {address}</div>}
        {balance && <div>Balance: {balance.formatted}</div>}
        {error && <div>Error: {error.message} </div>}
      </div>

      <div>
        Contract Address: {contractAddress}
        <button onClick={handleMint}>CreateWallet</button>
      </div>
    </div>
  );
}

export default App;