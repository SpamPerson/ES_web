import { Route, Routes } from 'react-router-dom';

import { Home } from './components/pages/Home';
import { ContentWrapper } from './components/controls/ContentWrapper';
import { Login } from './components/pages/Login';
import './App.css';

const App = () => {
   return (
      <div className="App">
         <ContentWrapper>
            <Routes>
               <Route path="" element={<Home />} />
               <Route path="/login" element={<Login />} />
            </Routes>
         </ContentWrapper>
      </div>
   );
};

export default App;
