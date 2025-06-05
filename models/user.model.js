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

  // Define associations
  Appointment.associate = (models) => {
    // Appointment belongs to a Patient (User)
    Appointment.belongsTo(models.User, {
      foreignKey: 'patient_id',
      as: 'patient',
      onDelete: 'SET NULL', // or 'CASCADE' based on requirements
      onUpdate: 'CASCADE'
    });

    // Appointment belongs to a Doctor (User)
    Appointment.belongsTo(models.User, {
      foreignKey: 'doctor_id',
      as: 'doctor',
      onDelete: 'SET NULL', // or 'CASCADE' based on requirements
      onUpdate: 'CASCADE'
    });

    // Appointment belongs to a Department
    Appointment.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department',
      onDelete: 'SET NULL', // or 'CASCADE' based on requirements
      onUpdate: 'CASCADE'
    });

    // Optional: If you have a Visit model and want to link appointments to visits
    Appointment.hasOne(models.Visit, {
      foreignKey: 'appointment_id',
      as: 'visit',
      onDelete: 'SET NULL', // or 'CASCADE' based on requirements
      onUpdate: 'CASCADE'
    });
  };

  return Appointment;
};