
export interface IAuthenticationContext {
    accessToken?:string;
    expiredTime?: Date;
    userInfo?:IUser;
}

export interface IUser {
    name:string
}