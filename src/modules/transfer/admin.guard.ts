import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '@/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
    
    if (!isAuthenticated) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    console.log('user', user);
    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Acesso permitido apenas para administradores');
    }
    
    return true;
  }
}