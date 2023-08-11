import { useEffect, useState } from 'react';
import { AuthenticationContext } from '../context';
import { IAuthentication, IToken, IUser } from '../../types';

interface IAuthenticationProvider {
   children?: React.ReactNode;
}

export const AuthenticationProvider: React.FC<IAuthenticationProvider> = (props) => {
   const [authentication, setAutentication] = useState<IAuthentication>();
   const [isLogin, setIsLogin] = useState<boolean>(false);

   useEffect(()=> {

   },[])


   const login = (authentication: IAuthentication) => {

   };

   const logout = () => {

   }

   return (
      <AuthenticationContext.Provider value={{ authentication: authentication, isLogin: isLogin, login: login, logout: logout }}>
         {props.children}
      </AuthenticationContext.Provider>
   );
};
