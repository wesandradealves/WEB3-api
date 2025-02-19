import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { IVaidateTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/validate.two.fa.use-case';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ValidaTwoFaUseCase implements IVaidateTwoFaUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(ValidaTwoFaUseCase.name);
  }

  async execute(username: string,  twofa: number): Promise<any> {
    this.logger.log(username);
    return await this.authRepository.validateTwoFa(username, twofa);
  }
}
