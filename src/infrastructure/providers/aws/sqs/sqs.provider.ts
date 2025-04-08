import { ISQSProvider } from '@/domain/interfaces/providers/sqs.provider';
import {
  DeleteMessageCommand,
  Message,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  SQSClient,
  SQSClientConfig,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class SqsProvider implements ISQSProvider {
  private readonly awsConfig: SQSClientConfig;
  private readonly messageGroupId: string;
  private readonly sqsClient: SQSClient;

  constructor() {

    if (process.env.IS_OFFLINE === 'true') {
      this.awsConfig = {
        endpoint: process.env.AWS_SQS_ENDPOINT,
        region: process.env.AWS_REGION,
        apiVersion: process.env.AWS_SQS_API_VERSION,
        credentials: {
          accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
          secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
          sessionToken: process.env.AWS_SESSION_TOKEN,
        },
        logger: undefined,
      };
    }
    this.messageGroupId = 'DefaultGroup';
    this.sqsClient = new SQSClient(this.awsConfig);
  }

  private formatMessageBeforeSend(message: any = {}): string {
    switch (typeof message) {
      case 'string':
        return message;
      case 'object':
        if (!message) {
          return '';
        } else {
          return JSON.stringify(message) || message?.toString();
        }
      default:
        return message.toString();
    }
  }
  private msgParams(queueUrl: string, message: any): SendMessageCommandInput {
    const isFifoQueue: boolean = queueUrl?.includes('.fifo');
    const messageBody = this.formatMessageBeforeSend(message);

    return {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      MessageDeduplicationId: isFifoQueue ? uuidV4() : undefined,
      MessageGroupId: isFifoQueue ? this.messageGroupId : undefined, // Required for FIFO queues
    };
  }
  private receiveParam(queueUrl: string): ReceiveMessageCommandInput {
    return {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 10,
      MessageAttributeNames: ['All'],
    };
  }
  public async sendMessage(queueUrl: string, message: any): Promise<string> {
    let messageId = '';

    try {
      const messageMaked = this.msgParams(queueUrl, message);
      const response = await this.sqsClient.send(new SendMessageCommand(messageMaked));

      if (response?.MessageId) {
        messageId = response.MessageId;
      }
      return messageId;
    } catch (error) {
      throw error;
    }
  }
  public async getMessages(queueUrl: string): Promise<Array<Message>> {
    const messages: Array<Message> = [];

    try {
      const result = await this.sqsClient.send(
        new ReceiveMessageCommand(this.receiveParam(queueUrl)),
      );
      if (result?.Messages) {
        for (const message of result.Messages) {
          messages.push(message);
          this.deleteMessage(queueUrl, message);
        }
      }
    } catch (error) {
      throw error;
    }

    return messages;
  }
  public async deleteMessage(queueUrl: string, message: Message): Promise<boolean> {
    let isDeleted = false;

    try {
      const result = await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: `${message?.ReceiptHandle}`,
        }),
      );
      if (
        result.$metadata?.httpStatusCode &&
        String(result.$metadata?.httpStatusCode)[2] === '2'
      ) {
        isDeleted = true;
      }
    } catch (error) {
      throw error;
    }

    return isDeleted;
  }
}
