import { BsExclamationCircle } from 'react-icons/bs';

import { Stack } from '../../../styled.components';

interface PDialog {
   isOpen: boolean;
   children?: React.ReactNode;
   title?: string;
   subText?: string;
}

export const Dialog: React.FC<PDialog> = (props) => {
   return (
      <>
         {props.isOpen && (
            <>
               <Stack
                  style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100vw',
                     height: '100vh',
                     backgroundColor: 'rgb(0,0,0,0.35)',
                     zIndex: 10000000,
                  }}
               ></Stack>
               <Stack
                  style={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     width: 380,
                     height: 200,
                     maxWidth: '100%',
                     maxHeight: '100%',
                     overflowY: 'auto',
                     backgroundColor: '#ffffff',
                     transform: 'translate(-50%, -50%)',
                     zIndex: 10000001,
                  }}
               >
                  <Stack
                     $horizontal
                     $verticalAlign="center"
                     $childrenGap={10}
                     style={{ padding: '20px 20px 10px 20px', fontSize: 20, fontWeight: 700, height: 60 }}
                  >
                     <BsExclamationCircle />
                     {props.title}
                  </Stack>
                  <Stack $horizontal $verticalAlign="center" style={{ height: 80, padding: '10px 50px', fontSize: 15 }}>
                     {props.subText}
                  </Stack>
                  <Stack $horizontalAlign="end" style={{ height: 60, width: '100%', padding: 10 }}>
                     <Stack $horizontal $verticalAlign="center" $childrenGap={5} style={{ width: '50%' }}>
                        {props.children}
                     </Stack>
                  </Stack>
               </Stack>
            </>
         )}
      </>
   );
};
