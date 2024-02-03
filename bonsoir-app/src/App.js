import { Routes, Route} from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import ConversationPage from './pages/ConversationPage';
import ErrorPage from './pages/ErrorPage';
import { AuthGuard } from './pages/AuthGuard';
import LoadingPage from './pages/LoadingPage';
import StartPage from './pages/StartPage';

function App() {
  return (
    <Routes>
      <Route exact path='/welcome' element={<WelcomePage/>}></Route>
      <Route exact path='/' element={<ConversationPage/>}/>
      <Route exact path='/home' element={<AuthGuard component={StartPage}/>}></Route>
      <Route exact path='/conversation/:convoID' element={<AuthGuard component={ConversationPage}/>}></Route>
      <Route path='*' element={<ErrorPage/>}/>
    </Routes>
  );
}

export default App;
