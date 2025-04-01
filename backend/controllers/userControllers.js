const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')
const cloudinary = require('../config/cloudinaryConfig');

const registerUser = asyncHandler ( async (req,res) =>{
    const {name,email,password,pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Porfavor ingrese todos los campos")
    }

    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400);
        throw new Error('El usuario ya existe');
    }

    const user = await User.create({
        name,email,password,pic
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        }); 
    } else {
        res.status(400);
        throw new Error ('Creación de Usuario fallido')
    }


});

const authUser = asyncHandler (async(req,res) => {
    const { email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Correo o contraseña inválida')
    }
});

//Api Users
const allUsers = asyncHandler (async(req,res)=>{
    const keyW = req.query.search ? {
        $or: [ {
            name: { $regex: req.query.search, $options: 'i'}
         },
        {
            email: { $regex: req.query.search, $options: 'i'}
        }]
    }: {};

    const users = await User.find({ ...keyW, _id: { $ne: req.user._id } });
    res.send(users);
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    console.log("Datos recibidos", req.user.name, req.user.email, req.user.pic)

    if (user) {
      user.name = req.body.name || user.name;
      user.pic = req.body.pic || user.pic;
  
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        pic: updatedUser.pic,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
  });


  

module.exports = { registerUser, authUser, allUsers, updateUserProfile }