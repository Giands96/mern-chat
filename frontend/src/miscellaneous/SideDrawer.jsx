import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BellRing, Bolt, LogOut, Menu, Search, User } from "lucide-react";
import { ChatState } from "../Context/ChatProvider";
import { ProfileModal } from "./ProfileModal";
import axios from "axios";
import { ChatLoading } from "../components/ChatLoading";
import { UserListItem } from "../UserAvatar/UserListItem";

export const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [notifications, setNotifications] = useState([]);
  
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  }
  
  const handleSearch = async () => {
    if(!search){
      alert('Please enter a search term');
      return;
    }
    
    try {
      setLoading(true);
      const config = {
        headers: {
          
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      }
      const {data} = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert('Error fetching search results');
      console.error(error);
      setLoading(false);
    }
  }

  const toggleOpenSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  }

  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };
  
  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsOpenDropdown(false);
  }

  const accessChat = async (userId) => {
    try {  
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post("/api/chat",{ userId },config);
      console.log("User ID" , userId);
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
  alert('Error fetching chat: ' + (error.response?.data?.message || error.message));
  setLoadingChat(false);
    }
  };

  return (
    <div className="fixed w-full justify-between flex bg-white items-center px-5 py-2">
      <div>
        <span className="text-3xl font-light">MyTalkApp!</span>
      </div>
      <div className="rounded-md items-center">
        <button
          title="Search for users to chat"
          className="bg-gray-100 px-10 py-2 rounded-xl hover:bg-gray-200 flex gap-2 transition-all hover:cursor-pointer"
          onClick={toggleOpenSearch}
        >
          <Search />
          Search users
        </button>
      </div>
      
      <div id="menu" className="flex items-center gap-2">
        <div>
          <button
            title="Notifications"
            className="hover:cursor-pointer hover:bg-gray-200 p-2 transition-colors rounded-full"
          >
            <BellRing />
          </button>
        </div>
        <div>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-lg transition-colors hover:cursor-pointer"
          >
            <img src={user.pic} className="w-8 h-8 bg-cover rounded-full" alt={user.name} />
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
          ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
        onClick={() => setIsSearchOpen(false)}
      >
        <div
          className={`
            bg-white w-1/5 h-full 
            transform transition-all duration-500 ease-in-out
            ${isSearchOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
            shadow-lg
          `}
          id="searchUsersContainer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <span className="font-light text-2xl">Search Users</span>
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
            <button className="bg-blue-500 text-white px-4 rounded-lg hover:cursor-pointer" onClick={handleSearch}>
              Search
            </button>
          </div>
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
            {loadingChat && <div className="flex justify-center"><ChatLoading /></div>}
          </div>
        </div>
      </div>
    </div>
  );
};