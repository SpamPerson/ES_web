import { useContext } from 'react';

import { Route, Routes } from 'react-router-dom';

import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { IAuthenticationContext } from './components/types';
import { AuthenticationContext } from './components/contexts/context';
import './App.css';

const App = () => {
   const { isLogin } = useContext<IAuthenticationContext>(AuthenticationContext);

   return (
      <div className="App">
         {!isLogin ? (
            <Login />
         ) : (
            <Routes>
               <Route path="" element={<Home />} />
            </Routes>
         )}
      </div>
   );
};

export default App;
