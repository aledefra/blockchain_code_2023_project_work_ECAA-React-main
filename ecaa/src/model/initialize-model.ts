export interface IInitialize {
    owners : { address: string }[],
    numConfirmationsRequired: number,
    numTreshold: number,
    newWalletAddress: string
    name: string,
}