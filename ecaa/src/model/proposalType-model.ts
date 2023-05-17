export interface IProposalType {
    Transaction: number,
    NewOwner: string,
    RemoveOwner: number,
    ChangeThreshold: number,
    ChangeOwner: number,
    TokenTransaction: number,
    NFTTransaction: number
}

export interface IProposal {
    index: number,
    executed: boolean ,
    numConfirmations: number,
    proposalType: number,
    proposalData: number
}

