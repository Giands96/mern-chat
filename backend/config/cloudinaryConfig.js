const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuracion
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuracion de almacenamiento Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// Image upload route
const uploadImageRoute = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Cloudinary automatically uploads the file
    res.status(200).json({ 
      message: 'Image uploaded successfully', 
      url: req.file.path // URL generada por Cloudinary
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};



module.exports = { 
  cloudinary, 
  upload, 
  uploadImageRoute 
};