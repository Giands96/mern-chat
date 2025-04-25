const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req,res)=>{
   const { userId } = req.body;

   if(!userId) {
    console.log("El parametro userID no se envió correctamente")
    return res.sendStatus(400);
   }

   var isChat = await Chat.find({
    isGroupChat:false,
    $and: [
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users: {$elemMatch:{$eq:userId}}},
    ],
   }).populate("users","-password").populate("latestMessage");
   isChat = await User.populate(isChat,{
    path:'latestMessage.sender',
    select: 'name pic email',
   });

   if(isChat.length > 0) {
    res.send(isChat[0]);
   } else{
        var chatData = {
            chatName:"sender",
            isGroupChat: false,
            users: [req.user._id,userId],

        }

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password");
            res.status(200).send(FullChat);
        } catch (err){
            res.status(400);
            throw new Error(err.message);
        }
   }
})

const fetchChats = asyncHandler(async (req,res)=>{
    try {
        Chat.find({users : {$elemMatch:{$eq: req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage").sort({ updatedAt : -1}).then(async(results)=>{
            results = await User.populate(results,{
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

const createGroupChat = asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "Por favor llene todos los campos"});
    }

    let users = [];
    try {
        if (typeof req.body.users === 'string') {
            users = JSON.parse(req.body.users);
        } else if (Array.isArray(req.body.users)) {
            users = req.body.users;
        } else {
            return res.status(400).send({message: "El formato de usuarios es inválido"});
        }
    } catch (parseError) {
        console.error("Error al parsear usuarios:", parseError);
        return res.status(400).send({message: "Invalid users format: " + parseError.message});
    }

    // Asegurarse de que users siempre sea un array
    if (!Array.isArray(users)) {
        return res.status(400).send({message: "Users debe ser un array"});
    }

    if(users.length < 2){
        return res.status(400).send("Se requiere más de 2 personas para formar un chat grupal");
    }

    // Convertir todos los IDs a string para comparación
    const userIds = users.map(user => 
        typeof user === 'string' ? user : (user._id ? user._id.toString() : user)
    );
    
    // Asegurarse de que el creador esté en el grupo
    if (!userIds.includes(req.user._id.toString())) {
        users.push(req.user._id.toString());
    }
    
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
            pic: req.body.pic || "/groupchat.webp",
        }); 
       
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);
    }
    catch(err){
        console.error("Group Chat Creation Error:", err);
        res.status(400).send({message: err.message});
    }
});


const renameGroup = asyncHandler(async(req,res)=>{
    const { chatId, chatName } = req.body;
    
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,{
            chatName,
        },{
            new:true,
        }
    ).populate("users","-password").populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat no encontrado");
    } else{
        res.json(updatedChat);
    }
});


const addToGroup = asyncHandler(async(req,res)=>{
    const { chatId, userId } = req.body;
    
    // Verificar el chat para comprobar permisos
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
        res.status(404);
        throw new Error("Chat no encontrado");
    }
    
    // Solo el admin puede añadir usuarios
    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Solo los administradores pueden añadir usuarios");
    }
    
    // Comprobar si el usuario ya está en el grupo
    if (chat.users.includes(userId)) {
        res.status(400);
        throw new Error("El usuario ya está en el grupo");
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,{
            $push: { users:userId},
            
        },{new:true}
    ).populate("users", "-password")
    .populate("groupAdmin","-password");

    if(!added){
        res.status(404);
        throw new Error("Chat no encontrado");
    } else{
        res.json(added);
    }
})

const removeFromGroup = asyncHandler(async(req,res)=>{
    const { chatId, userId } = req.body;
    
    // Verificar el chat para comprobar permisos
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
        res.status(404);
        throw new Error("Chat no encontrado");
    }
    
    // Solo el admin puede eliminar a otros usuarios
    // Un usuario puede eliminarse a sí mismo
    if (chat.groupAdmin.toString() !== req.user._id.toString() && 
        userId !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Solo los administradores pueden eliminar a otros usuarios");
    }
    
    // Si intentan eliminar al admin y no son el admin
    if (chat.groupAdmin.toString() === userId && 
        req.user._id.toString() !== userId) {
        res.status(403);
        throw new Error("No puedes eliminar al administrador del grupo");
    }

    const removed = await Chat.findByIdAndUpdate(
        chatId,{
            $pull: { users:userId},
            
        },{new:true}
    ).populate("users", "-password")
    .populate("groupAdmin","-password");

    if(!removed){
        res.status(404);
        throw new Error("Chat no encontrado");
    } else{
        res.json(removed);
    }
})

const updateGroupPic = asyncHandler(async(req,res)=>{
    const { chatId, pic } = req.body;
    
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,{
            pic,
        },{
            new:true,
        }
    ).populate("users","-password").populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat no encontrado");
    } else{
        res.json(updatedChat);
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, updateGroupPic }