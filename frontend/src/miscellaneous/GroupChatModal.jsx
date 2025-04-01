import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { UserListItem } from '../UserAvatar/UserListItem';
import { UserBadgeItem } from '../UserAvatar/UserBadgeItem';

export const GroupChatModal = ({isOpen,toggleModal, children }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query){
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            //console.log(data)
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert('Error fetching search results');
            console.error(error);
        }
    }

    const handleSubmit = () => {

    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id));
    }
     
    const handleGroup = (userToAdd) => {
        if (!userToAdd){
            console.log("No user to add")
            return;
        }
        if (selectedUsers.some(user => user._id === userToAdd._id)) {
            alert("User already added");
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };
    


    const {user,chats,setChats} = ChatState();

    return (
        <>
            {isOpen && (
                <div className='absolute top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center'>
                    <div className='bg-gray-100 p-4 rounded-lg shadow-lg w-1/3'>
                        <div className='flex justify-between items-center mb-4'>
                            <span className='text-sm font-light md:text-xl'>Create Group Chat</span>
                            <button 
                                onClick={toggleModal}
                                className='text-gray-500 w-[25px] h-[25px]  hover:text-gray-700 hover:bg-gray-300 px-1 rounded-full bg-gray-200 text-xs md:text-md'
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="flex flex-col w-full max-h-96 rounded-lg mb-4 p-3">
    {/* Input para el nombre del grupo */}
    <label className='text-[7px] md:text-lg mb-2' htmlFor="groupname">Group Name</label>
    <input 
        className="bg-white text-[8px] p-1 md:text-xl md:p-2 md:w-full border border-gray-200 focus:border-cyan-500 focus:outline-none rounded-xl mb-3" 
        type="text" 
        placeholder="Create a Group chat name" 
        value={groupChatName}
        name='groupname'
        onChange={(e) => setGroupChatName(e.target.value)} 
    />

    {/* Input de búsqueda */}
    <label className='text-[7px] md:text-lg mb-2' htmlFor="username">Username</label>
    <input 
        className="bg-white text-[8px] p-1 md:text-xl md:p-2 md:w-full border border-gray-200 focus:border-cyan-500 focus:outline-none rounded-xl mb-3" 
        type="text" 
        placeholder="Type a username" 
        value={search} 
        name='username'
        onChange={(e) => handleSearch(e.target.value)} 
    />

    {/* Contenedor con scroll solo para la lista de contactos */}
    <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-2">
        {selectedUsers.map((u) => (
            <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
        ))}

        {loading ? (
            <p>Loading...</p>
        ) : (
            searchResult?.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
            ))
        )}
    </div>
</div>
                        
                        <div className='flex justify-end gap-2'>
                            <button 
                                onClick={toggleModal}
                                className='font-light text-[9px] md:text-xl bg-gray-300 rounded-md hover:bg-gray-400 hover:cursor-pointer px-1 py-1 md:px-4 md:py-2'
                            >
                                Close
                            </button>
                            <button 
                                className='font-light bg-blue-500 text-[9px] md:text-xl text-white md:px-4 md:py-2 rounded-md px-1 py-1  hover:bg-blue-600 hover:cursor-pointer'
                                onClick={handleSubmit()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}