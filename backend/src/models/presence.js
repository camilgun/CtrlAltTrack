const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

class Presence extends Model {}

Presence.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('check_in', 'check_out'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: true
  },
  method: {
    type: DataTypes.ENUM('qr_code', 'nfc', 'manual'),
    allowNull: false,
    defaultValue: 'manual'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Presence',
  indexes: [
    {
      fields: ['userId', 'timestamp']
    },
    {
      fields: ['type', 'timestamp']
    }
  ]
});

Presence.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Presence, { foreignKey: 'userId' });

module.exports = Presence;
