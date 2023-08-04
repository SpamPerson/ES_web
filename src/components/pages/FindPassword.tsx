import { PageTitle, PrimaryButton, Stack, TextField } from '../styled.components';

export const FindPassword: React.FC = () => {
   return (
      <Stack style={{ width: '100%', height: '100%' }}>
         <Stack horizontal horizontalAlign="center" style={{ width: '100%', padding: 50 }}>
            <PageTitle>비밀번호 찾기</PageTitle>
         </Stack>
         <Stack horizontal horizontalAlign="center" style={{ width: '100%', gap:10 }}>
            <TextField placeholder="가입할때 등록한 이메일을 입력해 주세요" style={{ width: 300 }} />
            <PrimaryButton style={{ width: 100 }}>전송</PrimaryButton>
         </Stack>
      </Stack>
   );
};
