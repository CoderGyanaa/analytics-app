const Sale = require('../models/Sale');

// Convert array of objects to CSV string
const toCSV = (data, fields) => {
  const header = fields.join(',');
  const rows = data.map(item =>
    fields.map(field => {
      const keys = field.split('.');
      let val = item;
      for (const k of keys) val = val?.[k];
      // Quote strings containing commas
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
      return val ?? '';
    }).join(',')
  );
  return [header, ...rows].join('\n');
};

// @desc    Export sales as CSV
// @route   GET /api/export/sales
const exportSales = async (req, res) => {
  try {
    const { startDate, endDate, status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter['product.category'] = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const sales = await Sale.find(filter).sort({ date: -1 }).lean();

    const fields = [
      'orderId', 'customer.name', 'customer.email', 'customer.country',
      'product.name', 'product.category', 'quantity',
      'revenue', 'cost', 'profit', 'status', 'channel', 'date'
    ];

    const csv = toCSV(sales, fields);
    const filename = `sales_export_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export analytics summary
// @route   GET /api/export/analytics
const exportAnalytics = async (req, res) => {
  try {
    const data = await Sale.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: '$revenue' },
          totalProfit: { $sum: '$profit' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$revenue' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const fields = ['_id', 'totalRevenue', 'totalProfit', 'totalOrders', 'avgOrderValue'];
    const csv = toCSV(data, fields);
    const filename = `analytics_summary_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { exportSales, exportAnalytics };
