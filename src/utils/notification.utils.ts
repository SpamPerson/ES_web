import { ToastPosition, toast } from 'react-toastify';

export const warningNotification = (message: string, position?: ToastPosition) => {
   let defaultPosition: ToastPosition = position ? position : 'bottom-center';
   let defaulthideProgressBar: boolean = true;

   toast.warning(message, {
      position: defaultPosition,
      autoClose: 1500,
      hideProgressBar: defaulthideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      style: {userSelect:'none'}
   });
};

export const errorNotification = (message:string, position?: ToastPosition) => {
   let defaultPosition: ToastPosition = position ? position : 'bottom-center';
   let defaulthideProgressBar: boolean = true;

   toast.error(message, {
      position: defaultPosition,
      autoClose: 1500,
      hideProgressBar: defaulthideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      style: {userSelect:'none'}
   });
}

export const successNotification = (message:string, position?: ToastPosition) => {
   let defaultPosition: ToastPosition = position ? position : 'bottom-center';
   let defaulthideProgressBar: boolean = true;

   toast.success(message, {
      position: defaultPosition,
      autoClose: 1500,
      hideProgressBar: defaulthideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      style: {userSelect:'none'}
   });
}