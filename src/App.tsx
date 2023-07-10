import { useState } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import './App.css';

const App = () => {
   const [isLogin, setIsLogin] = useState<boolean>(false);
   console.log(process.env.REACT_APP_OPEN_AI_API_KEY);

   return (
      <BrowserRouter>
         <div className="App">
            {!isLogin ? (
               <Login />
            ) : (
               <Routes>
                  <Route path="" element={<Home />} />
               </Routes>
            )}
         </div>
      </BrowserRouter>
   );
};

export default App;
