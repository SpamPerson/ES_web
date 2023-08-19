import { ApiResult, IAuthentication, IUser } from '../components/types';
import { httpGet, httpPost } from './common.request';

export const requestLogin = async (userId: string, password: string): Promise<ApiResult> => {
   try {
      return await httpPost('/user/login', { userId: userId, password: password });
   } catch (err) {
      throw err;
   }
};

export const checkUserId = async (userId: string): Promise<ApiResult> => {
   try {
      return await httpGet(`/user/check/id/${userId}`);
   } catch (err) {
      throw err;
   }
};

export const findPassword = async (mail: string): Promise<ApiResult> => {
   try {
      return await httpPost('/user/findpassword', { mail: mail });
   } catch (err) {
      throw err;
   }
};

export const changePassword = async (authentication: IAuthentication, userId: string, password: string): Promise<ApiResult> => {
   try {
      return await httpPost('/user/password/change', { userId: userId, password: password }, authentication);
   } catch (err) {
      throw err;
   }
};

export const checkUserMail = async (mail: string): Promise<ApiResult> => {
   try {
      return await httpGet(`/user/check/mail/${mail}`);
   } catch (err) {
      throw err;
   }
};

export const getUserInfo = async (): Promise<ApiResult> => {
   try {
      return await httpGet(`/user/info`);
   } catch (err) {
      throw err;
   }
}

export const signUp = async (user: IUser): Promise<ApiResult> => {
   try {
      return await httpPost(`/user/signup`, user);
   } catch (err) {
      throw err;
   }
};
