import { UserWalletResponseDto } from "@/modules/wallet/api/dto/user.wallet.response.dto";

export interface IGetUserWalletsUseCase {
  execute(email: string): Promise<UserWalletResponseDto>;
}

export const IGetUserWalletsUseCase = Symbol('IGetUserWalletsUseCase');
