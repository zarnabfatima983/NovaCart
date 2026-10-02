const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: { type: String, unique: true },
    description: { type: String, maxlength: [500, 'Description cannot exceed 500 characters'] },
    image: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: '#6366f1' },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
