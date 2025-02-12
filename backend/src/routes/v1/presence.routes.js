const express = require('express');
const router = express.Router();
const PresenceController = require('../../controllers/presence.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Presence registration
router.post('/register', PresenceController.register);

// Get user's presence history
router.get('/user/:userId', PresenceController.getUserPresences);

// Get today's presences
router.get('/today', PresenceController.getTodayPresences);

// Verify presence (admin only)
router.patch('/:id/verify', PresenceController.verifyPresence);

module.exports = router;
