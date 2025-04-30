import { SetMetadata } from "@nestjs/common";

export const Profile = ( ...args: string[]) => SetMetadata('profile', args)