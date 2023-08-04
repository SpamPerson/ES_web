import { useNavigate } from 'react-router-dom';
import { Link, LoginButton, Stack, StackItem, TextField } from '../styled.components';

export const Login: React.FC = () => {
   const navigate = useNavigate();
   const onClickLogin = () => {
      
   }

   return (
      <Stack horizontal horizontalAlign="center" verticalAlign="center" style={{ width: '100%', height: '100%' }}>
         <Stack horizontalAlign="center" style={{ border: `1px solid #e0e0e0`, width: 400, height: 300 }}>
            <Stack horizontal horizontalAlign="center" verticalAlign="center" style={{ height: 100 }}>
               <span style={{ fontSize: 24, fontWeight: 'bold', userSelect:'none' }}>ES</span>
            </Stack>
            <Stack horizontal horizontalAlign="center" style={{ height: 200 }}>
               <StackItem style={{ width: '300px' }}>
                  <Stack style={{ gap: 10 }}>
                     <TextField placeholder="아이디를 입력해 주세요" />
                     <TextField type='password' placeholder="비밀번호를 입력해 주세요"/>
                     <LoginButton onClick={onClickLogin}>로그인</LoginButton>
                  </Stack>
                  <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ height: 50 }}>
                     <Link onClick={() => navigate('/findpassword')}>비밀번호 찾기</Link>
                     <Link onClick={() => navigate('/signup')}>회원가입</Link>
                  </Stack>
               </StackItem>
            </Stack>
         </Stack>
      </Stack>
   );
};
