import { IAuthentication, IWord, IWordUpdate } from '../components/types';
import { httpGet, httpPatch, httpPost, httpPut } from './common.request';

export const getWordList = async (authentication: IAuthentication, searchText: string, searchColumn: string, currentPage:number) => {
   try {

      return await httpGet(`word/list/${searchColumn}/${currentPage}?searchText=${searchText}`, authentication);
   } catch (err) {
      throw err;
   }
};

export const getWordCount = async (authentication: IAuthentication) => {
   try {
      return await httpGet('word/count',authentication);
   } catch (err) {
      throw err;
   }
}

export const updateWord = async (authentication: IAuthentication, changeInfo: IWordUpdate) => {
   try {
      return await httpPatch('word', changeInfo, authentication);
   } catch (err) {
      throw err;
   }
};

export const saveWord = async (authentication: IAuthentication, word: IWord) => {
   try {
      return await httpPost('/word', word, authentication);
   } catch (err) {
      throw err;
   }
};

export const deleteWords = async (authentication: IAuthentication, words: IWord[]) => {
   try {
      return await httpPut('/word/list', words, authentication);
   } catch (err) {
      throw err;
   }
}
