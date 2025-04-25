import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { ChatLoading } from './ChatLoading';
import { GroupChatModal } from '../miscellaneous/GroupChatModal';
import "../styles/loader.css"
import { MessageCirclePlus } from 'lucide-react';

export const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats} = ChatState();
  const [openGroupChat, setOpenGroupChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChats = async () => {
    try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        };

        const { data } = await axios.get('/api/chat', config);
        
        setChats(data);
        setIsLoading(false);
    } catch (error) {
      alert('Error fetching chats', error);
      setIsLoading(false);
    }
  }

  const toggleGroupChat = () => {
    setOpenGroupChat(!openGroupChat);
  }
  


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    setLoggedUser(storedUser);

    if(user && user.token){
      fetchChats();
    }
  }, [fetchAgain, user])

  return (
    <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col items-center bg-white w-full border-gray-100 lg:w-[40%] scrollbar-hide border-1 rounded-lg md:w-[31%] h-full md:mr-2`}>
        <div className='pt-5 px-5 text-2xl md:text-lg flex justify-between w-full'>
          <span className='text-3xl font-light'>My Chats</span>
          <div>
          <button className='bg-indigo-600 p-3 right-2 hover:bg-indigo-400 relative top-[700px] text-white flex gap-2 transition-all hover:cursor-pointer rounded-full text-sm md:text-md' onClick={toggleGroupChat}>
          <MessageCirclePlus />
            </button>
            
            {openGroupChat && (
                <>
                  <GroupChatModal isOpen={openGroupChat} toggleModal={toggleGroupChat}/>
                </>
              )
            }
          </div>
        </div>
        <div className='flex flex-col m-5 bg-gray-100 w-full h-full rounded-lg overflow-y-scroll'>
            {isLoading ? (
              <div className="flex justify-center items-center h-full w-full">
                <span className="loader"></span>
              </div>
            ) : chats && chats.length > 0 ? (
              chats.map((chat) => (
                <div 
                  key={chat._id} 
                  className={`flex items-center gap-2 p-3 hover:bg-gray-200 transition-all duration-75 rounded-lg ${
                    selectedChat === chat ? 'bg-gradient-to-r from-violet-400 to-emerald-600 text-white' : ''
                  }`} 
                  onClick={() => setSelectedChat(chat)}
                >
                  <img 
  src={chat.isGroupChat 
    ? (chat.pic || "/groupchat.webp") 
    : (chat.users[0]._id === loggedUser._id ? chat.users[1].pic : chat.users[0].pic)} 
  alt="" 
  className='w-[40px] h-[40px] rounded-full'
/>
                  <span className='font-semibold'>
                    {chat.isGroupChat ? chat.chatName : chat.users[0]._id === loggedUser._id ? chat.users[1].name : chat.users[0].name}
                  </span>
                  
                </div>
              ))
            ) : (
              <ChatLoading />
            )}
        </div>
    </div>
  )
}