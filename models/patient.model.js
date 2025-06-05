const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

module.exports = (sequelize) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    hospital_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    national_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    insurance_provider: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    insurance_number: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'patients',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (patient) => {
        patient.updated_at = new Date();
      }
    }
  });

  // Add any associations here
  Patient.associate = (models) => {
    Patient.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      as: 'hospital'
    });
    Patient.hasMany(models.Referral, { foreignKey: 'patient_id' });
    
    Patient.hasMany(models.Visit, {
      foreignKey: 'patient_id',
      as: 'visits'
    });
    
    // Add other associations as needed
  };

  return Patient;
};