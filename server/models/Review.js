const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    title: { type: String, maxlength: 100 },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to update product average rating
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product);
});

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
