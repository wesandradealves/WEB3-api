import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
export class RefreshJwtAuthGuard extends AuthGuard('RefreshJWT') {}
export class JwtAuthGuardOwner extends AuthGuard('jwt-owner') {}
