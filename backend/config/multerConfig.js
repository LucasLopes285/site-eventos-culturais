// backend/config/multerConfig.js
const multer = require('multer');
const path = require('path');

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único para evitar conflitos (ex: 1717864200000.jpg)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;