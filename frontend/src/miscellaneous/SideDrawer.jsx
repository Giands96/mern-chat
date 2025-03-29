import React, { useState } from "react";
import { BellRing, Bolt, LogOut, Menu, Search, User } from "lucide-react";
import { ChatState } from "../Context/ChatProvider";
import { ProfileModal } from "./ProfileModal";

export const SideDrawer = () => {
  //const [search, setSearch] = useState("");
  //const [searchResult, setSearchResult] = useState([]);
  //const [loading, setLoading] = useState(false);
  //const [loadingChat, setLoadingChat] = useState();
  const { user } = ChatState();
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
    console.log("Se Abrio el dropdown");
  };
  const openProfileModal = () =>{
    setIsProfileModalOpen(true);
    setIsOpenDropdown(false);
  }

  

  return (
    <div className="justify-between flex bg-white items-center p-2">
      <div className=" rounded-md  items-center">
        <button
          title="Search for users to chat"
          className="bg-gray-100 p-2 hover:bg-gray-200 flex gap-2 transition-all hover:cursor-pointer"
        >
          <Search />
          Search users
        </button>
      </div>
      <div>
        <span className="text-3xl font-light">MyTalkApp!</span>
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
            <img src={user.pic} className="w-8 rounded-full" alt="" />
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
    </div>

    
  );
};
