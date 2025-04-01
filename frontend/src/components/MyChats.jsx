import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { ChatLoading } from './ChatLoading';
import { getSender } from '../config/ChatLogics';

export const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState()
  const { selectedChat, setSelectedChat, user, chats, setChats} = ChatState();

  
  const fetchChats = async () => {
    try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        };

        const { data } = await axios.get('/api/chat', config);
        console.log(data);
        setChats(data);

    } catch (error) {
      alert('Error fetching chats', error)
    }
  }

  
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  },[])
  return (
    <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col items-center bg-white w-full h-[500px] border-gray-100 scrollbar-hide border-1 rounded-lg md:w-[31%] md:h-[90vh] md:mr-2`}>
        <div className='pt-5 px-5 text-2xl md:text-lg flex justify-between w-full'>
          <span className='text-3xl font-light'>My Chats</span>
          <div>
            <button className='bg-gray-100 p-2 hover:bg-gray-200 flex gap-2 transition-all hover:cursor-pointer rounded-lg' >
              New Group Chat +
            </button>
          </div>
          
        </div>
        <div className='flex flex-col m-5 bg-gray-100 w-full h-full rounded-lg overflow-y-scroll scrollbar-hide'>
            {
              chats? (
                chats.map((chat) => {
                  return (
                    <div key={chat._id} className={`flex items-center gap-2 p-3 hover:bg-gray-200 transition-all rounded-lg ${selectedChat === chat ? 'bg-gray-200' : ''}`} onClick={()=>setSelectedChat(chat)}>
                      <img src={chat.isGroupChat ? chat.chatName : chat.users[0]._id === loggedUser._id ? chat.users[1].pic : chat.users[0].pic} alt="" className='w-[40px] h-[40px] rounded-full'/>
                      <span className='font-semibold'>{chat.isGroupChat ? chat.chatName : chat.users[0]._id === loggedUser._id ? chat.users[1].name : chat.users[0].name}</span>

                      <span>
                        {!chat.isGroupChat ?(
                          getSender(loggedUser, chat.users)
                        ):(chat.chatName)}
                      </span>

                    </div>
                    
                  )
                })
              ) : (
                <ChatLoading/>

              )
            }
        </div>
    </div>
  )
}
