import { useContext } from 'react';

import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import { AuthenticationContext } from '../contexts/context';
import { DisableWrapper, NavLoginLink, SidePanel, Stack, TopNavStack } from '../styled.components';
import { IAuthentication, IAuthenticationContext } from '../types';
import { useRecoilState } from 'recoil';
import { isPenalOpenState } from '../../recoil/common.recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProfile } from './UserProfile';
import { PanelMenu } from './PanelMenu';
import { Home } from '../pages/Home';
import { ChangePasswordAuth } from '../pages/ChangePasswordAuth';
import { WordWrapper } from '../pages/WordWrapper';
import { Login } from '../pages/Login';
import { SignUp } from '../pages/SignUp';
import { FindPassword } from '../pages/FindPassword';
import { SentenceWrapper } from '../pages/SentenceWrapper';

interface IContentWrapper {
   children?: React.ReactNode;
   authentication?: IAuthentication;
}

export const ContentWrapper: React.FC<IContentWrapper> = (props) => {
   const { logout } = useContext<IAuthenticationContext>(AuthenticationContext);
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
            {!props.authentication ? (
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
                  {props.authentication && <PanelMenu closePanel={() => setIsPanelOpen(false)} />}
               </SidePanel>
            </>
         )}
         <Stack style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
            <Routes>
               {/* <Route path="*" element={<Navigate to={'/login'} />} /> */}
               <Route path="" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<SignUp />} />
               <Route path="/findpassword" element={<FindPassword />} />
               {props.authentication && (
                  <>
                     <Route path="/changepassword" element={<ChangePasswordAuth />} />
                     <Route path="/word" element={<WordWrapper />} />
                     <Route path="/sentence" element={<SentenceWrapper />} />
                  </>
               )}
            </Routes>
         </Stack>
         <ToastContainer />
      </Stack>
   );
};
