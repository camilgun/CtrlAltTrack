const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;
