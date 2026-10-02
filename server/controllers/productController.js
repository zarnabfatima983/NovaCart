const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Build query from filters
const buildProductQuery = (queryParams) => {
  const {
    keyword, category, brand, minPrice, maxPrice,
    rating, discount, inStock, colors, sizes, tags,
    isFeatured, isNewArrival, isOnSale,
  } = queryParams;

  const query = { isActive: true };

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { tags: { $in: [new RegExp(keyword, 'i')] } },
    ];
  }

  if (category) query.category = category;
  if (brand) query.brand = { $in: brand.split(',').map((b) => new RegExp(b.trim(), 'i')) };
  if (minPrice || maxPrice) {
    query.discountedPrice = {};
    if (minPrice) query.discountedPrice.$gte = Number(minPrice);
    if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };
  if (discount) query.discount = { $gte: Number(discount) };
  if (inStock === 'true') query.stock = { $gt: 0 };
  if (colors) query.colors = { $in: colors.split(',') };
  if (sizes) query.sizes = { $in: sizes.split(',') };
  if (tags) query.tags = { $in: tags.split(',') };
  if (isFeatured === 'true') query.isFeatured = true;
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (isOnSale === 'true') query.isOnSale = true;

  return query;
};

// Build sort
const buildSort = (sortBy) => {
  const sorts = {
    newest: { createdAt: -1 },
    price_asc: { discountedPrice: 1 },
    price_desc: { discountedPrice: -1 },
    rating: { rating: -1 },
    popular: { sold: -1 },
    discount: { discount: -1 },
    featured: { isFeatured: -1, createdAt: -1 },
  };
  return sorts[sortBy] || sorts.featured;
};

// @desc    Get all products (with filters, search, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sort || 'featured';

  const query = buildProductQuery(req.query);
  const sort = buildSort(sortBy);

  const [products, total] = await Promise.all([
    Product.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }],
    isActive: true,
  }).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({ success: true, product });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.status(200).json({ success: true, products });
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.status(200).json({ success: true, products });
});

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isOnSale: true, isActive: true, discount: { $gte: 20 } })
    .populate('category', 'name slug')
    .sort({ discount: -1 })
    .limit(6);
  res.status(200).json({ success: true, products });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(6);

  res.status(200).json({ success: true, products: related });
});

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  // Update category product count
  await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });
  res.status(201).json({ success: true, product });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  res.status(200).json({ success: true, product });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Get search suggestions
// @route   GET /api/products/search/suggestions
// @access  Public
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });

  const products = await Product.find({
    name: { $regex: q, $options: 'i' },
    isActive: true,
  })
    .select('name brand images discountedPrice')
    .limit(6);

  res.status(200).json({ success: true, suggestions: products });
});

// @desc    Get recommended products
// @route   GET /api/products/recommendations
// @access  Public/Private
const getRecommendations = asyncHandler(async (req, res) => {
  const { categoryIds, excludeIds } = req.query;

  let query = { isActive: true };
  if (categoryIds) {
    query.category = { $in: categoryIds.split(',') };
  }
  if (excludeIds) {
    query._id = { $nin: excludeIds.split(',') };
  }

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort({ rating: -1, sold: -1 })
    .limit(8);

  res.status(200).json({ success: true, products });
});

// @desc    Get inventory overview (Admin)
// @route   GET /api/products/admin/inventory
// @access  Private/Admin
const getInventory = asyncHandler(async (req, res) => {
  const [inStock, lowStock, outOfStock] = await Promise.all([
    Product.countDocuments({ stock: { $gt: 10 }, isActive: true }),
    Product.countDocuments({ stock: { $gt: 0, $lte: 10 }, isActive: true }),
    Product.countDocuments({ stock: 0, isActive: true }),
  ]);

  const lowStockProducts = await Product.find({ stock: { $gt: 0, $lte: 10 }, isActive: true })
    .select('name stock brand images')
    .sort({ stock: 1 })
    .limit(10);

  res.status(200).json({ success: true, inStock, lowStock, outOfStock, lowStockProducts });
});

module.exports = {
  getProducts, getProduct, getFeaturedProducts, getNewArrivals,
  getFlashSaleProducts, getRelatedProducts, createProduct, updateProduct,
  deleteProduct, getSearchSuggestions, getRecommendations, getInventory,
};
