const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: req.params.id }),
  ]);

  // Rating distribution
  const distribution = await Review.aggregate([
    { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(req.params.id) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  res.status(200).json({ success: true, reviews, total, page, pages: Math.ceil(total / limit), distribution });
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { product: productId, rating, comment, title } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if already reviewed
  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // Check verified purchase
  const order = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    status: 'delivered',
  });

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
    title,
    isVerifiedPurchase: !!order,
  });

  await review.populate('user', 'name avatar');

  res.status(201).json({ success: true, review });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;
  review.title = req.body.title || review.title;

  await review.save();
  await review.populate('user', 'name avatar');

  res.status(200).json({ success: true, review });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  await review.deleteOne();

  res.status(200).json({ success: true, message: 'Review deleted' });
});

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
