import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { SideDrawer } from '../miscellaneous/SideDrawer'
import { MyChats } from '../components/MyChats'
import { ChatBox } from '../components/ChatBox'


export const ChatPage = () => {

  const {user} = ChatState()
  return (
    <div className='w-full'>
      {user && <SideDrawer/>}
      <div className='w-full flex justify-between p-5'>
        {user && <MyChats/>}
        {user && <ChatBox/>}
      </div>
    </div>
  )
}
