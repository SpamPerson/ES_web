export type Items = Array<{ [key: string]: any }>;

export interface IAuthenticationContext {
   authentication?: IAuthentication;
   setAuthentication?: (authentication: IAuthentication) => void;
   isLoding?: boolean;
   login?: (authentication: IAuthentication) => void;
   logout?: () => void;
}

export interface IAuthentication {
   accessToken: string;
   expireDate: Date;
   user: IUser;
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
   UserManager = 'admin',
}

export const enum DetailsListEdit {
   TextField = 'textField',
   Calendar = 'calednar',
   Choice = 'choice',
}

export const enum WordSearchColumn {
   EnWord = 'enWord',
   KrWord = 'krWord',
   Remarks = 'remarks',
}

export const enum SentenceSearchColumn {
   EnSentence = 'enSentence',
   KrSentence = 'krSentence',
   Remarks = 'remarks',
}

export const enum SentenceEditType {
   Update = 'update',
   Create = 'create',
}

export interface IColumn {
   key: string;
   name: string;
   width: string;
   fieldName?: string;
   editType?: DetailsListEdit;
   isInput?: boolean;
   placeholder?: string;
   fontSize?: number | string;
}

export interface IWord {
   wordCode?: number;
   userId: string;
   enWord: string;
   krWord: string;
   createDate: string;
   isMemorize?: string;
   remarks: string;
}

export interface IWordCount {
   totalWord: number;
   memorizeWord: number;
}

export interface ISentenceCount {
   totalSentence: number;
   memorizeSentence: number;
}

export interface ISentence {
   sentenceCode?: number;
   userId: string;
   enSentence: string;
   krSentence: string;
   createDate: string;
   isMemorize?: string;
   remarks?: string;
}

export interface IDetailsListUpdateContent {
   columnName: string;
   rowNum: number;
}

export interface IWordUpdate {
   wordCode: number;
   columnName: string;
   value: string;
}

export const enum MessageRoleType {
   Assistant = "assistant",
   User = "user"
}

export interface IAiMessage {
   role: MessageRoleType
   content: string;
}