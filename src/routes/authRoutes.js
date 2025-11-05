const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { authValidation } = require('../middleware/validation');

router.post('/register', authValidation.register, authController.register);

router.post('/login', authValidation.login, authController.login);

router.get('/profile', authMiddleware, authController.getProfile);

router.patch('/profile', authMiddleware, authValidation.updateProfile, authController.updateProfile);

router.get('/verify-email', authController.verifyEmail);

module.exports = router;