import { IAuthentication, IWord } from '../components/types';
import { httpGet, httpPost } from './common.request';

export const getWordList = async (authentication: IAuthentication) => {
    try {
       return await httpGet('word/list', authentication);
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


