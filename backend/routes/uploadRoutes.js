const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtro para asegurarse de que solo se suban imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño: 5 MB
});

// Ruta para subir imágenes
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No se subió ninguna imagen');
  }

  // Devolver la URL de la imagen subida
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;