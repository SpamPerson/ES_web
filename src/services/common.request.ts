import axios from 'axios';
import { ApiResult, IAuthentication } from '../components/types';
import dayjs from 'dayjs';
import { getRefreshToken, removeRefreshToken, setAccessToken, setRefreshToken, setSessionStorageUserInfo } from '../utils/common.utils';

const instance = axios.create({
   baseURL: process.env.REACT_APP_ES_API_URL,
});

export const reconnect = async (refreshToken?: string) => {
   try {
      const reconnect = await instance.get('/reconnect', {
         headers: {
            Authorization: `Basic ${refreshToken}`,
         },
      });
      if (reconnect) {
         return reconnect;
      }
   } catch (err) {
      removeRefreshToken();
   }
};

export const ensureClient = async (authentication: IAuthentication) => {
   if (dayjs(authentication.expireDate).isAfter(dayjs())) {
      return { Authorization: `Bearer ${authentication.accessToken}`, 'Access-Control-Allow-Origin': '*' };
   } else {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
         const response = await reconnect(refreshToken);
         if (response) {
            setRefreshToken(response?.data.refreshToken, response.data.refreshTokenExpireTime);
            setSessionStorageUserInfo(response?.data.user);
            setAccessToken(response?.data.accessToken, dayjs().add(response?.data.accessTokenExpireTime, 'millisecond').toDate());
            return { Authorization: `Bearer ${response?.data.accessToken}`, 'Access-Control-Allow-Origin': '*' };
         }
      }
   }
};

export const httpGet = async (url: string, authentication?: IAuthentication) => {
   const result: ApiResult = { isSuccess: false, statusText: '' };
   try {
      let headers;
      if (authentication) {
         headers = await ensureClient(authentication);
      }
      const response = await instance.get(url, { headers: headers });
      if (response.status === 200) {
         result.isSuccess = true;
         result.data = response.data;
      } else {
         result.status = response.status;
         result.statusText = response.statusText;
      }
      return result;
   } catch (err) {
      console.log(err);
      throw err;
   }
};

export const httpPost = async (url: string, data?: any, authentication?: IAuthentication) => {
   const result: ApiResult = { isSuccess: false, statusText: '' };
   try {
      let headers;
      if (authentication) {
         headers = await ensureClient(authentication);
      }
      const response = await instance.post(url, data, { headers: headers });
      if (response.status === 200) {
         result.isSuccess = true;
         result.data = response.data;
      } else {
         result.status = response.status;
         result.statusText = response.statusText;
      }
      return result;
   } catch (err) {
      return { isSuccess: false, statusText: '' };
   }
};

export const httpDelete = async (url: string, authentication?: IAuthentication) => {
   const result: ApiResult = { isSuccess: false, statusText: '' };
   try {
      let headers;
      if (authentication) {
         headers = await ensureClient(authentication);
      }
      const response = await instance.delete(url, { headers: headers });
      if (response.status === 200) {
         result.isSuccess = true;
         result.data = response.data;
      } else {
         result.status = response.status;
         result.statusText = response.statusText;
      }
      return result;
   } catch (err) {
      console.log(err);
      throw err;
   }
};

export const httpPatch = async (url: string, data?: any, authentication?: IAuthentication) => {
   const result: ApiResult = { isSuccess: false, statusText: '' };
   try {
      let headers;
      if (authentication) {
         headers = await ensureClient(authentication);
      }
      const response = await instance.patch(url, data, { headers: headers });
      if (response.status === 200) {
         result.isSuccess = true;
         result.data = response.data;
      } else {
         result.status = response.status;
         result.statusText = response.statusText;
      }
      return result;
   } catch (err) {
      console.log(err);
      throw err;
   }
};
