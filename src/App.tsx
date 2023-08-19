import { useState } from 'react';
import './App.css';
import {
   getAccessToken,
   getRefreshToken,
   getSessionStorageUserInfo,
   setAccessToken,
   setRefreshToken,
   setSessionStorageUserInfo,
} from './utils/common.utils';
import { reconnect } from './services/common.request';
import dayjs from 'dayjs';
import { getUserInfo } from './services/user.request';
import { AuthenticationProvider } from './components/contexts/providers/AuthenticationProvider';
import { IAuthentication } from './components/types';

const App = () => {
   const [authentication] = useState<IAuthentication | undefined>(() => {
      let refreshToken = getRefreshToken();
      let accessToken = getAccessToken();
      let userInfo = getSessionStorageUserInfo();
      if (!accessToken) {
         if (refreshToken) {
            reconnect(refreshToken).then((response) => {
               if (response?.data) {
                  setRefreshToken(response.data.refreshToken, response.data.refreshTokenExpireTime);
                  setSessionStorageUserInfo(response.data.user);
                  setAccessToken(response.data.accessToken, dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate());
                  return {
                     accessToken: response.data.accessToken,
                     expireDate: dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate(),
                     user: response.data.user,
                  };
               }
            });
         }
      } else {
         if (userInfo) {
            return { accessToken: accessToken.token, expireDate: accessToken.expireDate, user: userInfo };
         } else {
            getUserInfo().then((response) => {
               if (response.isSuccess) {
                  userInfo = response.data;
                  setSessionStorageUserInfo(userInfo!);
                  return { accessToken: accessToken?.token, expireDate: accessToken?.expireDate, user: userInfo! };
               }
            });
         }
      }
      return undefined;
   });

   return (
      <div className="App">
         <AuthenticationProvider authentication={authentication} />
      </div>
   );
};

export default App;
