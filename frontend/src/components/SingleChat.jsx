import React, { useEffect, useState, useRef, memo, useCallback } from "react";
import { ChatState } from "../Context/ChatProvider";
import { ArrowLeftFromLine, EllipsisVertical, Send } from "lucide-react";
import { getSender, getSenderUser } from "../config/ChatLogics";
import "../styles/loader.css";
import { UpdateGroupChatModal } from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";

// Componente ChatInput memoizado para evitar re-renders innecesarios
const ChatInput = memo(({ newMessage, setNewMessage, sendMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  return (
    <form className="flex items-center gap-2 mt-2">
      <input
        type="text"
        className="bg-white w-full p-2 rounded-l border border-gray-300"
        placeholder="Start with a message"
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        value={newMessage}
      />
      <button
        type="button"
        onClick={sendMessage}
        disabled={!newMessage.trim()}
        className={`p-2 rounded-r ${
          newMessage.trim() 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } transition-colors`}
      >
        <Send size={20} />
      </button>
    </form>
  );
});

export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const [openProfile, setOpenProfile] = useState(false);

  // Función para hacer scroll automático al fondo del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

 
  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage.trim()) {
      event.preventDefault();
      
      // Guardar el mensaje que se está enviando
      const messageToSend = newMessage;
      
      // Crear un ID temporal para el mensaje optimista
      const tempId = `temp-${Date.now()}`;
      
      // Crear un mensaje optimista para la UI
      const optimisticMessage = {
        _id: tempId,
        content: messageToSend,
        sender: {
          _id: user._id,
          name: user.name,
          pic: user.pic
        },
        chat: selectedChat,
        createdAt: new Date().toISOString()
      };
      
      // Limpiar el campo de entrada inmediatamente
      setNewMessage("");
      
      // Actualizar la UI inmediatamente con el mensaje optimista
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
      
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        // Enviar mensaje al servidor
        const { data } = await axios.post(
          "/api/message",
          {
            content: messageToSend,
            chatId: selectedChat._id,
          },
          config
        );
        
        // Reemplazar el mensaje optimista con el mensaje real del servidor
        setMessages(prevMessages => 
          prevMessages.map(msg => msg._id === tempId ? data : msg)
        );
        
        // Notificar cambios si es necesario
        if (setFetchAgain) {
          setFetchAgain(!fetchAgain);
        }
        
      } catch (error) {
        console.error("Error sending message:", error);
        // Marcar el mensaje como fallido (puedes agregar un estilo visual para indicarlo)
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === tempId ? {...msg, sendFailed: true} : msg
          )
        );
      }
    }
  };

  function handleProfileClick() {
    setOpenProfile(true);
  }

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  }, [selectedChat, user.token]);
  
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Limpiar mensajes al cambiar de chat
    setMessages([]);
    
    if (selectedChat) {
      fetchMessages();
    }
    
    // El scroll automático se ejecutará después de que se actualicen los mensajes
  }, [selectedChat]);
  
  // Y luego otro useEffect separado solo para el scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para determinar si un mensaje es del usuario actual
  const isSelfMessage = (msg) => {
    return msg.sender._id === user._id;
  };

  // Función para renderizar un mensaje con estilo condicional
  const renderMessage = (msg) => {
    const isSelf = isSelfMessage(msg);
    const hasError = msg.sendFailed;
    
    return (
      <div 
        key={msg._id} 
        className={`flex mb-2 ${isSelf ? 'justify-end' : 'justify-start'}`}
      >
        {!isSelf && (
          <div className="mr-2 flex-shrink-0">
            <img 
              src={msg.sender.pic} 
              alt="sender" 
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
        <div 
          className={`px-4 py-2 rounded-lg max-w-xs break-words ${
            isSelf
              ? hasError 
                ? 'bg-red-100 text-red-600 border border-red-300 rounded-br-none' 
                : 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}
        >
          {msg.content}
          {hasError && (
            <span className="text-xs ml-2 text-red-500">
              ⚠️ Error
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full h-full bg-white border-gray-100 rounded-lg overflow-hidden">
          <div className="flex flex-col h-full p-5">
            <div className="flex items-center justify-between">
              {!selectedChat.isGroupChat ? (
                <>
                  <div className="flex items-center gap-2">
                    {getSenderUser(user, selectedChat.users) ? (
                      <>
                        <img
                          src={selectedChat.users[1].pic}
                          className="w-8 h-8 rounded-full"
                          alt="User Avatar"
                        />
                        <span className="text-xl font-light">
                          {getSender(user, selectedChat.users)}
                        </span>
                        <button
                          onClick={handleProfileClick}
                          title="Mirar Perfil"
                          className="text-gray-400 hover:cursor-pointer hover:bg-neutral-100 rounded-sm transition-colors"
                        >
                          <EllipsisVertical />
                        </button>

                        {openProfile && (
                          <>
                            <div className="fixed inset-0 flex items-center justify-center bg-neutral-700/25 bg-opacity-50 z-50">
                              <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex justify-center flex-col items-center transform transition-all duration-300 ease-out scale-100 opacity-100 animate-modal-appear">
                                <div className="flex flex-col items-center">
                                  <img
                                    src={
                                      getSenderUser(user, selectedChat.users)
                                        .pic
                                    }
                                    alt="User Avatar"
                                    className="bg-gray-200 object-contain md:object-cover w-24 h-24  rounded-full mb-4"
                                  />
                                  <div className="text-center">
                                    <span className="font-light">
                                      Username:
                                    </span>
                                    <h2 className="text-lg font-semibold">
                                      {getSender(user, selectedChat.users)}
                                    </h2>
                                    <span className="font-light">Email:</span>
                                    <p className="text-gray-600">
                                      {
                                        getSenderUser(user, selectedChat.users)
                                          .email
                                      }
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setOpenProfile(false)}
                                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                            <style jsx>{`
                              @keyframes modal-appear {
                                from {
                                  opacity: 0;
                                  transform: scale(0);
                                }
                                to {
                                  opacity: 1;
                                  transform: scale(1);
                                }
                              }

                              .animate-modal-appear {
                                animation: modal-appear 0.2s ease-in-out
                                  forwards;
                              }
                            `}</style>
                          </>
                        )}
                      </>
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/groupchat.webp"
                      alt=""
                    />
                    <span className="text-xl font-light">
                      {selectedChat.chatName}
                    </span>
                    <span className="text-neutral-400 font-extralight">
                      {selectedChat.users.length > 2
                        ? selectedChat.users.map((user) => user.name).join(", ")
                        : selectedChat.users
                            .map((user) => user.name)
                            .join(", ") + "..."}
                    </span>
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    />
                    {}
                  </div>
                </>
              )}
              <button
                onClick={() => setSelectedChat("")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300 transition"
              >
                <ArrowLeftFromLine />
              </button>
            </div>
            <div className="flex flex-col h-full overflow-hidden rounded-lg bg-neutral-100 mt-4 p-2">
              {/* Área de mensajes con el sistema de scroll mejorado */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="loader"></span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 p-2 overflow-y-auto h-full"> 
                    {messages.map(renderMessage)}
                    {/* Elemento invisible para scroll automático */}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input de mensaje usando el componente ChatInput */}
              <ChatInput 
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center h-screen bg-white justify-center w-full text-4xl font-extralight">
          <p>Click on a user to start chatting</p>
        </div>
      )}
    </>
  );
};