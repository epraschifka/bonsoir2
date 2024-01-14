import './App.css';
import Participant from './components/Participant';
import NavButton from './components/NavButton';
import Statement from './components/Statement';


function App() {
  return (
    <div className="App">
      <div className='navbar'>
        <div className='top'>
          <NavButton text='+' />
          <NavButton text='Hello, World' />
        </div>
        <div className='bottom'>
          <NavButton text='Vocabulary'/>
          <NavButton text='Logout'/>
        </div>
      </div>
      <div className='call'>
        <img className='call-window'></img>
        <div className='call-participants'>
          <Participant name='Edward Praschifka' />
          <Participant name='Bonsoir' />
        </div>
      </div>
      <div className='chatlog'>
        <Statement text='Hello!' speaker='Bonsoir' datetime='2-01-2024 16:07'/>
        <Statement text='Hey! How are you?' speaker='Edward Praschifka' datetime='2-01-2024 16:08'/>
        <Statement text='Good thanks! Yourself?' speaker='Bonsoir' datetime='2-01-2024 16:08'/>
      </div>
    </div>
  );
}

export default App;
