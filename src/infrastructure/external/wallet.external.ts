import { IWalletRepository } from "@/domain/interfaces/external/wallet.external";
import { Inject, Injectable } from "@nestjs/common";
import { UserWalletResponseDto } from "@/modules/wallet/api/dto/user.wallet.response.dto";
import { HttpBdmProvider } from "../providers/http/bdm/http.bdm.provider";

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @Inject(HttpBdmProvider)
    private readonly httpBdmProvider: HttpBdmProvider,
  ) {}

  async getUserWallets(userBdmId: number): Promise<UserWalletResponseDto> {
    const result: UserWalletResponseDto = await this.httpBdmProvider.fetchData({
      url: `/wallets`,
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'payload':`custom:id:${userBdmId}]`
        },
    });

    return result;
  }
}
