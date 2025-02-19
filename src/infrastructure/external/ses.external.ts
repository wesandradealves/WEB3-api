
import { ISESExternal } from '@/domain/interfaces/external/ses.external';
import { ISESProvider } from '@/domain/interfaces/providers/ses.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SESExternal implements ISESExternal {
  constructor(
    @Inject(ISESProvider)
    private readonly sesProvider: ISESProvider,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(SESExternal.name);
    this.sesProvider = undefined;
  }

  async dispathEmail(request: any): Promise<void> {
    this.logger.log(request);
    await this.sesProvider.dispatchEmail(request);
  }
}
