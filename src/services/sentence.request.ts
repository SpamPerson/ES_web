import { IAuthentication } from '../components/types';
import { httpGet } from './common.request';

export const getSentenceList = async (authentication: IAuthentication, searchColumn?: string, searchText?: string, orderBy?: string) => {
   try {
      const searchValue = searchText ? searchText : '@empty';
      const orderByValue = orderBy ? orderBy : 'ASC';
      return await httpGet(`sentence/list/${searchColumn}/${searchValue}/${orderByValue}`, authentication);
   } catch (err) {
      throw err;
   }
};
