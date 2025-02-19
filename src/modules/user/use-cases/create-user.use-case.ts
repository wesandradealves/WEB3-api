import { IUserRepository } from '@/domain/interfaces/repositories/user.repository';
// import { HttpBdmProvider } from '@/infrastructure/providers/http/http.bdm.provider';
import { BadRequestException, Inject, Injectable,InternalServerErrorException,/*, NotFoundException*/ 
Logger,
NotFoundException} from '@nestjs/common';
import { CreateUserRequestDto } from '../api/dtos/create-user.request.dto';
import { UserEntity } from '@/domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    // ToDo Validar se o provider confere para os requisitos de consulta.
    // @Inject(HttpBdmProvider)
    // private readonly httpBDMProvider: HttpBdmProvider,
  ) {}

  async create(data: CreateUserRequestDto): Promise<UserEntity> {
    try {
      //ToDo Verificar se o usuário existe no BDM
      
      // const userExistsInBDM = await this.httpBDMProvider.fetchData({
      //   method: 'GET',
      //   url: `/users/exists?email=${data.email}`,
      // });
      // if (!userExistsInBDM) {
      //   throw new NotFoundException('Usuário não encontrado na plataforma BDM');
      // }

      const user = await this.userRepository.create({
        name: data.name,
        email: data.email,
        userBdmId: 5,//ToDo o id deve ser o retorno obtido na busca do usuário dentro do bdm.
        userMarketId: uuidv4(),//Validar se isso é gerado por nós ou se vem de outra consulta
        profile: data.profile,
        isAdmin: false,//Validar se vai ficar disponivel nesse endpoint através do body um campo isAdmin, por hora default
        isActive: true,//Validar se vai ficar disponivel nesse endpoint através do body um campo isActive, por hora default
        id: uuidv4(),//Validar o motivo da obrigatoriedade, pois o id é auto gerado na entidade base
        createdAt: undefined,//Validar o motivo da obrigatoriedade, pois a entidade tem um default de data de cadastro
        updatedAt: undefined//Validar o motivo da obrigatoriedade, pois a entidade tem um default de data de atualização
      });
      return user;
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
      this.handleDBExceptions(error);
    }
  }

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
