import React from 'react'
import { ChatState } from '../Context/ChatProvider'

export const UserListItem = ({user,handleFunction}) => {
return (
    <div className='max-h-96 overflow-y-auto'>
        <div className='flex items-center justify-between p-3 border-1 mb-2 rounded-xl border-gray-200 hover:bg-gray-200 cursor-pointer' onClick={handleFunction}>
            <div className='flex items-center gap-5 w-full'>
                <img src={user.pic} alt={user.name} className='w-10 h-10 rounded-full' />
                <div className='flex flex-col'>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                </div>
            </div>
        </div>
    </div>
)
}
