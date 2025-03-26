import { ProfileUserEnum } from "@/domain/commons/enum/profile.user.enum";
import { IViewUser } from "@/domain/types/user";

export class ViewUserDto implements IViewUser{
    name: string;
    email: string;
    cpfCnpj: string;
    passport: string;
    userBdmId: number;
    userMarketId: string;
    profile: ProfileUserEnum;
    isAdmin: boolean;
    isActive: boolean;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}