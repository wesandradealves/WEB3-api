import { IViewBdmUserData } from '@/domain/interfaces/external/bdm.external';

export interface IGetBdmUserByEmailUseCase {
  execute(email: string): Promise<IViewBdmUserData>;
}
export const IGetBdmUserByEmailUseCase = Symbol('IGetBdmUserByEmailUseCase');
