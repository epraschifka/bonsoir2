import { Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { AuthGuard } from './components/AuthGuard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/profile' element={<AuthGuard component={ProfilePage}/>}></Route>
    </Routes>
  );
}

export default App;
