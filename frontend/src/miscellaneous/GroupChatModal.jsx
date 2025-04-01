import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { UserListItem } from '../UserAvatar/UserListItem';
import { UserBadgeItem } from '../UserAvatar/UserBadgeItem';

export const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
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
    
    


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const {user,chats,setChats} = ChatState();

    return (
        <>
            {isOpen && (
                <div className='absolute top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center'>
                    <div className='bg-gray-100 p-4 rounded-lg shadow-lg w-1/3'>
                        <div className='flex justify-between items-center mb-4'>
                            <span className='text-xl font-light'>Create Group Chat</span>
                            <button 
                                onClick={toggleModal}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className='flex flex-col  w-full max-h-96 rounded-lg overflow-y-auto mb-4 p-3'>
                        <form action="">
                                <input 
                                    className='bg-white p-2 w-full border-1 border-gray-200 focus:border-cyan-500 focus:outline-none rounded-xl mb-3' 
                                    type="text" 
                                    placeholder='Create a Group chat name' 
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)} 
                                />
                            </form>

                            <form action="">
                                <input 
                                    className='bg-white p-2 w-full border-1 border-gray-200 focus:border-cyan-500 focus:outline-none rounded-xl mb-3' 
                                    type="text" 
                                    placeholder='Type an username' 
                                    value={search} 
                                    onChange={(e) => handleSearch(e.target.value)} 
                                />
                            </form>

                            <div>
                            {selectedUsers.map((u)=>(
                                <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
                            ))}
                            </div>
                            
                            {
                                loading ? (
                                    <div></div>
                                ) : (
                                    searchResult?.slice(0, 4).map((user) => (
                                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                    ))
                                    
                                )
                            }
                        </div>
                        
                        <div className='flex justify-end gap-2'>
                            <button 
                                onClick={toggleModal}
                                className='font-light bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 hover:cursor-pointer'
                            >
                                Close
                            </button>
                            <button 
                                className='font-light bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer'
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