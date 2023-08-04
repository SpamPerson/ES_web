import { Route, Routes } from 'react-router-dom';

import { Home } from './components/pages/Home';
import { ContentWrapper } from './components/controls/ContentWrapper';
import { Login } from './components/pages/Login';
import './App.css';
import { SignUp } from './components/pages/SignUp';
import { FindPassword } from './components/pages/FindPassword';

const App = () => {
   return (
      <div className="App">
         <ContentWrapper>
            <Routes>
               <Route path="" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<SignUp />} />
               <Route path="/findpassword" element={<FindPassword />} />
            </Routes>
         </ContentWrapper>
      </div>
   );
};

export default App;
