import { useContext } from 'react';
import { Stack } from '../../../styled.components';
import { IAiMessage, MessageRoleType } from '../../../types';
import { AuthenticationContext } from '../../../contexts/context';

interface PConversation {
   item: IAiMessage;
}

export const ConversationBox: React.FC<PConversation> = (props) => {
   const { authentication } = useContext(AuthenticationContext);
   return (
      <Stack $horizontalAlign={props.item.role === MessageRoleType.Assistant ? 'start' : 'end'} $childrenGap={5} style={{ width: '100%' }}>
         <label style={{ fontWeight: 'bold' }}>{props.item.role === MessageRoleType.Assistant ? 'GPT' : authentication?.user.name}</label>
         <Stack style={{ border: '1px solid #e0e0e0', backgroundColor: '#ffffff', borderRadius: 5, padding: 8, maxWidth: '50%' }}>
            {props.item.content}
         </Stack>
      </Stack>
   );
};
