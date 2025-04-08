import { base58Decode, base58Encode, blake2b } from '@waves/ts-lib-crypto';
import * as axlsign from 'axlsign';
import { BlockchainTransactionsTypeEnum } from '@/domain/enums/blockchain.enum';
import { ISenderKeyPair } from '@/domain/interfaces/util/crypto.util';

const base58StringToByteArray = (base58String: string): any[] => {
  const decoded = base58Decode(base58String);
  const result = [];
  for (let i = 0; i < decoded.length; ++i) {
    result.push(decoded[i] as never & 0xff);
  }

  return result;
};

export const getAssetTransferTxTypeBytes = (
  type = BlockchainTransactionsTypeEnum.TRANSFER,
): number[] => {
  return [type];
};

export const getPublicKeyBytes = (publicKey: string): any[] => {
  return base58StringToByteArray(publicKey);
};

export const stringToByteArray = (str: string): any[] => {
  const bytes = new Array(str.length);

  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes;
};

export const getAssetIdBytes = (
  assetId: string | null,
  mandatory = null,
): any[] => {
  if (mandatory) {
    return base58StringToByteArray(assetId as string);
  } else {
    return assetId ? [1].concat(base58StringToByteArray(assetId)) : [0];
  }
};

export const getFeeAssetIdBytes = (feeAssetId: string | null): any[] => {
  return getAssetIdBytes(feeAssetId);
};

export const getTimestampBytes = (timestamp: number): any[] => {
  return longToByteArray(timestamp);
};

const longToByteArray = (value: number): any[] => {
  const bytes = new Array(7);
  for (let k = 7; k >= 0; k--) {
    bytes[k] = value & 255;
    value = value / 256;
  }

  return bytes;
};

export const getAmountBytes = (amount: number): any[] => {
  return longToByteArray(amount);
};

export const getFeeBytes = (fee: number): any[] => {
  return longToByteArray(fee);
};

export const getRecipientBytes = (recipient: string): any[] => {
  return base58StringToByteArray(recipient);
};

const shortToByteArray = (value: number) => {
  return int16ToBytes(value, true);
};

const byteArrayWithSize = (byteArray: any[]): any[] => {
  const result = shortToByteArray(byteArray.length);
  return result.concat(byteArray);
};

export const getAttachmentBytes = (attachment: any[]): any[] => {
  return byteArrayWithSize(attachment);
};

const int16ToBytes = function (x: number, opt_bigEndian: boolean) {
  return intToBytes(x, 2, 65535, opt_bigEndian);
};

const intToBytes = function (
  x: number,
  numBytes: number,
  unsignedMax: number,
  opt_bigEndian: boolean,
): any[] {
  const signedMax = Math.floor(unsignedMax / 2);
  const negativeMax = (signedMax + 1) * -1;
  if (x != Math.floor(x) || x < negativeMax || x > unsignedMax) {
    throw new Error(x + ' is not a ' + numBytes * 8 + ' bit integer');
  }
  const bytes = [];
  let current;
  const numberType =
    x >= 0 && x <= signedMax ? 0 : x > signedMax && x <= unsignedMax ? 1 : 2;
  if (numberType == 2) {
    x = x * -1 - 1;
  }
  for (let i = 0; i < numBytes; i++) {
    if (numberType == 2) {
      current = 255 - (x % 256);
    } else {
      current = x % 256;
    }
    if (opt_bigEndian) {
      bytes.unshift(current as never);
    } else {
      bytes.push(current as never);
    }
    if (numberType == 1) {
      x = Math.floor(x / 256);
    } else {
      x = x >> 8;
    }
  }
  return bytes;
};

export const buildId = (transactionBytes: any[]): string => {
  const hash = blake2b(new Uint8Array(transactionBytes));
  return base58Encode(hash);
};

export const getSignature = (data: any[], sender: ISenderKeyPair) => {
  const SenderPrivateKey = base58Decode(sender.privateKey);
  return doSign(SenderPrivateKey, data);
};

export const doSign = (privateKey: Uint8Array, dataToSign: any[]) => {
  const signature = axlsign.sign(privateKey, new Uint8Array(dataToSign));
  return base58Encode(signature);
};
