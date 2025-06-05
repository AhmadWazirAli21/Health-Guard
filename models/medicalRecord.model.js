const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

module.exports = (sequelize) => {
  const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // assuming doctors are in users table
        key: 'id'
      }
    },
    visit_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    symptoms: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    medications: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    procedures: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lab_results: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // URLs to attachments
      allowNull: true,
      defaultValue: []
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'medicalrecords',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (record) => {
        record.updated_at = new Date();
      }
    }
  });

  MedicalRecord.associate = (models) => {
    MedicalRecord.belongsTo(models.Patient, {
      foreignKey: 'patient_id',
      as: 'patient'
    });
    
    MedicalRecord.belongsTo(models.User, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });
  };

  return MedicalRecord;
};