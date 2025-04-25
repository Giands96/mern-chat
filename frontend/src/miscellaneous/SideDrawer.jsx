import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, Bolt, LogOut, Menu, Search, User } from "lucide-react";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { ChatLoading } from "../components/ChatLoading";
import { UserListItem } from "../UserAvatar/UserListItem";
import "../styles/notification.css";
import { getSender } from "../config/ChatLogics";

export const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const history = useNavigate();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats, logout, notification, setNotification } = ChatState();
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // const [notifications, setNotifications] = useState([]);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  }

  const logoutHandler = () => {
    logout();
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() !== "") {
        fetchSearchResults();
      } else {
        setSearchResult([]);
      }
    }, 500); // espera 500ms luego de que el usuario deja de tipear

    return () => clearTimeout(delayDebounce); // limpia el timeout anterior si el usuario sigue escribiendo
  }, [search]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      alert("Error fetching search results");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter a search term");
      return;
    }

    try {
      setIsLoading(true);
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setIsLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Error fetching search results");
      console.error(error);
      setLoading(false);
      setIsLoading(false);
    }
  };

  const toggleOpenSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsOpenDropdown(false);
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      console.log("User ID", userId);
      console.log("Chat data", data);

      // Si el chat no existe@S en la lista actual, agrégalo
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setIsSearchOpen(false);
      history.push("/chats");
    } catch (error) {
      console.error("Error completo:", error);
      alert(
        "Error fetching chat: " +
          (error.response?.data?.message || error.message)
      );
      setLoadingChat(false);
    }
  };

  return (
    <div className="w-full justify-between flex bg-white items-center px-5 py-2">
      <div>
        <span className="text-lg font-light md:text-3xl">MyTalkApp!</span>
      </div>
      <div className="rounded-md items-center mx-2 md:mx-0">
        <button
          title="Search for users to chat"
          className="bg-gray-100 items-center text-[0px] md:text-xl md:px-10 md:py-2 rounded-xl hover:bg-gray-200 flex md:gap-2 transition-all hover:cursor-pointer "
          onClick={toggleOpenSearch}
        >
          <Search className=" p-1" />
          Search users
        </button>
      </div>

      <div id="menu" className="flex items-center gap-2">
      {/* Botón de notificaciones con contador */}
{/* Botón de notificaciones con contador */}
<div className="relative">
  <button
    title="Notifications"
    className="hover:cursor-pointer hover:bg-gray-200 p-2 transition-colors rounded-full"
    onClick={handleNotificationClick}
  >
    <BellRing />
    {notification.length > 0 && (
      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {notification.length > 9 ? "9+" : notification.length}
      </div>
    )}
  </button>
  
  <div 
    className={`absolute right-0 top-12 p-5 w-64 bg-white rounded-lg shadow-lg transition-all duration-300 transform ${
      isNotificationOpen 
        ? "opacity-100 translate-y-0 pointer-events-auto" 
        : "opacity-0 -translate-y-2 pointer-events-none"
    }`}
  >
    {!notification.length && (
      <div className="text-center py-4">
        <span>No Notifications</span>
      </div>
    )}
    
    {/* Mostrar solo las primeras 3 notificaciones */}
    {notification.slice(0, 3).map(notif => (
      <button
        key={notif._id}
        className="w-full py-2 border-b border-gray-100 flex items-center gap-2 text-left hover:bg-gray-50 transition-colors px-2 rounded-md"
        onClick={() => {
          setSelectedChat(notif.chat);
          setNotification(notification.filter((n) => n !== notif));
          setIsNotificationOpen(false);
          history("/chats");
        }}
      >
        <img 
          src={notif.chat.isGroupChat 
            ? notif.chat.pic || "/path/to/default/group-icon.png" 
            : notif.sender?.pic || "/path/to/default/user-icon.png"} 
          className="w-6 h-6 rounded-full object-cover" 
          alt="profile" 
        />
        <div>
          {notif.chat.isGroupChat
            ? <span>New Message in <strong>{notif.chat.chatName}</strong></span>
            : <span>New Message from <strong>{getSender(user, notif.chat.users)}</strong></span>
          }
        </div>
      </button>
    ))}
    
    {/* Mostrar un mensaje indicando que hay más notificaciones */}
    {notification.length > 3 && (
      <div className="text-center py-2 text-gray-500 border-t border-gray-100 mt-1">
        <span>{notification.length - 3} more notification{notification.length - 3 > 1 ? 's' : ''}</span>
      </div>
    )}
    
    {/* Botón para ver todas las notificaciones */}
    {notification.length > 3 && (
      <button 
        className="w-full mt-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => {
          // Aquí podrías navegar a una vista de todas las notificaciones
          setIsNotificationOpen(false);
          history("/notifications");
          // O simplemente marcar todas como vistas:
          // setNotification([]);
        }}
      >
        View all notifications
      </button>
    )}
  </div>
</div>
        <div>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-lg transition-colors hover:cursor-pointer"
          >
            <img
              src={user.pic}
              className="w-8 h-8 bg-cover rounded-full"
              alt={user.name}
            />
            <span>{user.name}</span>
            <Menu className="w-4" />
          </button>
          <div
            className={`
              absolute right-1 origin-top-right 
              transition-all duration-300 ease-in-out
              ${
                isOpenDropdown
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }
            `}
          >
            {isOpenDropdown && (
              <ul
                className="
                bg-gray-100 
                p-2 
                flex flex-col 
                rounded-xl 
                shadow-lg 
                border 
                border-gray-200
                w-48
              "
              >
                <button
                  className="
                  bg-gray-100 
                  p-2 
                  hover:bg-gray-200 
                  flex 
                  gap-2 
                  rounded-xl 
                  hover:cursor-pointer 
                  transition-colors 
                  mb-1
                  items-center"
                  onClick={openProfileModal}
                >
                  <User className="w-4 h-4" /> User Profile
                </button>
                <button
                  className="
                  bg-red-400 
                  text-white 
                  p-2  
                  flex 
                  gap-2 
                  rounded-xl 
                  hover:cursor-pointer 
                  transition-colors
                  items-center
                "
                  onClick={logoutHandler}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </ul>
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />

      <div
        id="searchUsers"
        className={`
          fixed top-0 left-0 w-full h-screen 
          bg-gray-900/50 
          transition-all duration-500 ease-in-out
          ${
            isSearchOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
        onClick={() => setIsSearchOpen(false)}
      >
        <div
          className={`
            bg-white md:w-[500px] h-full 
            transform transition-all duration-500 ease-in-out
            ${
              isSearchOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }
            shadow-lg
          `}
          id="searchUsersContainer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 flex justify-between">
            <span className="font-light text-2xl">Search Users</span>
            <button onClick={() => setIsSearchOpen(false)}>X</button>
          </div>
          <hr />
          <div className="m-5 flex gap-5">
            <input
              type="text"
              placeholder="Search for users"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-cyan-600"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <button
              className="bg-blue-500 text-white px-4 rounded-lg hover:cursor-pointer"
              onClick={handleSearch}
            >

                Search

            </button>
          </div>
          {isLoading && (
            <div className="flex justify-center items-center my-4">
              <span className="loader"></span>
            </div>
          )}
          <div className="m-5 flex flex-col gap-2">
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <div className="flex justify-center">
                <ChatLoading />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
