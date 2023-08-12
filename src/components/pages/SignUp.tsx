import React from 'react';
import { PageTitle, PrimaryButton, Stack, TextField } from '../styled.components';

export const SignUp: React.FC = () => {
   return (
      <Stack $horizontalAlign="center" style={{ height: '100%', width: '100%' }}>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', padding: 50 }}>
            <PageTitle>회원가입</PageTitle>
         </Stack>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', gap: 20 }}>
            <Stack style={{ width: 200, gap: 10 }}>
               <TextField placeholder="아이디 입력" />
               <TextField type="password" placeholder="비밀번호" />
               <TextField type="password" placeholder="비밀번호 확인" />
               <TextField placeholder="이메일" />
            </Stack>
            <Stack>
               <PrimaryButton style={{ width: 100 }}>중복확인</PrimaryButton>
            </Stack>
         </Stack>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', paddingTop: 50 }}>
            <PrimaryButton style={{ width: 100 }}>가입</PrimaryButton>
         </Stack>
      </Stack>
   );
};
