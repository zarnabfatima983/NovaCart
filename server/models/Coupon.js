const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    minimumOrder: { type: Number, default: 0 },
    maximumDiscount: { type: Number },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return { valid: false, message: 'This coupon is no longer active' };
  if (new Date() > this.expiryDate) return { valid: false, message: 'This coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit)
    return { valid: false, message: 'This coupon has reached its usage limit' };
  return { valid: true };
};

module.exports = mongoose.model('Coupon', couponSchema);
