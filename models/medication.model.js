const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

module.exports = (sequelize) => {
  const Medication = sequelize.define('Medication', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    medical_record_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    medication_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dosage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    frequency: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    route: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    prescribing_doctor_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    notes: {
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
    tableName: 'medications',
    timestamps: false, // Using manual timestamp fields
    underscored: true,
    hooks: {
      beforeUpdate: (medication) => {
        medication.updated_at = new Date();
      }
    }
  });

  // Define associations
  Medication.associate = (models) => {
    Medication.belongsTo(models.MedicalRecord, {
      foreignKey: 'medical_record_id',
      as: 'medicalRecord'
    });
    
    Medication.belongsTo(models.User, {
      foreignKey: 'prescribing_doctor_id',
      as: 'prescribingDoctor'
    });
  };

  return Medication;
};