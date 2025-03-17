import { IUserRepository } from '@/domain/interfaces/repositories/user.repository';
import { 
  BadRequestException, 
  Inject, 
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { IUpdateUserUseCase } from '@/domain/interfaces/use-cases/user/update.user.use-case';

@Injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
  
  async execute(
    id: string,
    profile?: ProfileUserEnum,
    isActive?: boolean
  ): Promise<any> {
    try {
      const user = await this.userRepository.listOne(id);
      if(!user) throw new BadRequestException('Não é permitido atualizar um usuário deletado');
      if(user.isActive == false) throw new BadRequestException('Não é permitido atualizar um usuário desativado');
      
      if(profile) user.profile = profile;
      if(isActive) user.isActive = isActive;
      return this.userRepository.update(id, user);
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
