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
import { ContentWrapper } from '../../controls/ContentWrapper';
import { useNavigate } from 'react-router-dom';
import { reconnect } from '../../../services/common.request';
import dayjs from 'dayjs';
import { getUserInfo } from '../../../services/user.request';

interface IAuthenticationProvider {
   children?: React.ReactNode;
   authentication?: IAuthentication;
}

export const AuthenticationProvider: React.FC<IAuthenticationProvider> = (props) => {
   const [authentication, setAuthentication] = useState<IAuthentication|undefined>(props.authentication);
   const navigate = useNavigate();

   // const initConnect = async () => {
   //    let refreshToken = getRefreshToken();
   //    let accessToken = getAccessToken();
   //    let userInfo = getSessionStorageUserInfo();

   //    if (!accessToken) {
   //       if (refreshToken) {
   //          const response = await reconnect(refreshToken);
   //          if (response?.data) {
   //             setRefreshToken(response.data.refreshToken, response.data.refreshTokenExpireTime);
   //             setSessionStorageUserInfo(response.data.user);
   //             setAccessToken(response.data.accessToken, dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate());
   //             setAuthentication!({
   //                accessToken: response.data.accessToken,
   //                expireDate: dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate(),
   //                user: response.data.user,
   //             });
   //          }
   //       }
   //    } else {
   //       if (userInfo) {
   //          setAuthentication!({ accessToken: accessToken.token, expireDate: accessToken.expireDate, user: userInfo });
   //       } else {
   //          let response = await getUserInfo();
   //          if (response.isSuccess) {
   //             userInfo = response.data;
   //             setSessionStorageUserInfo(userInfo!);
   //             setAuthentication!({ accessToken: accessToken.token, expireDate: accessToken.expireDate, user: userInfo! });
   //          }
   //       }
   //    }
   // };

   // useEffect(() => {
   //    initConnect();
   // }, []);

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
