import { useNavigate } from 'react-router-dom';
import { DefaultButton, Stack, StackItem } from '../styled.components';

export const Home: React.FC = () => {
   const navigate = useNavigate();

   return (
      <Stack $verticalAlign="center" $horizontalAlign="center" $horizontal style={{ backgroundColor: '#f2df88', height: '100%' }}>
         <Stack>
            <StackItem style={{ fontSize: 40, fontWeight: 'bold' }}>영단어 암기와 영문장 암기 Tools!</StackItem>
            <StackItem align="center" style={{ fontSize: 40, fontWeight: 'bold' }}>
               ES(English Study)
            </StackItem>
            <Stack $horizontal $horizontalAlign="center" style={{ paddingTop: 50 }}>
               <DefaultButton style={{ fontWeight: 'bold', width: 200, fontSize: 15 }} onClick={() => navigate('/login')}>
                  Get Start
               </DefaultButton>
            </Stack>
         </Stack>
      </Stack>
   );
};
