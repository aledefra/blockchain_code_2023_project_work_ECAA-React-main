import { ethers } from "ethers";
import { useState } from "react";
import { useAccount, useBalance, useConnect } from "wagmi";
import { useContractRead, useContractEvent } from 'wagmi';



const contractAbi = [{"inputs":[{"internalType":"address","name":"_implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"proxy","type":"address"}],"name":"ProxyCreated","type":"event"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_numConfirmationsRequired","type":"uint256"},{"internalType":"uint256","name":"_numTreshold","type":"uint256"}],"name":"createWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementationContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

const contractAddress = "0x078c1b2e22677C910dbEA73885Cef1ED679E2e3d";
const alchemyApiKey = "z8b0aKqHNwhW3rp7JdoPv1_dUrOAW1dI";
const provider = new ethers.providers.AlchemyProvider("maticmum", alchemyApiKey);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);



export const MultisigWallet = () => {
//     const addressNewContract =
// contract.once("ProxyCreated", async (_address, abi) => {
//     console.log("multisig creato 2:", _address);
//     console.log("questa è l'abi del nuovo contratto", abi);
// });
//const NewContract = new ethers.Contract(addressNewContract._address, addressNewContract.abi, provider);


    const { address } = useAccount();
    // const { data, isError, isLoading } = useContractRead({
    //     address: addressNewContract._address,
    //     abi: addressNewContract.abi,
    //     functionName: 'getOwners'
        
    //   })
   
      
    //   console.log("questo è il nuovo contratto", addressNewContract._address)
useContractEvent({
        address: contractAddress,
        abi: contractAbi,
        eventName: "ProxyCreated",
        listener(args)  { 
           console.log(args);
         }
      
      });
   







    return (
      <div className="MyMultisig">
        <h1>MultisigWallet</h1>
        
        <div>
        
        
       
        
      
      
        </div>
      </div>
    );
  };
  