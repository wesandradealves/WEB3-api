export enum BlockchainEnum {
  BLOCKCHAIN_API_URL = 'BLOCKCHAIN_API_URL',
  BLOCKCHAIN_API_KEY_HASH = 'BLOCKCHAIN_API_KEY_HASH',
  BLOCKCHAIN_TRANSFER_FEE = 'BLOCKCHAIN_TRANSFER_FEE',
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
