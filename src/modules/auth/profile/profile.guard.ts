import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchProfile(profile: string[], userProfile: string) {
    return profile.some((profile) => profile === userProfile);
  }

  canActivate(context: ExecutionContext): boolean {
    const profile = this.reflector.get<string[]>('profile', context.getHandler());
    if (!profile) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchProfile(profile, user.profile);
  }
}
