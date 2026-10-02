const express = require('express');
const router = express.Router();
const { getUsers, getUser, toggleUserStatus, addRecentlyViewed, getRecentlyViewed, getAdminStats } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getUsers);
router.get('/admin/stats', protect, admin, getAdminStats);
router.post('/recently-viewed', protect, addRecentlyViewed);
router.get('/recently-viewed', protect, getRecentlyViewed);
router.get('/:id', protect, admin, getUser);
router.put('/:id/toggle-status', protect, admin, toggleUserStatus);

module.exports = router;
