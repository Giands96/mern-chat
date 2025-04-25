const express = require('express');
const dotenv = require('dotenv');
const {chats} = require("./data/data");
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = express();
const colors = require('colors');
const { upload, uploadImageRoute } = require('./config/cloudinaryConfig');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');


dotenv.config();
connectDB()
app.use(cors({
    origin: ['http://localhost:5173'],

    credentials: true
  }));

app.use(express.json()); // aceptar data JSON

app.get('/',(req,res) => {
    res.send("la API está ejecutandose satisfactoriamente");
});
app.get('/api/upload/test',(req,res) => {
    res.send("la API está ejecutandose satisfactoriamente");
});
app.use('/api/chat',chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message',messageRoutes)
app.post('/api/upload', upload.single('image'), uploadImageRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Servidor iniciado en el puerto ${PORT}`.yellow.bold));


const io = require('socket.io')(server,{
    pingTimeout: 60000,    
    cors:{
        origin: ['http://localhost:5173'],
        credentials: true
    },
})

io.on('connection',(socket) => {
    console.log('Un usuario se ha conectado');
    socket.on('setup',(userData) => {
        socket.join(userData._id);
        console.log('Un usuario se ha conectado: '+ userData._id);
        socket.emit('connected');
    })
    socket.on('join chat',(room) => {
        socket.join(room);
        console.log('Un usuario se ha unido a la sala: '+ room); 

    })
    socket.on('typing',(room) => socket.in(room).emit('typing'));
    socket.on('stop typing',(room) => socket.in(room).emit('stop typing'));
    socket.on('disconnect',() => {
        console.log('Un usuario se ha desconectado');
    })

    

    socket.on('new message',(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users){
            return console.log('chat.users no definido');
        }
        chat.users.forEach(user=> {
            if(user._id == newMessageRecieved.sender._id){
                return;
            }
            socket.in(user._id).emit('message recieved',newMessageRecieved);
        })
    })
})
