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

export const setRefreshToken = async(token: string, expiredTime: number) => {
   Cookies.set(COOKIE_REFRESH_TOKEN, encrypt(token), { expires: dayjs().add(expiredTime).toDate() });
};

export const setSessionStorageUserInfo = async(user: IUser) => {
   window.sessionStorage.setItem(SESSION_STORAGE_USER_KEY, JSON.stringify(user));
};

export const setAccessToken = async(accessToken: string, expiredTime: number) => {
   window.sessionStorage.setItem(SESSION_STORAGE_ACCESS_TOKEN_KEY, encrypt(accessToken));
   window.sessionStorage.setItem(SESSION_STORAGE_ACCESS_TOKEN_EXPIREDATE_KEY, dayjs().add(expiredTime).toString());
};

export const removeRefreshToken = () => {
    Cookies.remove(COOKIE_REFRESH_TOKEN);
}