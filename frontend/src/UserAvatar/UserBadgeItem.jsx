import React from 'react'
import { X } from 'lucide-react'

export const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div className='flex items-center px-2 py-1 border-lg m-1 mb-2 text-sm bg-purple-800 cursor-pointer text-white rounded-xl w-fit ' onClick={handleFunction}>
        <img src={user.pic} alt={user.name} className='w-8 h-8 rounded-full mr-2' />
        {user.name}
        <X className='w-4' />
    </div>
  )
}
