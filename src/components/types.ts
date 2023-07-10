export interface IAuthenticationContext {
   tokens?: IToken;
   userInfo?: IUser;
   isLogin?: boolean;
   setTokens?: () => void;
   logout?: () => void;
}

export interface IUser {
   name: string;
}

export interface IToken {
   accessToken?: string;
   expiredTime?: Date;
}
