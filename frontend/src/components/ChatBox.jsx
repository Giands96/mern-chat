import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { SingleChat } from './SingleChat'

export const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { selectedChat } =ChatState()
  
  return (
    <div className={`${selectedChat ? "flex" : "hidden"} md:flex flex-col items-center bg-white w-full border-gray-100 rounded-lg overflow-hidden`}>
  <div className='pt-5 px-5 text-2xl md:text-lg flex justify-between w-full'>
    <span className='text-3xl font-light'>Chat</span>
  </div>
  <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
</div>
  )
}
