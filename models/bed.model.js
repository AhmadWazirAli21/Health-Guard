const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const Bed = sequelize.define('Bed', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    bed_number: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_occupied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: 'beds',
    underscored: true,
    // No timestamp fields in the original table
  });

  // Define associations
  Bed.associate = (models) => {
    Bed.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room'
    });
    
    // Optional: If you want to track which patient is occupying the bed
    Bed.hasOne(models.PatientAssignment, {
      foreignKey: 'bed_id',
      as: 'patientAssignment'
    });
  };

  return Bed;
};