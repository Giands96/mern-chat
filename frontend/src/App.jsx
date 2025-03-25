
import './App.css'

import { Route } from "react-router-dom";
import { Homepage } from './pages/Homepage';
import { ChatPage } from './pages/ChatPage';

import { Link } from 'react-router-dom';

function App() {
  console.log(localStorage.getItem('theme'))

  return (
    <div className=''>
      <Route path="/" component ={Homepage} exact/>
      <Route path="/chats" component={ChatPage}/>
    </div>
  )
}

export default App
