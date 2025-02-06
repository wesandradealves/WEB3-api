export interface ISESProvider {
  dispatchEmail(request: any): Promise<void>;
}

export const ISESProvider = Symbol('ISESProvider');
