import { ApiResult } from '../components/types';
import { httpPost } from './common.request';

export const requestLogin = async (userId: string, password: string): Promise<ApiResult> => {
   return await httpPost('/user/login', { userId: userId, password: password });
};
