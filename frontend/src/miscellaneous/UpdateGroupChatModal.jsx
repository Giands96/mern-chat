import React, { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { ChatState } from '../Context/ChatProvider';
import { UserBadgeItem } from '../UserAvatar/UserBadgeItem';
import { UserListItem } from '../UserAvatar/UserListItem';
import axios from 'axios';


export const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  

  const { selectedChat, setSelectedChat, user } = ChatState();



  const handleClose = () => setIsOpen(false);

  const handleRemove = async (user1) => {
    // Guardar referencia local a la función
    const updateFetchAgain = setFetchAgain;
    const currentFetchAgain = fetchAgain;
    
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      alert('Only admins can remove users');
      return;
    }
  
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await axios.put('/api/chat/groupremove', {
        chatId: selectedChat._id,
        userId: user1._id,
      }, config);
  
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      fetchMessages();
      // Usar la referencia local
      if (typeof updateFetchAgain === 'function') {
        updateFetchAgain(!currentFetchAgain);
      }
      
      setLoading(false);
    }
    catch(err){
      alert('Error al eliminar usuario del grupo');
      console.error(err); 
      setLoading(false);
    }
  };
  
  const handleAddUser = async (user1) => {
    // Guardar referencia local a la función
    const updateFetchAgain = setFetchAgain;
    const currentFetchAgain = fetchAgain;
    
    if(selectedChat.users.find((u)=> u._id === user1._id)){
      alert('User already added');
      return;
    }
    if(selectedChat.groupAdmin._id !== user._id){
      alert('Only admins can add users');
      return;
    }
  
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put('/api/chat/groupadd', {
        chatId: selectedChat._id,
        userId: user1._id,
      }, config);
      setSelectedChat(data);
      
      // Usar la referencia local
      if (typeof updateFetchAgain === 'function') {
        updateFetchAgain(!currentFetchAgain);
      }
      
      setLoading(false);
    } catch (error) {
      alert('Error al agregar usuario al grupo');
      console.error(error);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if(!groupChatName) return
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        }
      };
    
      const { data } = await axios.put('/api/chat/rename', {
        chatId:selectedChat._id,
        chatName: groupChatName,
      }, config);
      
      setSelectedChat(data);
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      
    } catch (error) {
      alert('Error al renombrar el grupo');
      console.error(error); 
      setRenameLoading(false);
      setGroupChatName('');
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if(!query){
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      
    } catch (error) {
      alert('Error al buscar usuarios');
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="text-gray-400 hover:cursor-pointer hover:bg-neutral-100 rounded-sm transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <EllipsisVertical />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-800/50 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <div className='flex justify-between items-center mb-4'>
          <span className='text-base md:text-xl font-medium'>{selectedChat.chatName}</span>
          <button 
            onClick={handleClose}
            className='text-gray-500 w-6 h-6 flex items-center justify-center hover:text-gray-700 hover:bg-gray-300 rounded-full bg-gray-200'
          >
            ✕
          </button>
        </div>

            <form className="space-y-4 flex gap-2">
              <input
                type="text"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Nuevo nombre del grupo"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button onClick={handleRename} className='bg-purple-800 hover:bg-purple-950 transition-colors text-white cursor-pointer py-2 rounded-lg h-fit px-2' >Update</button>

              

            </form>
            
            <form className='my-2'>
              <span >Add Users</span>
            <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar usuarios"
                className="w-full p-2 border border-gray-300 rounded-md"
              />



              <div className="space-y-2">
                <h3 className="text-lg font-medium mt-2">Members</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                    {selectedChat.users.map((u) => (
                        <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />

                      
                    ))}
                  </div>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  

                  {loading ? (
                    <p className="text-center text-gray-500">Cargando...</p>
                  ) : (
                    searchResult.slice(0, 4).map((user) => (
                      <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                    ))
                  )}
                </div>
              </div>


            </form>

            

            <button onClick={()=>handleRemove(user)} className='bg-red-500 text-white px-4 py-2 mt-4 rounded-lg cursor-pointer hover:bg-red-800 transition-colors' >Leave Group </button>
          </div>
        </div>
      )}
    </>
  );
};
