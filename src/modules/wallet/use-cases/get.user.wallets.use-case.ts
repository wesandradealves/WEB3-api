import { IWalletRepository } from '@/domain/interfaces/external/wallet.external';
import { IGetUserWalletsUseCase } from '@/domain/interfaces/use-cases/wallets/get.user.wallets.use-case';
import { Inject, Injectable } from "@nestjs/common";
import { UserWalletResponseDto } from '../api/dto/user.wallet.response.dto';
import { UserEntity } from '@/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetUserWalletsUseCase implements IGetUserWalletsUseCase {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @Inject(IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(email: string): Promise<UserWalletResponseDto> {
    let user = await this.user.findOneBy({ email });
    return await this.walletRepository.getUserWallets(user.userBdmId);
  }
}