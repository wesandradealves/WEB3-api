import { Body, Controller, Delete, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../use-cases/create.user.use-case';
import { CreateUserRequestDto } from '../dtos/create-user.request.dto';
import { UserEntity } from '@/domain/entities/user.entity';
import { ChangeUserProfileRequestDto } from '../dtos/change-user-profile.dto';
import { DeleteUserUseCase } from '../../use-cases/delete.user.use-case';
import { UpdateUserUseCase } from '../../use-cases/update.user.use-case';
import { ICreateUserUseCase } from '@/domain/interfaces/use-cases/user/create.user.use-case';
import { IDeleteUserUseCase } from '@/domain/interfaces/use-cases/user/delete.user.use-case';
import { IUpdateUseCase } from '@/domain/interfaces/use-cases/user/update.user.use-case';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(ICreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(IDeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase,
    @Inject(IUpdateUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'This endpoint allows you to register a new user in the system.'
  })
  register(@Body() data: CreateUserRequestDto): Promise<UserEntity> {
    return this.createUserUseCase.execute(data);
  }

  @Patch('disable/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Disable a user',
    description: 'This endpoint allows you to disable a user in the system.'
  })
  disableUser(@Param('id') id: string): Promise<any> {
    return this.updateUserUseCase.execute(id);
  }

  @Patch('profile/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Change user profile',
    description: 'This endpoint allows you to change the profile of a user in the system.'
  })
  changeProfile(
    @Param('id') id: string,
    @Body() data: ChangeUserProfileRequestDto
  ) {
    return this.updateUserUseCase.execute(id, data.profile);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Delete a user',
    description: 'This endpoint allows you to delete a user from the system.'
  })
  deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
