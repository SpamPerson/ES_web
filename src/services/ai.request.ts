import { IAiMessage, IAuthentication } from '../components/types';
import { httpPost } from './common.request';

export const gptQuestion = async (authentication: IAuthentication, messages: IAiMessage[]) => {
   try {
      return await httpPost('ai/question', messages, authentication);
   } catch (err) {
      throw err;
   }
};
