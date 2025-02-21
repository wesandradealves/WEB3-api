import { Module } from '@nestjs/common';
import { UserController } from './api/controller/user.controller';
import { CreateUserUseCase } from './use-cases/create.user.use-case';
import { IUserRepository } from '@/domain/interfaces/repositories/user.repository';
import { UserRepository } from '@/infrastructure/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/domain/entities/user.entity';
import { HttpModule } from '@/infrastructure/providers/http/http.module';
import { DeleteUserUseCase } from './use-cases/delete.user.use-case';
import { UpdateUserUseCase } from './use-cases/update.user.use-case';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateUserUseCase,
    { provide: IUserRepository, useClass: UserRepository },
  ],
})
export class UserModule {}
