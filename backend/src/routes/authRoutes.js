const express = require('express');
const { register, login, getProfile, logout, deleteProfile } = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);
router.delete('/delete', authenticateToken, deleteProfile);

module.exports = router;