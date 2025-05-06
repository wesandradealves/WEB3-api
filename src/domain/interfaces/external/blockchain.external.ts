
import { BlockchainTransactionsTypeEnum } from '@/domain/commons/enum/blockchain.enum';
import { ISenderKeyPair } from '../util/crypto.util';

export interface ICheckStatusPaymentRequest {
  blockchain_code: string;
}

export interface ICheckStatusPaymentResponseItem {
  id: string;
  confirmations: number;
  status: string;
  height: number;
}

export interface ICheckStatusPaymentResponse
  extends Array<ICheckStatusPaymentResponseItem> {}

export interface ISendTransferResponse {
  id: string;
}

export interface ISendTransferRequest {
  amount: number;
  recipient: string;
  attachment?: string;
  assetId: string | null;
  feeAssetId: string | null;
}

export type ICreateAssetTransferTransactionRequest = Omit<ISendTransferRequest, ''> & {
  timestamp: number;
  fee: number;
};

export interface ICreateAssetTransferTransactionResponse {
  id: string;
  signature: string;
  amount: number;
  type: BlockchainTransactionsTypeEnum;
  fee: number;
  feeAssetId: string;
  recipient: string;
  senderPublicKey: string;
  timestamp: number;
  assetId: string;
  attachment: string;
}

export type IBroadcastTransactionRequest = ICreateAssetTransferTransactionResponse;

export interface IBroadcastTransactionResponse {
  senderPublicKey: string;
  amount: number;
  signature: string;
  fee: number;
  type: 4;
  version: number;
  attachment: string;
  sender: string;
  feeAssetId: string | null;
  proofs: string[];
  assetId: string | null;
  recipient: string;
  feeAsset: string | null;
  id: string;
  timestamp: number;
  message?: string;
  error?: string;
}

export interface IBlockchainExternal {
  checkStatusPayment(
    data: ICheckStatusPaymentRequest,
  ): Promise<ICheckStatusPaymentResponse>;
  sendTransfer(
    data: ISendTransferRequest,
    keyPair: ISenderKeyPair,
  ): Promise<ISendTransferResponse>;
  getBDMBalance(address: string):  Promise<any>;
}

export const IBlockchainExternal = Symbol('IBlockchainExternal');
