import { useEffect, useState } from 'react';
import { AuthenticationContext } from '../context';
import { IAuthentication } from '../../types';
import {
   getAccessToken,
   getRefreshToken,
   getSessionStorageUserInfo,
   removeRefreshToken,
   setAccessToken,
   setRefreshToken,
   setSessionStorageUserInfo,
} from '../../../utils/common.utils';
import { SESSION_STORAGE_ACCESS_TOKEN_KEY } from '../../../constants/common.constants';
import { reconnect } from '../../../services/common.request';
import dayjs from 'dayjs';

interface IAuthenticationProvider {
   children?: React.ReactNode;
}

export const AuthenticationProvider: React.FC<IAuthenticationProvider> = (props) => {
   const [authentication, setAutentication] = useState<IAuthentication>();

   useEffect(() => {
      initConnect();
   }, []);

   useEffect(() => {
      let newAuthentication: IAuthentication | undefined;

      const accessToken = getAccessToken();
      const user = getSessionStorageUserInfo();
      if (accessToken && user) {
         newAuthentication = { accessToken: accessToken.token, expireDate: accessToken.expireDate, user: user };
      }
      setAutentication(newAuthentication);
   }, [window.sessionStorage.getItem(SESSION_STORAGE_ACCESS_TOKEN_KEY)]); // eslint-disable-line react-hooks/exhaustive-deps

   const login = (authentication: IAuthentication) => {
      setAutentication(authentication);
      setSessionStorageUserInfo(authentication.user!);
      setAccessToken(authentication.accessToken!, authentication.expireDate!);
   };

   const logout = () => {
      setAutentication(undefined);
      window.sessionStorage.clear();
      removeRefreshToken();
   };

   const initConnect = async () => {
      let refreshToken = getRefreshToken();
      const response = await reconnect(refreshToken);
      if (response?.data) {
         setRefreshToken(response.data.refreshToken, response.data.refreshTokenExpireTime);
         setSessionStorageUserInfo(response.data.user);
         setAccessToken(response.data.accessToken, dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate());
         setAutentication({
            accessToken: response.data.accessToken,
            expireDate: dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate(),
            user: response.data.user,
         });
      }
   };

   return (
      <AuthenticationContext.Provider value={{ authentication: authentication, login: login, logout: logout }}>
         {props.children}
      </AuthenticationContext.Provider>
   );
};
