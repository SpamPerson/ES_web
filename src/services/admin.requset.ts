import { IAuthentication, IUser } from '../components/types';
import { httpGet, httpPost, httpPut } from './common.request';

export const getUsers = async (authentication: IAuthentication, searchColumn: string, searchText: string, pageNum: number) => {
   try {
      return await httpGet(`/admin/user/list/${searchColumn}/${pageNum}?searchText=${searchText}`, authentication);
   } catch (err) {
      throw err;
   }
};

export const usersDisable = async (authentication:IAuthentication, users:IUser[]) => {
    try {
        return await httpPost(`/admin/user/list/disable`, users, authentication);
    } catch (err) {
        throw err;
    }
}

export const usersActive = async (authentication:IAuthentication, users:IUser[]) => {
    try{
        return await httpPost(`/admin/user/list/active`, users, authentication);
    } catch(err) {
        throw err;
    }
}

export const usersDelete = async (authentication:IAuthentication, users:IUser[]) => {
    try {
        return await httpPut(`/admin/user/list`, users, authentication);
    } catch(err) {
        throw err;
    }
}
