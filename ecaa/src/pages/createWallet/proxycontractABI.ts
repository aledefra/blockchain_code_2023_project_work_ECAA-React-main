export const contractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_implementationContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "ProxyCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_owners", type: "address[]" },
      {
        internalType: "uint256",
        name: "_numConfirmationsRequired",
        type: "uint256",
      },
      { internalType: "uint256", name: "_numTreshold", type: "uint256" },
    ],
    name: "createWallet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "implementationContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];