import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { UserListItem } from '../UserAvatar/UserListItem';
import { UserBadgeItem } from '../UserAvatar/UserBadgeItem';

export const GroupChatModal = ({isOpen,toggleModal }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupPic, setGroupPic] = useState("");
    const [picLoading, setPicLoading] = useState(false);
    
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
            
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert('Error fetching search results');
            console.error(error);
        }
    }

    const handleSubmit = () => {
      if (!groupChatName || !selectedUsers || selectedUsers.length < 2) {
        alert("Por favor elija un nombre y añada al menos 2 usuarios");
        return;
      }
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      // Extraer solo los IDs de los usuarios
      const userIds = selectedUsers.map(u => u._id);
      
      axios.post('/api/chat/group', {
        name: groupChatName,
        users: JSON.stringify(userIds),
        pic: groupPic || "/groupchat.webp", // Usar imagen predeterminada si no se sube una
      }, config).then((res) => {
        setChats([res.data, ...chats]);
        
        setLoading(false);
        toggleModal();
        
      }).catch((error) => {
        console.error("Error detallado:", error.response?.data || error.message);
        alert('Error al crear el chat grupal: ' + (error.response?.data?.message || error.message));
      });
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id));
    }
     
    const handleGroup = (userToAdd) => {
        if (!userToAdd){
            alert("No user to add")
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
    <div className='fixed inset-0 w-full h-full bg-gray-900/50 flex items-center justify-center z-50'>
      <div className='bg-gray-100 p-3 md:p-5 rounded-lg shadow-lg w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <span className='text-base md:text-xl font-medium'>Create Group Chat</span>
          <button 
            onClick={toggleModal}
            className='text-gray-500 w-6 h-6 flex items-center justify-center hover:text-gray-700 hover:bg-gray-300 rounded-full bg-gray-200'
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col w-full mb-4">
          {/* Input para el nombre del grupo */}
          <label className='text-xs md:text-sm mb-1' htmlFor="groupname">Group Name</label>
          <input 
            className="bg-white text-sm md:text-base p-2 w-full border border-gray-300 focus:border-cyan-500 focus:outline-none rounded-lg mb-3" 
            type="text" 
            placeholder="Create a Group chat name" 
            value={groupChatName}
            name='groupname'
            onChange={(e) => setGroupChatName(e.target.value)} 
          />

          {/* Input para la imagen del grupo */}
          <label className='text-xs md:text-sm mb-1' htmlFor="grouppic">Group Image</label>
          <input
            className="bg-white text-sm md:text-base p-2 w-full border border-gray-300 focus:border-cyan-500 focus:outline-none rounded-lg mb-3"
            type="file"
            accept="image/*"
            name='grouppic'
            onChange={(e) => postDetails(e.target.files[0])}
          />
          {picLoading && <p className="text-sm text-blue-500 mb-2">Uploading image...</p>}
          {groupPic && (
            <div className="mb-3 flex justify-center">
              <img src={groupPic} alt="Group preview" className="h-36 w-36 rounded-full object-contain md:object-cover" />
            </div>
          )}

          {/* Input de búsqueda */}
          <label className='text-xs md:text-sm mb-1' htmlFor="username">Username</label>
          <input 
            className="bg-white text-sm md:text-base p-2 w-full border border-gray-300 focus:border-cyan-500 focus:outline-none rounded-lg mb-3" 
            type="text" 
            placeholder="Type a username" 
            value={search} 
            name='username'
            onChange={(e) => handleSearch(e.target.value)} 
          />

          {/* Contenedor con scroll para la lista de contactos */}
          <div className="max-h-40 md:max-h-60 overflow-y-auto rounded-lg border border-gray-300 p-2">
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedUsers.map((u) => (
                <UserBadgeItem 
                  key={u._id} 
                  user={u} 
                  handleFunction={() => handleDelete(u)} 
                />
              ))}
            </div>

            {loading ? (
              <p className="text-center py-2 text-gray-500">Loading...</p>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem 
                  key={user._id} 
                  user={user} 
                  handleFunction={() => handleGroup(user)} 
                />
              ))
            )}
          </div>
        </div>
        
        <div className='flex justify-end gap-2'>
          <button 
            onClick={toggleModal}
            className='text-sm md:text-base font-normal bg-gray-300 rounded-md hover:bg-gray-400 px-3 py-1 md:px-4 md:py-2 cursor-pointer'
          >
            Close
          </button>
          <button 
            className='text-sm md:text-base font-normal bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 cursor-pointer rounded-md hover:bg-blue-600'
            onClick={handleSubmit}
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