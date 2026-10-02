const mongoose = require('mongoose');
const slugify = require('slugify');

const specificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: { type: String, unique: true },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: { type: String },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountedPrice: { type: Number },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
    },
    images: [{ type: String }],
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sold: { type: Number, default: 0 },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: { type: Number, default: 0 },
    specifications: [specificationSchema],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    weight: { type: Number },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Compute discounted price before save
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.discount > 0) {
    this.discountedPrice = +(this.price - (this.price * this.discount) / 100).toFixed(2);
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

// Stock status virtual
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= 10) return 'Low Stock';
  return 'In Stock';
});

// Static method to sync category product count
productSchema.statics.syncCategoryCount = async function (categoryId) {
  const Category = require('./Category');
  const count = await this.countDocuments({ category: categoryId, isActive: true });
  await Category.findByIdAndUpdate(categoryId, { productCount: count });
};

module.exports = mongoose.model('Product', productSchema);
