import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ChatContext = createContext()

const ChatProvider = ({children}) => {
    const [user, setUser] = useState()
    const history = useHistory()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([]);


    useEffect(()=>{
       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
       setUser(userInfo);

       //if(!userInfo){
        //history.push('/')
       //}
    },[history]);

    //Metodo para actualizar info Usuario

    const updateUser = (updatedUserInfo) =>{
        localStorage.setItem('userInfo',JSON.stringify({
            ...user,...updatedUserInfo
        }));

        setUser(prevUser =>({
            ...prevUser,...updatedUserInfo
        }));
    }


    return (
        <ChatContext.Provider value={{user, setUser,updateUser, setSelectedChat, chats, setChats, selectedChat}}>
            {children}
        </ChatContext.Provider>
    );
}
export const ChatState =()=> {
    return useContext(ChatContext);
}


export default ChatProvider