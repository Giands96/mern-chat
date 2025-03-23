const mongoose = require('mongoose');
const colors = require('colors')


const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI,{

        });
        console.log(`MongoDB Conectado: ${connect.connection.host}`.cyan.underline)
    } catch (err){
        console.log(`Error:  ${err.message}`.red.bold);
        process.exit()
        
    }
}

module.exports = connectDB;