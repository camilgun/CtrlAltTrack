const Presence = require('../models/presence');
const User = require('../models/user');
const { Op } = require('sequelize');

class PresenceController {
  static async register(req, res) {
    try {
      const { type, location, method, notes } = req.body;
      const userId = req.user.id;

      // Validate presence type
      if (!['check_in', 'check_out'].includes(type)) {
        return res.status(400).json({ message: 'Invalid presence type' });
      }

      // Create presence record
      const presence = await Presence.create({
        userId,
        type,
        location: location ? { type: 'Point', coordinates: [location.longitude, location.latitude] } : null,
        method,
        notes
      });

      res.status(201).json({
        message: 'Presence registered successfully',
        presence
      });
    } catch (error) {
      res.status(500).json({ message: 'Error registering presence', error: error.message });
    }
  }

  static async getUserPresences(req, res) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      const whereClause = {
        userId
      };

      if (startDate && endDate) {
        whereClause.timestamp = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const presences = await Presence.findAll({
        where: whereClause,
        order: [['timestamp', 'DESC']],
        include: [{
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }]
      });

      res.json({ presences });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching presences', error: error.message });
    }
  }

  static async getTodayPresences(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const presences = await Presence.findAll({
        where: {
          timestamp: {
            [Op.between]: [today, tomorrow]
          }
        },
        include: [{
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }],
        order: [['timestamp', 'DESC']]
      });

      res.json({ presences });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching today\'s presences', error: error.message });
    }
  }

  static async verifyPresence(req, res) {
    try {
      const { id } = req.params;
      const presence = await Presence.findByPk(id);

      if (!presence) {
        return res.status(404).json({ message: 'Presence record not found' });
      }

      presence.verified = true;
      await presence.save();

      res.json({
        message: 'Presence verified successfully',
        presence
      });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying presence', error: error.message });
    }
  }
}

module.exports = PresenceController;
