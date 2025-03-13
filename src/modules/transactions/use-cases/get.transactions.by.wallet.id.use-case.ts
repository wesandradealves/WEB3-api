import { ItransactionsRepository } from "@/domain/interfaces/repositories/transactions.repository";
import { IGetTransactionsByWalletIdUseCase } from "@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case";
import { Inject, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class GetTransactionsByWalletIdUseCase implements IGetTransactionsByWalletIdUseCase {
  constructor(
    @Inject(ItransactionsRepository)
    private readonly transactionsRepository: ItransactionsRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GetTransactionsByWalletIdUseCase.name);
  }

  async execute(walletId: number, username:string): Promise<any> {
    this.logger.log(walletId);
    return await this.transactionsRepository.getTransactionsByWalletId(walletId, username);
  }
}
