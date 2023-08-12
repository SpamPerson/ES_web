import * as CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import {
   COOKIE_REFRESH_TOKEN,
   ENCRY_KEY,
   SESSION_STORAGE_ACCESS_TOKEN_EXPIREDATE_KEY,
   SESSION_STORAGE_ACCESS_TOKEN_KEY,
   SESSION_STORAGE_USER_KEY,
} from '../constants/common.constants';
import dayjs from 'dayjs';
import { IUser } from '../components/types';

export const decrypt = (data: any) => {
   const decryptData = CryptoJS.AES.decrypt(data, ENCRY_KEY).toString();
   return decryptData;
};

export const encrypt = (data: any) => {
   const encryptData = CryptoJS.AES.encrypt(data, ENCRY_KEY).toString();
   return encryptData;
};

export const getRefreshToken = () => {
   const refreshToken = Cookies.get(COOKIE_REFRESH_TOKEN);
   let token;
   if (refreshToken) {
      token = decrypt(refreshToken);
   }
   return token;
};

export const getAccessToken = () => {
   let token = window.sessionStorage.getItem(SESSION_STORAGE_ACCESS_TOKEN_KEY); 
   let expiredTime = window.sessionStorage.getItem(SESSION_STORAGE_ACCESS_TOKEN_EXPIREDATE_KEY);
   if (token && expiredTime) {
      return { token: decrypt(token), expireDate: dayjs(expiredTime).toDate() };
   } else {
      return undefined;
   }
};

export const getSessionStorageUserInfo = () => {
   let user: IUser = JSON.parse(window.sessionStorage.getItem(SESSION_STORAGE_USER_KEY)!);
   if (user) {
      return user;
   } else {
      return undefined;
   }
};

export const setRefreshToken = async (token: string, expireTime: number) => {
   Cookies.set(COOKIE_REFRESH_TOKEN, encrypt(token), { expires: dayjs().add(expireTime).toDate() });
};

export const setSessionStorageUserInfo = async (user: IUser) => {
   window.sessionStorage.setItem(SESSION_STORAGE_USER_KEY, JSON.stringify(user));
};

export const setAccessToken = async (accessToken: string, expireDate: Date) => {
   window.sessionStorage.setItem(SESSION_STORAGE_ACCESS_TOKEN_KEY, encrypt(accessToken));
   window.sessionStorage.setItem(SESSION_STORAGE_ACCESS_TOKEN_EXPIREDATE_KEY, dayjs(expireDate).toString());
};

export const removeRefreshToken = () => {
   Cookies.remove(COOKIE_REFRESH_TOKEN);
};
