const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, updateOrderStatus, getAllOrders, getAnalytics } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin/analytics', protect, admin, getAnalytics);
router.route('/:id').get(protect, getOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
