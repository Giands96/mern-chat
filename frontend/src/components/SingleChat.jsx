import React, { useState } from 'react'
import {ChatState} from '../Context/ChatProvider'
import { ArrowLeftFromLine, EllipsisVertical } from 'lucide-react';
import { getSender, getSenderUser } from '../config/ChatLogics';
import ProfileModal from '../miscellaneous/ProfileModal';

export const SingleChat = ({fetchAgain, setFetchAgain}) => {
  const {messages, setMessages} = useState([]);
  const {loading, setLoading} = useState(false);
  const {user,selectedChat,setSelectedChat} = ChatState();
  const [openProfile, setOpenProfile] = useState(false);

  function handleProfileClick() {
    setOpenProfile(true);
  }

  return (
    <>
    {selectedChat ? (
  <div className="flex flex-col w-full h-full bg-white border-gray-100 rounded-lg overflow-hidden">
    <div className='flex flex-col h-full p-5'>
    
      <div className='flex items-center justify-between'>
        {!selectedChat.isGroupChat ? (<>
        
          <div className='flex items-center gap-2'>
            {getSenderUser(user, selectedChat.users) ? (
              <>
                <img src={selectedChat.users[1].pic} className='w-8 h-8 rounded-full bg-cover ' alt="User Avatar" />
                <span>{getSender(user,selectedChat.users)}</span>
                <button onClick={handleProfileClick} title='Mirar Perfil' className='text-gray-400 hover:cursor-pointer hover:bg-neutral-100 rounded-sm transition-colors'><EllipsisVertical /></button>
                
{openProfile && (
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-700/25 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex justify-center flex-col items-center transform transition-all duration-300 ease-out scale-100 opacity-100 animate-modal-appear">
        <div className="flex flex-col items-center">
          <img
            src={getSenderUser(user, selectedChat.users).pic}
            alt="User Avatar"
            className="bg-gray-200 object-contain md:object-cover w-24 h-24  rounded-full mb-4"
          />
          <div className='text-center'>
          <span className="font-light">Username:</span>
          <h2 className="text-lg font-semibold">{getSender(user, selectedChat.users)}</h2>
          <span className="font-light">Email:</span>
          <p className="text-gray-600">{getSenderUser(user, selectedChat.users).email}</p>
          </div>
          
        </div>
        <button
          onClick={() => setOpenProfile(false)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
    <style jsx>{`
      @keyframes modal-appear {
        from {
          opacity: 0;
          transform: scale(0);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .animate-modal-appear {
        animation: modal-appear .2s ease-in-out forwards;
      }
    `}</style>
  </>
)}
              </>
                
            ) : (
              <span>No Image Available</span>
            )}
          </div>
          
        
      
        </>): (<>
        {selectedChat.chatName}
        
        </>)}
        <button onClick={() => setSelectedChat("")} className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300 transition'><ArrowLeftFromLine /></button>
      </div>
      {/* Chat messages will go here */}
    </div>
  </div>
) : (
  <div className='flex items-center h-screen bg-white justify-center w-full text-4xl font-extralight'>
    <p>Click on a user to start chatting</p>
  </div>
)}
    </>
  )
}
