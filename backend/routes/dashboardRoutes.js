// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Rota para buscar as estatísticas, apenas para admins
router.get('/dashboard/stats', verifyAdmin, getStats);

module.exports = router;