import { Stack } from '../styled.components';

interface PModal {
   isOpen: boolean;
   children?: React.ReactNode;
   width?: string;
   height?: string;
   onDismiss?: () => void;
}

export const Modal: React.FC<PModal> = (props) => {
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
                  onClick={props.onDismiss}
               ></Stack>
               <Stack
                  style={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     width: props.width,
                     height: props.height,
                     maxWidth: '100%',
                     maxHeight: '100%',
                     overflowY: 'auto',
                     backgroundColor: '#ffffff',
                     transform: 'translate(-50%, -50%)',
                     zIndex: 10000001,
                  }}
               >
                  {props.children}
               </Stack>
            </>
         )}
      </>
   );
};
