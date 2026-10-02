const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    items, shippingAddress, paymentMethod, shippingMethod,
    couponCode, subtotal, shippingCost, tax, discount, total,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify stock and build order items
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      discount: product.discount,
      discountedPrice: product.discountedPrice,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    shippingMethod: shippingMethod || 'standard',
    couponCode,
    subtotal,
    shippingCost,
    tax,
    discount,
    total,
    isPaid: paymentMethod !== 'cod',
    paidAt: paymentMethod !== 'cod' ? new Date() : undefined,
  });

  // Decrement stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  // Increment coupon usage
  if (couponCode) {
    await Coupon.findOneAndUpdate({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
  }

  const populatedOrder = await Order.findById(order._id).populate('items.product', 'name images');

  res.status(201).json({ success: true, order: populatedOrder });
});

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only order owner or admin can view
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied');
  }

  res.status(200).json({ success: true, order });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  order.statusHistory.push({ status, note: note || `Order status updated to ${status}` });

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { status, search } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) query.orderNumber = { $regex: search, $options: 'i' };

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query),
  ]);

  res.status(200).json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get admin analytics
// @route   GET /api/orders/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalRevenue, totalOrders, pendingOrders,
    monthlyRevenue, revenueByMonth, ordersByStatus,
    topProducts,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments(),
    Order.countDocuments({ status: 'processing' }),
    Order.aggregate([
      { $match: { createdAt: { $gte: thisMonth }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.discountedPrice', '$items.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]),
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      pendingOrders,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      monthlyOrders: monthlyRevenue[0]?.count || 0,
      revenueByMonth,
      ordersByStatus,
      topProducts,
    },
  });
});

module.exports = { createOrder, getMyOrders, getOrder, updateOrderStatus, getAllOrders, getAnalytics };
