const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, getFeaturedProducts, getNewArrivals,
  getFlashSaleProducts, getRelatedProducts, createProduct, updateProduct,
  deleteProduct, getSearchSuggestions, getRecommendations, getInventory,
} = require('../controllers/productController');
const { getProductReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

// Special routes (before :id)
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/recommendations', getRecommendations);
router.get('/admin/inventory', protect, admin, getInventory);

// Main CRUD
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProduct).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

// Related products
router.get('/:id/related', getRelatedProducts);

// Reviews
router.get('/:id/reviews', getProductReviews);
router.post('/reviews', protect, createReview);
router.route('/reviews/:id').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
