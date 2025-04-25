import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ChatContext = createContext()

const ChatProvider = ({children}) => {
    const [user, setUser] = useState()
    const history = useNavigate()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    

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

    // Método para cerrar sesión y limpiar estados
    const logout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
        setSelectedChat(null);
        setChats([]);
        history('/');
    }

    return (
        <ChatContext.Provider value={{user, setUser, updateUser, setSelectedChat, chats, setChats, selectedChat, logout, notification, setNotification}}>
            {children}
        </ChatContext.Provider>
    );
}
export const ChatState =()=> {
    return useContext(ChatContext);
}


export default ChatProvider