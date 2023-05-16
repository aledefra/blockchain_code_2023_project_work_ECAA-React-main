import { IInitialize } from "../model/initialize-model";
import { IProposalType } from "../model/proposalType-model";

export const defaultInitialize : IInitialize = {
    owners : [],
    numConfirmationsRequired: 0, 
    numTreshold: 0,
    newWalletAddress: "",
}

export const defaultValue: IProposalType = {
    
    Transaction: 0,
    NewOwner: "",
    RemoveOwner: 0,
    ChangeThreshold: 0,
    ChangeOwner: 0,
    TokenTransaction: 0,
    NFTTransaction: 0
    
}