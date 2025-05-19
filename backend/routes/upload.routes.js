// backend/routes/upload.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadPca } = require('../controllers/upload.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Configurar o armazenamento para os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configurar o multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB 
});

// Rota para upload de PCA
router.post('/pca', upload.single('file'), uploadPca);

module.exports = router;