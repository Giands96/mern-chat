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

dotenv.config();
connectDB()
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));

app.use(express.json()); // aceptar data JSON

app.get('/',(req,res) => {
    res.send("la API está ejecutandose satisfactoriamente");
});
app.get('/api/upload/test',(req,res) => {
    res.send("la API está ejecutandose satisfactoriamente");
});

app.use('/api/user', userRoutes)
app.post('/api/upload', upload.single('image'), uploadImageRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Servidor iniciado en el puerto ${PORT}`.yellow.bold));


