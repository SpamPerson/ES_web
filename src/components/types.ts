export interface IAuthenticationContext {
   authentication?: IAuthentication;
   isLogin?: boolean;
   login?: (authentication: IAuthentication) => void;
   logout?: () => void;
}

export interface IAuthentication {
   accessToken?: string;
   expiredTime?: Date;
   user?: IUser;
}

export interface IUser {
   name: string;
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

