const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'checked_in', 'completed', 'cancelled', 'no_show'),
      defaultValue: 'scheduled',
      allowNull: false
    },
    visit_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'appointments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return Appointment;
};