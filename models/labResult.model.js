const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const LabResult = sequelize.define('LabResult', {
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
    test_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    test_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    result_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    normal_range: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    unit: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'completed',
        'abnormal',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'pending'
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
    tableName: 'labresults',
    timestamps: false, // Using manual timestamp fields
    underscored: true,
    hooks: {
      beforeUpdate: (labResult) => {
        labResult.updated_at = new Date();
      }
    }
  });

  // Define associations
  LabResult.associate = (models) => {
    LabResult.belongsTo(models.MedicalRecord, {
      foreignKey: 'medical_record_id',
      as: 'medicalRecord'
    });
  };

  return LabResult;
};