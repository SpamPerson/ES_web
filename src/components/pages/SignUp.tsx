import { useRef, useState } from 'react';
import { PageTitle, PrimaryButton, Stack, TextField } from '../styled.components';
import { successNotification, warningNotification } from '../../utils/notification.utils';
import { checkUserId, checkUserMail, signUp } from '../../services/user.request';
import { useNavigate } from 'react-router-dom';

export const SignUp: React.FC = () => {
   const [userId, setUserId] = useState<string>('');
   const [name, setName] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [passwordCheck, setPasswordCheck] = useState<string>('');
   const [mail, setMail] = useState<string>('');
   const [isUserIdCheck, setIsUserIdCheck] = useState<boolean>(false);
   const userIdInputRef = useRef<HTMLInputElement>(null);
   const nameInputRef = useRef<HTMLInputElement>(null);
   const passwordInputRef = useRef<HTMLInputElement>(null);
   const passwordCheckInputRef = useRef<HTMLInputElement>(null);
   const mailInputRef = useRef<HTMLInputElement>(null);
   const navigate = useNavigate();

   const onChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
      const onlyEnglish = /[^A-Za-z0-9]/g;
      let newUserId: string = event.currentTarget.value;
      if (onlyEnglish.test(newUserId)) {
         warningNotification('아이디는 한글 또는 특수문자가 포함될 수 없습니다.');
      }
      setUserId(newUserId.replace(onlyEnglish, ''));
   };

   const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newName: string = event.currentTarget.value;
      setName(newName);
   };

   const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.currentTarget.value);
   };

   const onChangePasswordCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(event.currentTarget.value);
   };

   const onChangeMail = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMail(event.currentTarget.value);
   };

   const onClickUserIdCheck = async () => {
      if (!userId) {
         warningNotification('아이디를 입력해 주세요');
         userIdInputRef.current?.focus();
      } else if (userId.length <= 3) {
         warningNotification('아이디 길이를 4자리이상 입력해주세요');
         userIdInputRef.current?.focus();
      } else {
         const response = await checkUserId(userId);
         if (response.isSuccess) {
            if (!response.data) {
               successNotification('사용 가능한 아이디 입니다.');
               setIsUserIdCheck(true);
            } else {
               warningNotification('이미 존재하는 아이디 입니다.');
            }
         }
      }
   };

   const onClickSignUp = async() => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const nameReg = /[^A-Za-z가-힣]/g;
    
      if (userId === '') {
         warningNotification('아이디를 입력해 주세요');
         userIdInputRef.current?.focus();
      } else if (!isUserIdCheck) {
         warningNotification('아이디 중복확인을 해주세요');
         userIdInputRef.current?.focus();
      } else if (name === '') {
         warningNotification('이름을 입력해 주세요');
         nameInputRef.current?.focus();
      } else if (nameReg.test(name)) {
         warningNotification('이름은 특수문자나 숫자가 포함될 수 없습니다.');
         nameInputRef.current?.focus();
      } else if (password === '') {
         warningNotification('비밀번호를 입력해 주세요');
         passwordInputRef.current?.focus();
      } else if (passwordCheck === '') {
         warningNotification('비밀번호를 확인을 입력해 주세요');
         passwordCheckInputRef.current?.focus();
      } else if (mail === '') {
         warningNotification('이메일을 입력해 주세요');
         mailInputRef.current?.focus();
      } else if (!checkStrongPassword(password)) {
         warningNotification('비밀번호는 특수문자 1개 이상, 대문자 1개 이상, 소문자 1개 이상, 8자리 이상으로 입력해 주세요');
         passwordInputRef.current?.focus();
      } else if (password !== passwordCheck) {
         warningNotification('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
         passwordInputRef.current?.focus();
      } else if (!emailPattern.test(mail)) {
         warningNotification('이메일 형식이 잘못됬습니다.');
         mailInputRef.current?.focus();
      } else {
         const checkMail = await checkUserMail(mail);
         if(checkMail.data){
            warningNotification('이미 가입한 이메일 입니다.');
            mailInputRef.current?.focus();
         } else {
            signUp({userId: userId, mail: mail, name: name, password: password}).then(response => {
               if(response.isSuccess) {
                  successNotification("가입이 완료되었습니다. 로그인 해주세요")
                  navigate('/login');
               }
            })
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
      <Stack $horizontalAlign="center" style={{ height: '100%', width: '100%' }}>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', padding: 50 }}>
            <PageTitle>회원가입</PageTitle>
         </Stack>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', gap: 20 }}>
            <Stack style={{ width: 200, gap: 10 }}>
               <TextField
                  ref={userIdInputRef}
                  placeholder="아이디 입력"
                  value={userId}
                  onChange={onChangeUserId}
                  disabled={isUserIdCheck}
               />
               <TextField ref={nameInputRef} placeholder="이름 입력" value={name} onChange={onChangeName} />
               <TextField ref={passwordInputRef} type="password" placeholder="비밀번호" value={password} onChange={onChangePassword} />
               <TextField
                  ref={passwordCheckInputRef}
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChange={onChangePasswordCheck}
               />
               <TextField ref={mailInputRef} type="email" placeholder="이메일" value={mail} onChange={onChangeMail} required />
            </Stack>
            <Stack>
               <PrimaryButton
                  style={{ width: 100, backgroundColor: isUserIdCheck ? '#e0e0e0' : undefined }}
                  onClick={onClickUserIdCheck}
                  disabled={isUserIdCheck}
               >
                  중복확인
               </PrimaryButton>
            </Stack>
         </Stack>
         <Stack $horizontal $horizontalAlign="center" style={{ width: '100%', paddingTop: 50 }}>
            <PrimaryButton style={{ width: 100 }} onClick={onClickSignUp}>
               가입
            </PrimaryButton>
         </Stack>
      </Stack>
   );
};
