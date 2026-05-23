const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String }
  },
  product: {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Food'],
      required: true
    },
    sku: { type: String }
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  profit: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'refunded', 'cancelled'],
    default: 'completed'
  },
  channel: {
    type: String,
    enum: ['organic', 'paid_search', 'social', 'email', 'direct', 'referral'],
    default: 'organic'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Auto-calculate profit before save
saleSchema.pre('save', function(next) {
  this.profit = this.revenue - this.cost;
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
