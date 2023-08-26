import { useEffect, useState } from 'react';
import { AuthenticationContext } from '../context';
import { IAuthentication } from '../../types';
import {
   getAccessToken,
   getSessionStorageUserInfo,
   removeRefreshToken,
   setAccessToken,
   setSessionStorageUserInfo,
} from '../../../utils/common.utils';
import { SESSION_STORAGE_ACCESS_TOKEN_KEY } from '../../../constants/common.constants';
import { ContentWrapper } from '../../pages/common/controls/ContentWrapper';
import { useNavigate } from 'react-router-dom';


interface IAuthenticationProvider {
   children?: React.ReactNode;
   authentication?: IAuthentication;
}

export const AuthenticationProvider: React.FC<IAuthenticationProvider> = (props) => {
   const [authentication, setAuthentication] = useState<IAuthentication|undefined>(props.authentication);
   const navigate = useNavigate();

   useEffect(() => {
      let newAuthentication: IAuthentication | undefined;
      const accessToken = getAccessToken();
      const user = getSessionStorageUserInfo();
      if (accessToken && user) {
         newAuthentication = { accessToken: accessToken.token, expireDate: accessToken.expireDate, user: user };
      }
      setAuthentication(newAuthentication!);
   }, [window.sessionStorage.getItem(SESSION_STORAGE_ACCESS_TOKEN_KEY)]); // eslint-disable-line react-hooks/exhaustive-deps

   const login = (authentication: IAuthentication) => {
      setAuthentication(authentication);
      setSessionStorageUserInfo(authentication.user!);
      setAccessToken(authentication.accessToken!, authentication.expireDate!);
   };

   const logout = () => {
      setAuthentication(undefined);
      window.sessionStorage.clear();
      removeRefreshToken();
      navigate('/login');
   };

   return (
      <AuthenticationContext.Provider
         value={{ authentication: authentication, login: login, logout: logout, setAuthentication: setAuthentication }}
      >
         <ContentWrapper authentication={authentication} />
      </AuthenticationContext.Provider>
   );
};
