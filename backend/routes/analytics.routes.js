const express = require('express');
const {
  getKPIs, getRevenueTrend, getCategoryBreakdown,
  getChannelPerformance, getGeoBreakdown, getRecentActivity
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);
router.get('/kpis', getKPIs);
router.get('/revenue-trend', getRevenueTrend);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/channel-performance', getChannelPerformance);
router.get('/geo-breakdown', getGeoBreakdown);
router.get('/recent-activity', getRecentActivity);

module.exports = router;
