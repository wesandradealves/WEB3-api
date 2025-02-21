import { UserEntity } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ICreateUser, IViewUser, IUpdateUser } from "@/domain/types/user";
import { ViewUserDto } from "@/modules/user/api/dtos/view.user.dto";
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);
  
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, 
  ) {}
  
  async create(data: ICreateUser): Promise<ViewUserDto> {
    try {
      return this.userRepository.save(data);
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
      this.handleDBExceptions(error);
    }
  }
  async update(id: string, data: IUpdateUser): Promise<UpdateResult> {
    try {
      return this.userRepository.update({id}, data);
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
      this.handleDBExceptions(error);
    }
  }
  async delete(id: string): Promise<any> {
    try {
      return this.userRepository.softDelete(id);
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
      this.handleDBExceptions(error);
    }
  }
  async listOne(id: string): Promise<IViewUser> {
    try {
      const response = await this.userRepository.findOne({
        where: {
          id: id
        },
        withDeleted: false,
      });
      return response;
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
      this.handleDBExceptions(error);
    }
  }
  
  listAll(): Promise<IViewUser[]> {
    throw new Error("Method not implemented.");
  }

  private handleDBExceptions(error: any): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException('Erro interno do servidor.');
  }
}

