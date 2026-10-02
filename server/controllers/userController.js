const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { search } = req.query;

  const query = { role: 'customer' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  res.status(200).json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    user,
    stats: orderStats[0] || { totalOrders: 0, totalSpent: 0 },
  });
});

// @desc    Toggle user active status (Admin)
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot modify admin account');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    user,
  });
});

// @desc    Add recently viewed product
// @route   POST /api/users/recently-viewed
// @access  Private
const addRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  // Remove if already exists
  user.recentlyViewed = user.recentlyViewed.filter((id) => id.toString() !== productId);
  // Add to front
  user.recentlyViewed.unshift(productId);
  // Keep only last 10
  user.recentlyViewed = user.recentlyViewed.slice(0, 10);

  await user.save();
  res.status(200).json({ success: true });
});

// @desc    Get recently viewed products
// @route   GET /api/users/recently-viewed
// @access  Private
const getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'recentlyViewed',
    'name images price discount discountedPrice rating numReviews brand'
  );
  res.status(200).json({ success: true, products: user.recentlyViewed });
});

// @desc    Get admin stats
// @route   GET /api/users/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const [totalCustomers, newCustomersThisMonth] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    }),
  ]);

  const customerGrowth = await User.aggregate([
    { $match: { role: 'customer' } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({ success: true, totalCustomers, newCustomersThisMonth, customerGrowth });
});

module.exports = { getUsers, getUser, toggleUserStatus, addRecentlyViewed, getRecentlyViewed, getAdminStats };
