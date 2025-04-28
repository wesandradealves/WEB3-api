import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { ISignInUserSendTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.send.two.fa.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { SignInRequestDto } from '../api/dtos/signIn.request.dto';

@Injectable()
export class SignInSendTwoFaUseCase implements ISignInUserSendTwoFaUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(data: SignInRequestDto): Promise<any> {
    return await this.authRepository.signInSendTwoFa(data);
  }
}
