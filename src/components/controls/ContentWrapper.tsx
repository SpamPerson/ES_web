import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import { AuthenticationContext } from '../contexts/context';
import { DisableWrapper, NavLoginLink, SidePanel, Stack, TopNavStack } from '../styled.components';
import { IAuthenticationContext } from '../types';
import { useRecoilState } from 'recoil';
import { isPenalOpenState } from '../../recoil/common.recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProfile } from './UserProfile';
import { PanelMenu } from './PanelMenu';
interface IContentWrapper {
   children?: React.ReactNode;
}

export const ContentWrapper: React.FC<IContentWrapper> = (props) => {
   const { authentication, logout } = useContext<IAuthenticationContext>(AuthenticationContext);
   const [isPanelOpen, setIsPanelOpen] = useRecoilState<boolean>(isPenalOpenState);

   const navigate = useNavigate();

   return (
      <Stack style={{ overflow: 'hidden' }}>
         <TopNavStack $horizontal $verticalAlign="center" $horizontalAlign="center" style={{ width: '100%' }}>
            <FiMenu
               style={{ cursor: 'pointer', position: 'absolute', left: 10 }}
               fontSize={30}
               onClick={() => {
                  setIsPanelOpen(!isPanelOpen);
               }}
            />
            <Stack style={{ fontSize: 30, fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }} onClick={() => navigate('/')}>
               ES
            </Stack>
            {!authentication ? (
               <NavLoginLink $top={20} $right={20} onClick={() => navigate('/login')}>
                  로그인
               </NavLoginLink>
            ) : (
               <NavLoginLink $top={20} $right={20} onClick={logout}>
                  로그아웃
               </NavLoginLink>
            )}
         </TopNavStack>
         {isPanelOpen && (
            <>
               <DisableWrapper onClick={() => setIsPanelOpen(false)} />
               <SidePanel $position="left">
                  <Stack>
                     <Stack $horizontalAlign="end" style={{ padding: 5 }}>
                        <GrClose fontSize={20} style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setIsPanelOpen(false)} />
                     </Stack>
                  </Stack>
                  <UserProfile closePanel={() => setIsPanelOpen(false)} />
                  {authentication && <PanelMenu closePanel={() => setIsPanelOpen(false)} />}
               </SidePanel>
            </>
         )}
         <Stack style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>{props.children}</Stack>
         <ToastContainer />
      </Stack>
   );
};
