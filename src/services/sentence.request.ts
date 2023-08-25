import { IAuthentication, ISentence } from '../components/types';
import { httpGet, httpPost, httpPut } from './common.request';

export const getSentenceList = async (authentication: IAuthentication, searchColumn?: string, searchText?: string, orderBy?: string) => {
   try {
      const searchValue = searchText ? searchText : '@empty';
      const orderByValue = orderBy ? orderBy : 'ASC';
      return await httpGet(`sentence/list/${searchColumn}/${searchValue}/${orderByValue}`, authentication);
   } catch (err) {
      throw err;
   }
};

export const getSentenceCount = async (authentication: IAuthentication) => {
   try {
      return await httpGet('sentence/count', authentication);
   } catch (err) {
      throw err;
   }
};

export const saveSentence = async (authentication: IAuthentication, sentence: ISentence) => {
   try {
      return await httpPost('sentence', sentence, authentication);
   } catch (err) {
      throw err;
   }
};

export const deleteSentence = async (authentication: IAuthentication, seletecSentences: ISentence[]) => {
   try {
      return await httpPut('sentence/list',seletecSentences, authentication);
   } catch(err) {
      throw err;
   }
}
