const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWishlist).post(protect, addToWishlist);
router.post('/toggle', protect, toggleWishlist);
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
