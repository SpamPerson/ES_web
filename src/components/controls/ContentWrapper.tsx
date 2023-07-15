import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/context';
import { NavLoginLink, Stack, TopNavStack } from '../styled.components';
import { IAuthenticationContext } from '../types';

interface IContentWrapper {
   children?: React.ReactNode;
}

export const ContentWrapper: React.FC<IContentWrapper> = (props) => {
   const { isLogin } = useContext<IAuthenticationContext>(AuthenticationContext);
   const navigate = useNavigate();

   return (
      <Stack style={{ overflow: 'hidden' }}>
         <TopNavStack horizontal verticalAlign="center" horizontalAlign="center" style={{ width: '100%' }}>
            <Stack>Logo</Stack>
            {!isLogin && (
               <NavLoginLink top={20} right={20} onClick={() => navigate('/login')}>
                  로그인
               </NavLoginLink>
            )}
         </TopNavStack>
         <Stack style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>{props.children}</Stack>
      </Stack>
   );
};
