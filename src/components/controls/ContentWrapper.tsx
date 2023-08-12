import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import { AuthenticationContext } from '../contexts/context';
import { DisableWrapper, NavLoginLink, SidePanel, Stack, StackItem, TopNavStack } from '../styled.components';
import { IAuthenticationContext } from '../types';
import { useRecoilState } from 'recoil';
import { isPenalOpenState } from '../../recoil/common.recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface IContentWrapper {
   children?: React.ReactNode;
}

export const ContentWrapper: React.FC<IContentWrapper> = (props) => {
   const { authentication, logout } = useContext<IAuthenticationContext>(AuthenticationContext);
   const [isPenalOpen, setIsPenalOpen] = useRecoilState<boolean>(isPenalOpenState);

   const navigate = useNavigate();

   const onClickLoginOrUserInfo = () => {
      if (authentication) {
         navigate('/changepassword');
      } else {
         navigate('/login');
      }
      setIsPenalOpen(false);
   };

   return (
      <Stack style={{ overflow: 'hidden' }}>
         <TopNavStack $horizontal $verticalAlign="center" $horizontalAlign="center" style={{ width: '100%' }}>
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
         {isPenalOpen && (
            <>
               <DisableWrapper onClick={() => setIsPenalOpen(false)} />
               <SidePanel $position="left">
                  <Stack>
                     <Stack $horizontalAlign="end" style={{ padding: 5 }}>
                        <GrClose fontSize={20} style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setIsPenalOpen(false)} />
                     </Stack>
                  </Stack>

                  <Stack
                     $horizontalAlign="center"
                     $childrenGap={5}
                     style={{
                        marginTop: 20,
                        padding: 20,
                        width: '100%',
                        userSelect: 'none',
                        cursor: 'pointer',
                        backgroundColor: '#efefef',
                        borderRadius: 30,
                     }}
                     $styles={{ '&:hover': { color: 'rgb(52, 152, 219)' } }}
                     onClick={onClickLoginOrUserInfo}
                  >
                     {authentication && (
                        <StackItem $align="end">
                           <FiSettings />
                        </StackItem>
                     )}
                     <StackItem style={{ padding: 20, borderRadius: 100, backgroundColor: '#e0e0e0' }}>
                        <FiUser fontSize={40} />
                     </StackItem>
                     {authentication ? (
                        <>
                           <Stack $horizontal $verticalAlign="center" $childrenGap={10}>
                              <StackItem style={{ fontWeight: 'bold', fontSize: 20 }}>{authentication.user?.name}</StackItem>
                           </Stack>
                           <StackItem>{authentication.user?.mail}</StackItem>
                        </>
                     ) : (
                        <Stack style={{ marginTop: 20 }}>
                           <StackItem style={{ fontWeight: 'bold', fontSize: 20 }}>로그인 해주세요</StackItem>
                        </Stack>
                     )}
                  </Stack>
               </SidePanel>
            </>
         )}
         <Stack style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>{props.children}</Stack>
         <ToastContainer />
      </Stack>
   );
};
