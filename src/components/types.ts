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
   roles?: IRole[];
}

export interface IRole {
   roleCode: string;
   name: RoleName;
   description?: string;
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

export const enum RoleName {
   Admin = 'ROLE_ADMIN',
   User = 'ROLE_USER',
}

export const enum MenuType {
   Word = 'word',
   Sentence = 'sentence',
   Ai = 'ai',
   UserManager = 'userManager',
}

export interface IColumn {
   key:string,
   name: string,
   width: string,
   fieldName?: string,
}
