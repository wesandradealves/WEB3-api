import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../use-cases/create.user.use-case';
import { CreateUserRequestDto } from '../dtos/create-user.request.dto';
import { UserEntity } from '@/domain/entities/user.entity';
import { ChangeUserProfileRequestDto } from '../dtos/change-user-profile.dto';
import { DeleteUserUseCase } from '../../use-cases/delete.user.use-case';
import { UpdateUserUseCase } from '../../use-cases/update.user.use-case';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post('register')
  register(@Body() data: CreateUserRequestDto): Promise<UserEntity> {
    return this.createUserUseCase.create(data);
  }

  @Patch('disable/:id')
  disableUser(@Param('id') id: string): Promise<any> {
    return this.updateUserUseCase.disableUser(id);
  }

  @Patch('profile/:id')
  changeProfile(
    @Param('id') id: string,
    @Body() data: ChangeUserProfileRequestDto
  ) {
    return this.updateUserUseCase.updateUserProfile(id, data.profile);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.delete(id);
  }
}
