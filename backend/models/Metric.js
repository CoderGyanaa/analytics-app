const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  visitors: {
    type: Number,
    default: 0
  },
  pageViews: {
    type: Number,
    default: 0
  },
  bounceRate: {
    type: Number, // percentage
    default: 0
  },
  avgSessionDuration: {
    type: Number, // seconds
    default: 0
  },
  conversionRate: {
    type: Number, // percentage
    default: 0
  },
  newUsers: {
    type: Number,
    default: 0
  },
  returningUsers: {
    type: Number,
    default: 0
  },
  mobileUsers: {
    type: Number,
    default: 0
  },
  desktopUsers: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Metric', metricSchema);
