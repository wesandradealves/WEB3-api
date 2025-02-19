import { ISESProvider } from '@/domain/interfaces/providers/ses.provider';
import { SESClient, SendTemplatedEmailCommand, SendTemplatedEmailCommandInput } from '@aws-sdk/client-ses';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class SESProvider implements ISESProvider {
  private sourceArn: string;
  private sender: string;

  constructor(private readonly sesClient: SESClient) {
    this.sourceArn = process.env.SES_SOURCE_ARN;
  }

  async dispatchEmail(request: any): Promise<void> {
    try {
      const makeEmail = this.makeEmail(request);
      await this.sesClient.send(makeEmail);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private makeEmail(request: any): SendTemplatedEmailCommand {
    const receiver: string[] = Array.isArray(request.receiver) ? request.receiver : [request.receiver];
    this.sender = process.env.SES_EMAIL_FROM;

    const input: SendTemplatedEmailCommandInput = {
      Source: this.sender,
      SourceArn: this.sourceArn,
      Destination: {
        ToAddresses: receiver,
      },
      Template: request.template,
      TemplateData: JSON.stringify(request.templateData),
    };

    return new SendTemplatedEmailCommand(input);
  }
}


