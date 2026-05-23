const Sale = require('../models/Sale');
const Metric = require('../models/Metric');
const User = require('../models/User');

// Helper to build date filter
const buildDateFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  return filter;
};

// @desc    Get KPI summary cards
// @route   GET /api/analytics/kpis
const getKPIs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const [salesData, prevSalesData] = await Promise.all([
      Sale.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$revenue' },
            totalProfit: { $sum: '$profit' },
            totalOrders: { $sum: 1 },
            totalQuantity: { $sum: '$quantity' }
          }
        }
      ]),
      // Previous period comparison (30 days back)
      Sale.aggregate([
        {
          $match: {
            status: 'completed',
            date: {
              $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$revenue' },
            totalOrders: { $sum: 1 }
          }
        }
      ])
    ]);

    const current = salesData[0] || { totalRevenue: 0, totalProfit: 0, totalOrders: 0, totalQuantity: 0 };
    const previous = prevSalesData[0] || { totalRevenue: 0, totalOrders: 0 };

    const revenueGrowth = previous.totalRevenue
      ? (((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100).toFixed(1)
      : 0;
    const ordersGrowth = previous.totalOrders
      ? (((current.totalOrders - previous.totalOrders) / previous.totalOrders) * 100).toFixed(1)
      : 0;

    const userCount = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalRevenue: current.totalRevenue,
        totalProfit: current.totalProfit,
        totalOrders: current.totalOrders,
        totalQuantity: current.totalQuantity,
        activeUsers: userCount,
        revenueGrowth: parseFloat(revenueGrowth),
        ordersGrowth: parseFloat(ordersGrowth),
        profitMargin: current.totalRevenue
          ? ((current.totalProfit / current.totalRevenue) * 100).toFixed(1)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Revenue over time (line chart)
// @route   GET /api/analytics/revenue-trend
const getRevenueTrend = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const groupFormat = groupBy === 'month'
      ? { year: { $year: '$date' }, month: { $month: '$date' } }
      : { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } };

    const data = await Sale.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$revenue' },
          profit: { $sum: '$profit' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 90 }
    ]);

    const formatted = data.map(item => ({
      date: groupBy === 'month'
        ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
        : `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day || 1).padStart(2, '0')}`,
      revenue: item.revenue,
      profit: item.profit,
      orders: item.orders
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sales by category (donut/bar chart)
// @route   GET /api/analytics/category-breakdown
const getCategoryBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const data = await Sale.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: '$revenue' },
          orders: { $sum: 1 },
          profit: { $sum: '$profit' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const formatted = data.map(item => ({
      category: item._id,
      revenue: item.revenue,
      orders: item.orders,
      profit: item.profit,
      percentage: totalRevenue ? ((item.revenue / totalRevenue) * 100).toFixed(1) : 0
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sales by channel
// @route   GET /api/analytics/channel-performance
const getChannelPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const data = await Sale.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: '$channel',
          revenue: { $sum: '$revenue' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$revenue' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({ success: true, data: data.map(d => ({ ...d, channel: d._id, _id: undefined })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Top countries by revenue
// @route   GET /api/analytics/geo-breakdown
const getGeoBreakdown = async (req, res) => {
  try {
    const data = await Sale.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$customer.country',
          revenue: { $sum: '$revenue' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, data: data.map(d => ({ country: d._id, revenue: d.revenue, orders: d.orders })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Recent activity feed
// @route   GET /api/analytics/recent-activity
const getRecentActivity = async (req, res) => {
  try {
    const sales = await Sale.find({ status: 'completed' })
      .sort({ date: -1 })
      .limit(10)
      .select('orderId customer.name product.name revenue date channel');

    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getKPIs,
  getRevenueTrend,
  getCategoryBreakdown,
  getChannelPerformance,
  getGeoBreakdown,
  getRecentActivity
};
