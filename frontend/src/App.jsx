import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { ChatPage } from './pages/ChatPage';

function App() {
  console.log(localStorage.getItem('theme'));

  return (
    
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    
  );
}

export default App;
