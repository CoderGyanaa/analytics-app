const Sale = require('../models/Sale');

// @desc    Get all sales with filters/pagination
// @route   GET /api/sales
const getSales = async (req, res) => {
  try {
    const {
      page = 1, limit = 20, status, category, channel,
      startDate, endDate, search, sortBy = 'date', sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter['product.category'] = category;
    if (channel) filter.channel = channel;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'product.name': { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [sales, total] = await Promise.all([
      Sale.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Sale.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new sale
// @route   POST /api/sales
const createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json({ success: true, message: 'Sale created', data: sale });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    res.json({ success: true, message: 'Sale updated', data: sale });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    res.json({ success: true, message: 'Sale deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSales, createSale, updateSale, deleteSale };
