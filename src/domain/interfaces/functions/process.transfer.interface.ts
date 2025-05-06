export interface SQSMessage {
  Records: Array<{
    body: string;
    receiptHandle: string;
    messageId: string;
    attributes?: any;
    messageAttributes?: any;
  }>;
}

export interface TransferQueueItem {
  transferId: string;
  asset: string;
  recipetName: string;
  recipetWallet: string;
  recipetId: string;
  recipetEmail: string;
  amount: string | number;
  senderEmail: string;
  senderDefaultWalletAddress: string;
  senderWalletId: string | number;
}

export interface TransferPayload {
  wallet_id: string | number;
  destination_user_id: number;
  destination_wallet_id: number;
  amount: number;
  destination_company_id: number;
  company_id: number;
  asset: string;
}

export interface TransferResult {
  status: number;
  message: string;
  notFoundIds?: string[];
}

export interface SQSDeleteParams {
  ReceiptHandle: string;
  MessageId: string;
}