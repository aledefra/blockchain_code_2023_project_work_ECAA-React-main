export interface IProposalType {
    
    ChooseType: number,
    Transaction: number,
    NewOwner: number,
    RemoveOwner: number,
    ChangeThreshold: number,
    ChangeNumConfirmations: number,
    ChangeOwner: number,
    TokenTransaction: number,
    NFTTransaction: number
}

export interface IProposal {
    index: number,
    executed: boolean,
    numConfirmations: number,
    proposalType: number,
    proposalData: string
}






