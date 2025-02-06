import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { ISignInUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.use-case';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignInRequestDto } from '../api/dtos/signIn.request.dto';

@Injectable()
export class SignInUseCase implements ISignInUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(SignInUseCase.name);
  }

  async execute(data: SignInRequestDto): Promise<any> {
    this.logger.log(data);
    return await this.authRepository.signIn(data);
  }
}
