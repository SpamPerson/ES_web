import { useState } from 'react';
import { AuthenticationContext } from '../context';
import { IToken, IUser } from '../../types';

interface IAuthenticationProvider {
   children?: React.ReactNode;
}

export const AuthenticationProvider: React.FC<IAuthenticationProvider> = (props) => {
   const [isLogin, setIsLogin] = useState<boolean>(false);
   const [tokens, setTokens] = useState<IToken>();
   const [userInfo, setUserInfo] = useState<IUser>();

   const setToken = () => {

   };

   return (
      <AuthenticationContext.Provider value={{ isLogin: isLogin, tokens: tokens, setTokens: setToken, userInfo: userInfo }}>
         {props.children}
      </AuthenticationContext.Provider>
   );
};
