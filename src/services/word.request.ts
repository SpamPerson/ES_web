import { IAuthentication, IWordUpdate } from '../components/types';
import { httpGet, httpPatch } from './common.request';

export const getWordList = async (authentication: IAuthentication, searchText?: string, searchColumn?: string, orderBy?: string) => {
   try {
      const searchValue = searchText ? searchText : '@empty';
      const orderByValue = orderBy ? orderBy : 'ASC';
      return await httpGet(`word/list/${searchColumn}/${searchValue}/${orderByValue}`, authentication);
   } catch (err) {
      throw err;
   }
};

export const updateWord = async (authentication: IAuthentication, changeInfo: IWordUpdate) => {
   try {
      return await httpPatch('word', changeInfo, authentication);
   } catch (err) {
      throw err;
   }
};

export const saveWord = async (authentication: IAuthentication) => {
   try {
      //   return await httpPost('/word', , authentication);
   } catch (err) {
      throw err;
   }
};
