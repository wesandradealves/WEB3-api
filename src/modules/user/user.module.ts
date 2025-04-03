import { Logger, Module } from '@nestjs/common';
import { UserController } from './api/controller/user.controller';
import { CreateUserUseCase } from './use-cases/create.user.use-case';
import { IUserRepository } from '@/domain/interfaces/repositories/user.repository';
import { UserRepository } from '@/infrastructure/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/domain/entities/user.entity';
import { HttpModule } from '@/infrastructure/providers/http/http.module';
import { DeleteUserUseCase } from './use-cases/delete.user.use-case';
import { UpdateUserUseCase } from './use-cases/update.user.use-case';
import { IUpdateUseCase } from '@/domain/interfaces/use-cases/user/update.user.use-case';
import { IDeleteUserUseCase } from '@/domain/interfaces/use-cases/user/delete.user.use-case';
import { ICreateUserUseCase } from '@/domain/interfaces/use-cases/user/create.user.use-case';

@Module({
  imports: [
    HttpModule,
    
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [
    Logger,
    { 
      provide: IUpdateUseCase,
      useClass: UpdateUserUseCase
    },
    { 
      provide: IDeleteUserUseCase, 
      useClass: DeleteUserUseCase 
    },
    { 
      provide: ICreateUserUseCase,
      useClass: CreateUserUseCase 
    },
    { 
      provide: IUserRepository,
      useClass: UserRepository
    },
  ],
})
export class UserModule {}
