const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, categories });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    $or: [
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      { slug: req.params.id },
    ],
  });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json({ success: true, category });
});

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json({ success: true, category });
});

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category with ${productCount} associated products`);
  }

  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted successfully' });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
