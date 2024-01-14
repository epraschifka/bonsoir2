import { Routes, Route} from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { AuthGuard } from './components/AuthGuard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/welcome' element={<WelcomePage/>}></Route>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/profile' element={<AuthGuard component={ProfilePage}/>}></Route>
    </Routes>
  );
}

export default App;
