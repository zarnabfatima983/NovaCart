const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'name images price discount discountedPrice rating numReviews brand stock'
  );
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);

  if (user.wishlist.includes(productId)) {
    return res.status(200).json({ success: true, message: 'Product already in wishlist', inWishlist: true });
  }

  user.wishlist.push(productId);
  await user.save();

  await user.populate('wishlist', 'name images price discount discountedPrice rating numReviews brand stock');

  res.status(200).json({ success: true, message: 'Added to wishlist', wishlist: user.wishlist });
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();

  await user.populate('wishlist', 'name images price discount discountedPrice rating numReviews brand stock');

  res.status(200).json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist });
});

// @desc    Toggle wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  const isInWishlist = user.wishlist.includes(productId);

  if (isInWishlist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  await user.populate('wishlist', 'name images price discount discountedPrice rating numReviews brand stock');

  res.status(200).json({
    success: true,
    inWishlist: !isInWishlist,
    message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
    wishlist: user.wishlist,
  });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, toggleWishlist };
