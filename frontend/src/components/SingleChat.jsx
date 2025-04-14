import React from 'react'
import {ChatState} from '../Context/ChatProvider'
import { ArrowLeftFromLine } from 'lucide-react';
import { getSender } from '../config/ChatLogics';

export const SingleChat = ({fetchAgain, setFetchAgain}) => {
  const {user,selectedChat,setSelectedChat} = ChatState();

  return (
    <>
    {selectedChat ? (
  <div className="flex flex-col w-full h-full bg-white border-gray-100 rounded-lg overflow-hidden">
    <div className='flex flex-col h-full p-5'>
      <div className='flex items-center justify-between'>
        {!selectedChat.isGroupChat ? (<>
        
        {getSender(user, selectedChat.users)}
        

        </>): (<>
        {selectedChat.chatName}
        
        </>)}
        <button onClick={() => setSelectedChat(null)} className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md cursor-pointer'><ArrowLeftFromLine /></button>
      </div>
      {/* Chat messages will go here */}
    </div>
  </div>
) : (
  <div className='flex items-center h-screen bg-white justify-center w-full'>
    <p>Click on a user to start chatting</p>
  </div>
)}
    </>
  )
}
