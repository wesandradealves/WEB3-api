import { IUserRepository } from '@/domain/interfaces/repositories/user.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException /*, NotFoundException*/,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequestDto } from '../api/dtos/create-user.request.dto';
import { ViewUserDto } from '../api/dtos/view.user.dto';
import { ICreateUserUseCase } from '@/domain/interfaces/use-cases/user/create.user.use-case';

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateUserRequestDto): Promise<ViewUserDto> {
    try {
      return this.userRepository.create({
        email: data.email,
        profile: data.profile,
      });
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
