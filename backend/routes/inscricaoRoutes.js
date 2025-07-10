// backend/routes/inscricaoRoutes.js
const express = require('express');
const router = express.Router();
const { inscreverEmEvento, cancelarInscricao, listarMinhasInscricoes, verificarStatusInscricao } = require('../controllers/inscricaoController');
const { verifyToken } = require('../middleware/authMiddleware');

// Note a estrutura da URL: a ação está acontecendo em um evento específico
router.post('/eventos/:id/inscrever', verifyToken, inscreverEmEvento);
router.delete('/eventos/:id/inscrever', verifyToken, cancelarInscricao);
router.get('/meus-eventos', verifyToken, listarMinhasInscricoes);
router.get('/eventos/:id/inscricao/status', verifyToken, verificarStatusInscricao);

module.exports = router;