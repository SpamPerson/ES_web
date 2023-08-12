export interface IAuthenticationContext {
   authentication?: IAuthentication;
   login?: (authentication: IAuthentication) => void;
   logout?: () => void;
}

export interface IAuthentication {
   accessToken?: string;
   expireDate?: Date;
   user?: IUser;
}

export interface IUser {
   name: string;
   mail: string;
   userId: string;
   password?: string;
}

export interface IToken {
   accessToken?: string;
   expiredTime?: Date;
}

/**
 * * Axios 결과
 */
export interface ApiResult {
   isSuccess: boolean;
   data?: any;
   status?: number;
   statusText: string;
}
