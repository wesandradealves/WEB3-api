import { IUserRepository } from '@/domain/interfaces/repositories/user.repository';
import { 
  BadRequestException, 
  Inject, 
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name);
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async delete(id: string): Promise<any> {
    try {
      // ToDo Validar tipo de resposta esperado, no momento any, pois o retorno do delete é o mesmo do banco de dados com affected igual a 1 se deletado com sucesso.
      const deleteUser = await this.userRepository.delete(id);
      return deleteUser;
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException('Erro interno do servidor.');
  }
}
