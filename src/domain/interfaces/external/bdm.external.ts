export type IViewBdmUserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
};

export interface IBdmExternal {
  getBdmUserDataByEmail(email: string): Promise<IViewBdmUserData>;
}

export const IBdmExternal = Symbol('IBdmExternal');
