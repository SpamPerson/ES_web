import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthenticationContext } from '../../contexts/context';

import { successNotification, warningNotification } from '../../../utils/notification.utils';
import { findPassword } from '../../../services/user.request';
import { PageTitle, PrimaryButton, Stack, TextField } from '../../styled.components';


export const FindPassword: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [mail, setMail] = useState<string>('');
   const navigate = useNavigate();

   useEffect(() => {
      if (authentication) {
         navigate('/');
      }
   }, [authentication, navigate]);

   const onClickSendMail = async () => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(mail)) {
         warningNotification('이메일 형식이 아닙니다.');
      } else {
         successNotification('메일이 발송되었습니다. 메일을 확인해 주세요!', 'top-center');
         findPassword(mail);
      }
   };

   const onChangeMail = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMail(event.currentTarget.value);
   };

   return (
      <Stack style={{ width: '100%', height: '100%' }}>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', padding: 50 }}>
            <PageTitle>비밀번호 찾기</PageTitle>
         </Stack>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', gap: 10 }}>
            <TextField placeholder="가입할때 등록한 이메일을 입력해 주세요" style={{ width: 300 }} value={mail} onChange={onChangeMail} />
            <PrimaryButton style={{ width: 100 }} onClick={onClickSendMail}>
               전송
            </PrimaryButton>
         </Stack>
      </Stack>
   );
};
