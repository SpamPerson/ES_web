import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import { AuthenticationContext } from '../contexts/context';
import { DisableWrapper, NavLoginLink, SidePanel, Stack, TopNavStack } from '../styled.components';
import { IAuthenticationContext } from '../types';
import { useRecoilState } from 'recoil';
import { isPenalOpenState } from '../recoil/common.recoil';

interface IContentWrapper {
   children?: React.ReactNode;
}

export const ContentWrapper: React.FC<IContentWrapper> = (props) => {
   const { isLogin } = useContext<IAuthenticationContext>(AuthenticationContext);
   const [isPenalOpen, setIsPenalOpen] = useRecoilState<boolean>(isPenalOpenState);

   const navigate = useNavigate();

   return (
      <Stack style={{ overflow: 'hidden' }}>
         <TopNavStack horizontal verticalAlign="center" horizontalAlign="center" style={{ width: '100%' }}>
            <FiMenu
               style={{ cursor: 'pointer', position: 'absolute', left: 10 }}
               fontSize={30}
               onClick={() => {
                  setIsPenalOpen(!isPenalOpen);
               }}
            />
            <Stack style={{ fontSize: 30, fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }} onClick={() => navigate('/')}>
               ES
            </Stack>
            {!isLogin && (
               <NavLoginLink top={20} right={20} onClick={() => navigate('/login')}>
                  로그인
               </NavLoginLink>
            )}
         </TopNavStack>
         {isPenalOpen && (
            <>
               <DisableWrapper onClick={() => setIsPenalOpen(false)} />
               <SidePanel position="left">
                  <Stack horizontalAlign="center">
                     <Stack horizontal horizontalAlign="end" style={{ padding: 5 }}>
                        <GrClose fontSize={20} style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setIsPenalOpen(false)} />
                     </Stack>
                  </Stack>
               </SidePanel>
            </>
         )}
         <Stack style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>{props.children}</Stack>
      </Stack>
   );
};
