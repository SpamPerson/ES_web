import { useContext, useEffect, useRef, useState } from 'react';
import { LoginButton, Stack, StackItem, TextField } from '../styled.components';
import { AuthenticationContext } from '../contexts/context';
import { useNavigate } from 'react-router-dom';
import { errorNotification, warningNotification } from '../../utils/notification.utils';
import { changePassword, requestLogin } from '../../services/user.request';
import { setRefreshToken } from '../../utils/common.utils';
import dayjs from 'dayjs';

export const ChangePasswordAuth: React.FC = () => {
   const { authentication, login } = useContext(AuthenticationContext);
   const [password, setPassword] = useState<string>('');
   const [passwordCheck, setPasswordCheck] = useState<string>('');
   const [isAuthPassword, setIsAuthPassword] = useState<boolean>(false);
   const passwordInputRef = useRef<HTMLInputElement>(null);
   const passwordCheckInputRef = useRef<HTMLInputElement>(null);
   const navigate = useNavigate();

   useEffect(() => {
      if (!authentication) {
         navigate('/');
      }
   }, [authentication]); // eslint-disable-line react-hooks/exhaustive-deps

   const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.currentTarget.value);
   };

   const onChangePasswordCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(event.currentTarget.value);
   };

   const onKeyDownLogin = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') onClickLogin();
   };

   const onClickLogin = async () => {
      if (isAuthPassword) {
         if (!checkStrongPassword(password)) {
            warningNotification('비밀번호는 특수문자 1개 이상, 대문자 1개 이상, 소문자 1개 이상, 8자리 이상으로 입력해 주세요');
            passwordInputRef.current?.focus();
         } else if (passwordCheck === '') {
            warningNotification('비밀번호를 확인을 입력해 주세요');
            passwordCheckInputRef.current?.focus();
         } else if (password !== passwordCheck) {
            warningNotification('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            passwordInputRef.current?.focus();
         } else {
            const response = await changePassword(authentication!, authentication?.user?.userId!, password);
            if (response.data) {
               navigate('/');
            } else {
               errorNotification("비밀번호 변경을 실패하였습니다.")
            }
         }
      } else {
         if (password === '') {
            warningNotification('비밀번호를 입력해 주세요');
            passwordInputRef.current?.focus();
         } else {
            const response = await requestLogin(authentication?.user?.userId!, password);
            if (response.isSuccess) {
               setRefreshToken(response.data.refreshToken, response.data.refreshTokenExpireTime);
               login!({
                  accessToken: response.data.accessToken,
                  expireDate: dayjs().add(response.data.accessTokenExpireTime, 'millisecond').toDate(),
                  user: response.data.user,
               });
               setIsAuthPassword(true);
               setPassword('');
            } else {
               errorNotification('비밀번호를 확인해 주세요', 'top-center');
               setPassword('');
            }
         }
      }
   };

   const checkStrongPassword = (password: string) => {
      const hasSpecialChar = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasEightChar = password.length > 7;
      return hasSpecialChar && hasUppercase && hasEightChar && hasLowercase;
   };

   return (
      <Stack $horizontal $horizontalAlign="center" $verticalAlign="center" style={{ height: '100%' }}>
         <Stack $horizontalAlign="center" $childrenGap={10} style={{ border: `1px solid #e0e0e0`, width: 400, height: 300 }}>
            <Stack $horizontal $horizontalAlign="center" $verticalAlign="center" style={{ height: 100 }}>
               <span style={{ fontSize: 24, fontWeight: 'bold', userSelect: 'none' }}>
                  {isAuthPassword ? '비밀번호 변경' : '비밀번호 인증'}
               </span>
            </Stack>
            <StackItem style={{ width: '300px' }}>
               <Stack $verticalAlign="space-between" style={{ gap: 10 }}>
                  <TextField
                     ref={passwordInputRef}
                     value={password}
                     type="password"
                     placeholder="비밀번호를 입력해 주세요"
                     onChange={onChangePassword}
                     onKeyDown={onKeyDownLogin}
                  />
                  {isAuthPassword && (
                     <TextField
                        ref={passwordCheckInputRef}
                        value={passwordCheck}
                        placeholder="비밀번호 확인"
                        type="password"
                        onChange={onChangePasswordCheck}
                        onKeyDown={onKeyDownLogin}
                     />
                  )}
                  <LoginButton onClick={onClickLogin}>{isAuthPassword ? '변경' : '인증'}</LoginButton>
               </Stack>
            </StackItem>
         </Stack>
      </Stack>
   );
};
