// backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { getMeusEventos } = require('../controllers/usuarioController');
const { verifyToken } = require('../middleware/authMiddleware');

// Rota para buscar os eventos criados e inscritos do usuário logado
router.get('/usuarios/meus-eventos', verifyToken, getMeusEventos);

module.exports = router;