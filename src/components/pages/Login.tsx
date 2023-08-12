import { useNavigate } from 'react-router-dom';
import { Link, LoginButton, Stack, StackItem, TextField } from '../styled.components';
import React, { useContext, useRef, useState } from 'react';
import { AuthenticationContext } from '../contexts/context';
import { warningNotification } from '../../utils/notification.utils';
import { requestLogin } from '../../services/user.request';
import { setRefreshToken } from '../../utils/common.utils';
import dayjs from 'dayjs';

export const Login: React.FC = () => {
   const { login } = useContext(AuthenticationContext);
   const [userId, setUserId] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const navigate = useNavigate();
   const userIdInputRef = useRef<HTMLInputElement>(null);
   const passwordInputRef = useRef<HTMLInputElement>(null);

   const onClickLogin = async () => {
      if (userId === '') {
         warningNotification('아이디를 입력해 주세요');
         userIdInputRef.current?.focus();
      } else if (password === '') {
         warningNotification('비밀번호를 입력해 주세요');
         passwordInputRef.current?.focus();
      } else {
         const response = await requestLogin(userId, password);
         if (response.isSuccess) {
            setRefreshToken(response.data.refreshToken, response.data.refreshTokenExpireTime);
            console.log(response.data);
            login!({
               accessToken: response.data.accessToken,
               expireDate: dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate(),
               user: response.data.user,
            });
         }
      }
   };
   const onChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserId(event.currentTarget.value);
   };

   const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.currentTarget.value);
   };

   return (
      <Stack $horizontal $horizontalAlign="center" $verticalAlign="center" style={{ width: '100%', height: '100%' }}>
         <Stack $horizontalAlign="center" style={{ border: `1px solid #e0e0e0`, width: 400, height: 300 }}>
            <Stack $horizontal $horizontalAlign="center" $verticalAlign="center" style={{ height: 100 }}>
               <span style={{ fontSize: 24, fontWeight: 'bold', userSelect: 'none' }}>ES</span>
            </Stack>
            <Stack $horizontal $horizontalAlign="center" style={{ height: 200 }}>
               <StackItem style={{ width: '300px' }}>
                  <Stack style={{ gap: 10 }}>
                     <TextField ref={userIdInputRef} placeholder="아이디를 입력해 주세요" onChange={onChangeUserId} />
                     <TextField ref={passwordInputRef} type="password" placeholder="비밀번호를 입력해 주세요" onChange={onChangePassword} />
                     <LoginButton onClick={onClickLogin}>로그인</LoginButton>
                  </Stack>
                  <Stack $horizontal $horizontalAlign="space-between" $verticalAlign="center" style={{ height: 50 }}>
                     <Link onClick={() => navigate('/findpassword')}>비밀번호 찾기</Link>
                     <Link onClick={() => navigate('/signup')}>회원가입</Link>
                  </Stack>
               </StackItem>
            </Stack>
         </Stack>
      </Stack>
   );
};
