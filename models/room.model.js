const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

module.exports = (sequelize) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    room_number: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM(
        'icu',
        'general',
        'private',
        'surgery'
      ),
      allowNull: false
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'rooms',
    underscored: true,
    // No timestamp fields in the original table
  });

  // Define associations
  Room.associate = (models) => {
    Room.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });
  };

  return Room;
};