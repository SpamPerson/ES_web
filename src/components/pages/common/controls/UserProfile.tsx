import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiSettings, FiUser } from 'react-icons/fi';

import { AuthenticationContext } from '../../../contexts/context';

import { Stack, StackItem } from '../../../styled.components';
import { IAuthenticationContext } from '../../../types';

interface PUserProfile {
   closePanel?: () => void;
}

export const UserProfile: React.FC<PUserProfile> = (props) => {

   const { authentication } = useContext<IAuthenticationContext>(AuthenticationContext);
   const navigate = useNavigate();

   const onClickLoginOrUserInfo = () => {
      if (authentication) {
         navigate('/changepassword');
      } else {
         navigate('/login');
      }
      props.closePanel!();
   };

   return (
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
   );
};
