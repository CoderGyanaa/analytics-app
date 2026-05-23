const express = require('express');
const { getSales, createSale, updateSale, deleteSale } = require('../controllers/sales.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);
router.get('/', getSales);
router.post('/', authorize('admin', 'analyst'), createSale);
router.put('/:id', authorize('admin', 'analyst'), updateSale);
router.delete('/:id', authorize('admin'), deleteSale);

module.exports = router;
