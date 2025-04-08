import { Logger } from '@nestjs/common';

import {
  BlockchainEnum,
  BlockchainTransactionsTypeEnum,
} from '@/domain/enums/blockchain.enum';
import {
  buildId,
  getAmountBytes,
  getAssetIdBytes,
  getAssetTransferTxTypeBytes,
  getAttachmentBytes,
  getFeeAssetIdBytes,
  getFeeBytes,
  getPublicKeyBytes,
  getRecipientBytes,
  getSignature,
  getTimestampBytes,
  stringToByteArray,
} from '../util/crypto.util';
import { ISenderKeyPair } from '@/domain/interfaces/util/crypto.util';
import { base58Encode } from '@waves/ts-lib-crypto';
import { IBlockchainExternal, IBroadcastTransactionRequest, IBroadcastTransactionResponse, ICheckStatusPaymentRequest, ICheckStatusPaymentResponse, ICreateAssetTransferTransactionRequest, ICreateAssetTransferTransactionResponse, ISendTransferRequest, ISendTransferResponse } from '@/domain/interfaces/external/blockchain.external';
import { HttpBlockchainProvider } from '../providers/http/blockchain/http.blockchain.provider';

export class BlockchainExternal implements IBlockchainExternal {
  private readonly FEE: number = 1;
  constructor(
    private readonly httpClient: HttpBlockchainProvider,
    private readonly logger: Logger,
  ) {
  }
  async sendTransfer(
    data: ISendTransferRequest,
    keyPair: ISenderKeyPair,
  ): Promise<ISendTransferResponse> {
    const now = new Date();

    const broadcastPayload = this.createAssetTransferTransaction(
      {
        ...data,
        attachment: data.attachment ?? '',
        timestamp: now.getTime(),
        fee: this.FEE,
      },
      keyPair,
    );

    this.logger.debug(`broadcastPayload ${JSON.stringify(broadcastPayload)}`);

    const broadcastResponse = await this.broadcast(broadcastPayload);

    return {
      id: broadcastResponse.id,
    };
  }

  private async broadcast(
    transaction: IBroadcastTransactionRequest,
  ): Promise<IBroadcastTransactionResponse> {
    const response = await this.httpClient.request<IBroadcastTransactionResponse>({
      url: `${BlockchainEnum.BROADCAST}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: transaction,
    });

    return response;
  }

  private createAssetTransferTransaction(
    data: ICreateAssetTransferTransactionRequest,
    keyPair: ISenderKeyPair,
  ): ICreateAssetTransferTransactionResponse {
    data.attachment = stringToByteArray(data.attachment ?? '') as any;

    const signaturePayload = this.prepareDataForSignature(data, keyPair.publicKey);

    const signature = getSignature(signaturePayload, keyPair);

    const broadCastPayload = {
      id: buildId(signaturePayload),
      signature,
      amount: data.amount,
      type: BlockchainTransactionsTypeEnum.TRANSFER,
      fee: data.fee,
      feeAssetId: data.feeAssetId,
      recipient: data.recipient,
      senderPublicKey: keyPair.publicKey,
      timestamp: data.timestamp,
      assetId: data.assetId,
      attachment: base58Encode(data.attachment as any),
    };

    return broadCastPayload as any;
  }

  private prepareDataForSignature(
    data: ICreateAssetTransferTransactionRequest,
    senderPublicKey: string,
  ): any[] {
    return [].concat(
      getAssetTransferTxTypeBytes() as any,
      getPublicKeyBytes(senderPublicKey) as any,
      getAssetIdBytes(data.assetId) as any,
      getFeeAssetIdBytes(data.feeAssetId) as any,
      getTimestampBytes(data.timestamp) as any,
      getAmountBytes(data.amount) as any,
      getFeeBytes(data.fee) as any,
      getRecipientBytes(data.recipient) as any,
      getAttachmentBytes(data.attachment as any) as any,
    );
  }

  async checkStatusPayment(
    data: ICheckStatusPaymentRequest,
  ): Promise<ICheckStatusPaymentResponse> {
    const result = await this.httpClient.request({
      url: `${BlockchainEnum.TRANSFER_STATUS}${data.blockchain_code}`,
      method: 'GET',
      data,
    });

    return result;
  }

  async getBDMBalance(address: string,): Promise<any> {
    try {
      const response = await this.httpClient.request<any>({
        url: `/addresses/effectiveBalance/${address}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response;
    } catch (error) {
      throw error;
    }
  }
}
