import { Message } from '@aws-sdk/client-sqs';

export interface ISQSProvider {
  sendMessage(queueUrl: string, message: any): Promise<string>;
  getMessages(queueUrl: string): Promise<Array<Message>>;
  deleteMessage(queueUrl: string, message: Message): Promise<boolean>;
}

export const ISQSProvider = Symbol('ISQSProvider');
