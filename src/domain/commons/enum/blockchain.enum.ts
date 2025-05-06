export enum BlockchainEnum {
  TRANSFER_STATUS = '/transactions/status?id=',
  BROADCAST = '/transactions/broadcast',
}

export enum BlockchainTransactionsTypeEnum {
  TRANSFER = 4,
}

export enum BlockchainTransactionStatusEnum {
  CONFIRMED = 'confirmed',
  UNCONFIRMED = 'unconfirmed',
  NOT_FOUND = 'not_found',
}
