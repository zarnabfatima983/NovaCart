const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Please provide a coupon code');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  const validity = coupon.isValid();
  if (!validity.valid) {
    res.status(400);
    throw new Error(validity.message);
  }

  if (orderTotal < coupon.minimumOrder) {
    res.status(400);
    throw new Error(`Minimum order amount of $${coupon.minimumOrder} required for this coupon`);
  }

  // Calculate discount
  let discountAmount;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderTotal * coupon.discountValue) / 100;
    if (coupon.maximumDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, orderTotal);
  }

  discountAmount = Math.round(discountAmount * 100) / 100;

  res.status(200).json({
    success: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      description: coupon.description,
    },
  });
});

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, coupons });
});

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.status(200).json({ success: true, coupon });
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.status(200).json({ success: true, message: 'Coupon deactivated' });
});

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
