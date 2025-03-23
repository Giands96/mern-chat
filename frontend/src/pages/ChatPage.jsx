import React, { useEffect, useState } from 'react'
import axios from 'axios'

export const ChatPage = () => {

    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat");
      setChats(data);

    } catch (error) {
      console.error("Error al cargar chats:", error);
    }
  };

    useEffect( ()=> {
        fetchChats()
    },[]);

  return (
    <div>
        {chats.map((chat) => <div key={chat._id}>
            {chat.chatName} <br />
            <span>Este es el id del chat </span>
            {chat._id}
        </div>)}
    </div>
  )
  
}
