import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { SideDrawer } from '../miscellaneous/SideDrawer'
import { MyChats } from '../components/MyChats'
import { ChatBox } from '../components/ChatBox'


export const ChatPage = () => {

  const {user} = ChatState()
  const {fetchAgain, setFetchAgain} = useState(false);
  return (
    <div className='w-full'>
      {user && <SideDrawer/>}
      <div className='w-full flex justify-between h-[90dvh] p-5'>
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        
      </div>
    </div>
  )
}
