import { Routes, Route} from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ErrorPage from './pages/ErrorPage';
import { AuthGuard } from './components/AuthGuard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route exact path='/welcome' element={<WelcomePage/>}></Route>
      <Route exact path='/' element={<HomePage/>}/>
      <Route exact path='/profile' element={<AuthGuard component={ProfilePage}/>}></Route>
      <Route exact path='/conversation/:convoID' element={<AuthGuard component={HomePage}/>}></Route>
      <Route path='*' element={<ErrorPage/>}/>
    </Routes>
  );
}

export default App;
