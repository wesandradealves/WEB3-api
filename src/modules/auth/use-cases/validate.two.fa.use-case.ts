import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { IValidateTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/validate.two.fa.use-case';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ValidaTwoFaUseCase implements IValidateTwoFaUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(username: string, twofa: number): Promise<any> {
    return await this.authRepository.validateTwoFa(username, twofa);
  }
}
