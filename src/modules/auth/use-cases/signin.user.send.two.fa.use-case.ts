import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignInRequestDto } from '../api/dtos/signIn.request.dto';
import { ISignInUserSendTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.send.two.fa.use-case';

@Injectable()
export class SignInSendTwoFaUseCase implements ISignInUserSendTwoFaUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(SignInSendTwoFaUseCase.name);
  }

  async execute(data: SignInRequestDto): Promise<any> {
    this.logger.log(data);
    return await this.authRepository.signInSendTwoFa(data);
  }
}
