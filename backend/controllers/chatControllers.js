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
            const FullChat = await Chat.findOne({_id:createdChat._id}).populate("user","-password");
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

    let users;
    try {
        // Try parsing the users, handling both string and array inputs
        users = typeof req.body.users === 'string' 
            ? JSON.parse(req.body.users) 
            : req.body.users;
    } catch (parseError) {
        return res.status(400).send({message: "Invalid users format"});
    }

    // Ensure users is an array
    if (!Array.isArray(users)) {
        return res.status(400).send({message: "Users must be an array"});
    }

    if(users.length < 2){
        return res.status(400).send("Se requiere más de 2 personas para formar un chat grupal")
    }

    // Use a Set to remove duplicates and ensure the creator is added
    const userIds = new Set(users.map(user => 
        typeof user === 'string' ? user : user._id.toString()
    ));
    
    // Check if the current user is already in the group
    if (!userIds.has(req.user._id.toString())) {
        users.push(req.user);
    }
    
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        }); 
       
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat)
    }
    catch(err){
        console.error("Group Chat Creation Error:", err);
        res.status(400).send({message: err.message});
    }
})


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

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }