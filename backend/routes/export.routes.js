const express = require('express');
const { exportSales, exportAnalytics } = require('../controllers/export.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);
router.get('/sales', exportSales);
router.get('/analytics', exportAnalytics);

module.exports = router;
