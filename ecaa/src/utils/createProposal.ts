import { IProposal, IProposalType } from "../model/proposalType-model";


export const defaultValueProposal: IProposalType = {
    
    ChooseType: 0 || 1 || 2 || 3 || 4 || 5 || 6 || 7,
    Transaction: 0,
    NewOwner: 1,
    RemoveOwner: 2,
    ChangeThreshold: 3,
    ChangeNumConfirmations: 4,
    ChangeOwner: 5,
    TokenTransaction: 6,
    NFTTransaction: 7

    
}

export const defaultTransferProposal : IProposal ={
    index: 0,
    executed: false,
    numConfirmations: 0,
    proposalType: 0 || 1 || 2 || 3 || 4 || 5 || 6 || 7,
    proposalData: ""
}






