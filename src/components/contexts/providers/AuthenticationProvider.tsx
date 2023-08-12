import { useEffect, useState } from 'react';
import { AuthenticationContext } from '../context';
import { IAuthentication } from '../../types';
import { getAccessToken, getSessionStorageUserInfo, setAccessToken } from '../../../utils/common.utils';
import { SESSION_STORAGE_ACCESS_TOKEN_KEY } from '../../../constants/common.constants';

interface IAuthenticationProvider {
   children?: React.ReactNode;
}

export const AuthenticationProvider: React.FC<IAuthenticationProvider> = (props) => {
   const [authentication, setAutentication] = useState<IAuthentication>();
   const [isLogin, setIsLogin] = useState<boolean>(false);

   useEffect(() => {
      let newAuthentication: IAuthentication | undefined;
      let newIsLogin: boolean = false;
      const accessToken = getAccessToken();
      const user = getSessionStorageUserInfo();
      if (accessToken && user) {
         newAuthentication = { accessToken: accessToken.token, expireDate: accessToken.expireDate, user: user };
         newIsLogin = true;
      }
      setAutentication(newAuthentication);
      setIsLogin(newIsLogin);
   }, [window.sessionStorage.getItem(SESSION_STORAGE_ACCESS_TOKEN_KEY)]); // eslint-disable-line react-hooks/exhaustive-deps

   const login = (authentication: IAuthentication) => {
      setAutentication(authentication);
      setAccessToken(authentication.accessToken!, authentication.expireDate!);
      setIsLogin(true);
   };

   const logout = () => {};

   return (
      <AuthenticationContext.Provider value={{ authentication: authentication, isLogin: isLogin, login: login, logout: logout }}>
         {props.children}
      </AuthenticationContext.Provider>
   );
};
