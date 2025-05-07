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
  const [groupPic, setGroupPic] = useState('');
  const [picLoading, setPicLoading] = useState(false);

  

  const { selectedChat, setSelectedChat, user } = ChatState();



  const handleClose = () => setIsOpen(false);

  const handleRemove = async (user1) => {
    // Guardar referencia local a la función
    const updateFetchAgain = setFetchAgain;
    const currentFetchAgain = fetchAgain;
    
    // Lógica corregida:
    // 1. El administrador puede eliminar a cualquiera
    // 2. Cualquier usuario puede eliminarse a sí mismo
    // 3. Los usuarios normales NO pueden eliminar a otros
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      alert('Solo los administradores pueden eliminar a otros usuarios');
      return;
    }
  
    // Si el usuario intenta eliminar al administrador y no es el administrador
    if(user1._id === selectedChat.groupAdmin._id && user._id !== selectedChat.groupAdmin._id) {
      alert('No puedes eliminar al administrador del grupo');
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

  const handleRename = async (e) => {
    e.preventDefault();
    if(!groupChatName) return
    try {
      setLoading(true);
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
      setLoading(false);
      
      
    } catch (error) {
      alert('Error al renombrar el grupo');
      console.error(error); 
      setLoading(false);
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

  // Función para manejar la subida de imagen
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert("Please select an image");
      setPicLoading(false);
      return;
    }
    
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "mern-chat-app");
      
      fetch("https://api.cloudinary.com/v1_1/mern-chat-app/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setGroupPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      alert("Please select an image");
      setPicLoading(false);
    }
  };

  // Función para actualizar la imagen del grupo
  const handleUpdateGroupPic = async () => {
    if (!groupPic) return;
    
    // Guardar referencia local a la función
    const updateFetchAgain = setFetchAgain;
    const currentFetchAgain = fetchAgain;
    
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        }
      };
    
      const { data } = await axios.put('/api/chat/updatepic', {
        chatId: selectedChat._id,
        pic: groupPic,
      }, config);
      
      setSelectedChat(data);
      // Usar la referencia local
      if (typeof updateFetchAgain === 'function') {
        updateFetchAgain(!currentFetchAgain);
      }
      setLoading(false);
    } catch (error) {
      alert('Error al actualizar la imagen del grupo');
      console.error(error); 
      setLoading(false);
    }
  };

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

            {/* Previsualización y actualización de la imagen del grupo */}
            <div className="flex flex-col items-center mb-4">
              <img 
                src={selectedChat.pic || "/groupchat.webp"} 
                alt="Group avatar" 
                className="w-20 h-20 rounded-full object-cover mb-2 object-contain md:object-cover"
              />
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                  className="mb-2"
                />
                {picLoading ? (
                  <p className="text-blue-500 text-sm">Cargando imagen...</p>
                ) : groupPic ? (
                  <button 
                    onClick={handleUpdateGroupPic}
                    className="bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Actualizar imagen
                  </button>
                ) : null}
              </div>
            </div>

            <form className="space-y-4 flex gap-2">
              {/*Input para renombrar el grupo*/ }
              <input
                type="text"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Nuevo nombre del grupo"
                className="w-full p-2 border border-gray-300 rounded-md focus:border-cyan-500 focus:outline-none"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:border-cyan-500 focus:outline-none"
              />



              <div className="space-y-2">
                <h3 className="text-lg font-medium mt-2">Members</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                    {selectedChat.users.map((u) => (
                        <UserBadgeItem 
                          key={u._id} 
                          user={u} 
                          handleFunction={() => handleRemove(u)} 
                          isAdmin={selectedChat.groupAdmin._id === u._id}
                        />
                    ))}
                  </div>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  

                  {loading ? (
                    <p className="text-center text-gray-500">Cargando...</p>
                  ) : (
                    searchResult.slice(0, 4).map((user) => (
                      <UserListItem 
                        key={user._id} 
                        user={user} 
                        handleFunction={() => handleAddUser(user)}
                        isAdmin={selectedChat?.groupAdmin?._id === user._id}
                      />
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
