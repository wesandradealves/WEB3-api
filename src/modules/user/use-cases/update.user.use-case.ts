import { IUserRepository } from '@/domain/interfaces/repositories/user.repository';
import { BadRequestException, Inject, Injectable,InternalServerErrorException,/*, NotFoundException*/ 
Logger,
NotFoundException} from '@nestjs/common';
import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
  
  async disableUser(id: string): Promise<any> {
    try {
      const user = await this.userRepository.listOne(id);
      if(!user) throw new BadRequestException('Não é permitido desativar um usuário deletado');
      if(user.isActive == false) throw new BadRequestException('Não é permitido desativar um usuário já desativado');
      user.isActive = false;
      return this.userRepository.update(id, user);
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
      this.handleDBExceptions(error);
    }
  }

  async updateUserProfile(id: string, profile: ProfileUserEnum): Promise<any> {
    try {
      const user = await this.userRepository.listOne(id);
      if(!user) throw new BadRequestException('Não é permitido atualizar um usuário deletado');
      if(user.isActive == false) throw new BadRequestException('Não é permitido atualizar um usuário desativado');
      
      user.profile = profile;
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
