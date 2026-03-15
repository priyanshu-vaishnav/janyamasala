const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/dashboard/stats — Admin dashboard summary
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalOrders, pendingOrders, totalRevenue,
      totalInquiries, newInquiries,
      totalRetailers, pendingRetailers,
      totalProducts
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      User.countDocuments({ role: 'retailer' }),
      User.countDocuments({ role: 'retailer', isApproved: false }),
      Product.countDocuments({ isActive: true })
    ]);

    // Last 7 days orders chart data
    const last7Days = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$total' } } },
      { $sort: { _id: 1 } }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('retailer', 'name company')
      .sort('-createdAt').limit(5);

    // Recent inquiries
    const recentInquiries = await Inquiry.find()
      .sort('-createdAt').limit(5);

    res.json({
      success: true,
      stats: {
        totalOrders, pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalInquiries, newInquiries,
        totalRetailers, pendingRetailers,
        totalProducts
      },
      charts: { last7Days },
      recentOrders,
      recentInquiries
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
