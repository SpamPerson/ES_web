import { AutenticationContext } from '../context';

interface IAuthenticationProvider {
   children?: React.ReactNode;
}

export const AuthenticationProvider: React.FC<IAuthenticationProvider> = (props) => {
   
   return <AutenticationContext.Provider value={{}}>{props.children}</AutenticationContext.Provider>;
};
