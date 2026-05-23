const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

const User = require('../models/User');
const Sale = require('../models/Sale');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/analytics_app';

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Food'];
const channels = ['organic', 'paid_search', 'social', 'email', 'direct', 'referral'];
const statuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'refunded'];
const countries = ['USA', 'UK', 'Germany', 'France', 'Canada', 'Australia', 'India', 'Japan', 'Brazil', 'Mexico'];
const cities = ['New York', 'London', 'Berlin', 'Paris', 'Toronto', 'Sydney', 'Mumbai', 'Tokyo', 'São Paulo', 'Mexico City'];

const products = {
  Electronics: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'iPad Air', 'MacBook Pro', 'Sony Headphones', 'Dell Monitor'],
  Clothing: ['Nike Running Shoes', 'Adidas Hoodie', 'Levi Jeans', 'Zara Dress', 'H&M T-Shirt', 'Uniqlo Jacket'],
  'Home & Garden': ['Dyson Vacuum', 'Instant Pot', 'KitchenAid Mixer', 'Garden Tools Set', 'LED Lamp', 'Bed Sheets'],
  Sports: ['Yoga Mat', 'Dumbbell Set', 'Bicycle Helmet', 'Tennis Racket', 'Running Belt', 'Protein Powder'],
  Books: ['Atomic Habits', 'The Lean Startup', 'Zero to One', 'Deep Work', 'Thinking Fast and Slow', 'Sapiens'],
  Beauty: ['Face Serum', 'Sunscreen SPF50', 'Lipstick Set', 'Hair Mask', 'Perfume Bottle', 'Eye Cream'],
  Toys: ['LEGO Set', 'Barbie Doll', 'Hot Wheels', 'Puzzle 1000pc', 'Board Game', 'Remote Control Car'],
  Food: ['Organic Coffee', 'Protein Bars', 'Olive Oil Set', 'Kombucha Pack', 'Granola Mix', 'Dark Chocolate']
};

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Logan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Davis', 'Wilson', 'Taylor'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

const generateOrderId = () => `ORD-${Date.now()}-${randomNum(1000, 9999)}`;

const generateSales = (count) => {
  const sales = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const category = randomItem(categories);
    const productName = randomItem(products[category]);
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const countryIdx = randomNum(0, countries.length - 1);
    const revenue = randomFloat(10, 2000);
    const costRatio = randomFloat(0.3, 0.7);
    const cost = parseFloat((revenue * costRatio).toFixed(2));
    const daysAgo = randomNum(0, 365);
    const saleDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    sales.push({
      orderId: `ORD-${Date.now()}-${i}-${randomNum(100, 999)}`,
      customer: {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum(1, 99)}@example.com`,
        country: countries[countryIdx],
        city: cities[countryIdx]
      },
      product: {
        name: productName,
        category,
        sku: `SKU-${category.slice(0, 3).toUpperCase()}-${randomNum(1000, 9999)}`
      },
      revenue,
      cost,
      profit: revenue - cost,
      quantity: randomNum(1, 10),
      status: randomItem(statuses),
      channel: randomItem(channels),
      date: saleDate
    });
  }
  return sales;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Clear existing data
    await Promise.all([User.deleteMany({}), Sale.deleteMany({})]);
    console.log('🗑️  Cleared existing data');

    // Create demo users
    const users = [
      { name: 'Admin User', email: 'admin@demo.com', password: 'Admin@123', role: 'admin' },
      { name: 'Sarah Analyst', email: 'analyst@demo.com', password: 'Analyst@123', role: 'analyst' },
      { name: 'John Viewer', email: 'viewer@demo.com', password: 'Viewer@123', role: 'viewer' }
    ];

    for (const u of users) {
      await User.create(u);
    }
    console.log('👥 Created 3 demo users');

    // Generate 500 sales entries
    const salesData = generateSales(500);
    await Sale.insertMany(salesData);
    console.log(`📊 Seeded ${salesData.length} sales records`);

    console.log('\n🎉 Seeding complete!\n');
    console.log('Demo Login Credentials:');
    console.log('─────────────────────────────');
    console.log('Admin:   admin@demo.com    / Admin@123');
    console.log('Analyst: analyst@demo.com  / Analyst@123');
    console.log('Viewer:  viewer@demo.com   / Viewer@123');
    console.log('─────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
