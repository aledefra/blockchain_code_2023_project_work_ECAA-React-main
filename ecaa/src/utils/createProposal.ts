import { IProposal, IProposalType } from "../model/proposalType-model";


export const defaultValueProposal: IProposalType = {
    
    ChooseType: 0 || 1 || 2 || 3 || 4 || 5 || 6,
    Transaction: 0,
    NewOwner: 1,
    RemoveOwner: 2,
    ChangeThreshold: 3,
    ChangeOwner: 4,
    TokenTransaction: 5,
    NFTTransaction: 6
    
}

export const defaultTransferProposal : IProposal ={
    index: 0,
    executed: false,
    numConfirmations: 0,
    ProposalType: 0 || 1 || 2 || 3 || 4 || 5 || 6,
    proposalData: 0
}




