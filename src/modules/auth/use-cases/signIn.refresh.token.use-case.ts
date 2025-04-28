import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignInRequestDto } from '../api/dtos/signIn.request.dto';
import { ISignInRefreshTokenUseCase } from '@/domain/interfaces/use-cases/auth/signin.refresh.token.use-case';

@Injectable()
export class SignInRefreshTokenUseCase implements ISignInRefreshTokenUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(SignInRefreshTokenUseCase.name);
  }

  async execute(data: SignInRequestDto, token:string): Promise<any> {
    this.logger.log(data);
    return await this.authRepository.signInRefresh(data, token);
  }
}
