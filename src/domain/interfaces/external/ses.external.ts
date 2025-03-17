export interface ISESExternal {
  dispathEmail(request: any): Promise<void>;
}

export const ISESExternal = Symbol('ISESExternal');
 