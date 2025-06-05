const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const Hospital = sequelize.define('Hospital', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('public', 'private', 'military', 'teaching'),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      }
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    bed_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    size_category: {
      type: DataTypes.ENUM('small', 'medium', 'large'),
      allowNull: true
    },
    license_document_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
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
    tableName: 'hospitals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (hospital) => {
        hospital.updated_at = new Date();
      }
    }
  });

  // العلاقات مع الجداول الأخرى
  Hospital.associate = (models) => {
    Hospital.hasMany(models.Patient, {
      foreignKey: 'hospital_id',
      as: 'patients'
    });
    
    Hospital.hasMany(models.User, {
      foreignKey: 'hospital_id',
      as: 'staff'
    });
    Hospital.hasMany(models.Referral, { 
      foreignKey: 'from_hospital_id',
      as: 'outgoing_referrals' 
    });
    Hospital.hasMany(models.Referral, { 
      foreignKey: 'to_hospital_id',
      as: 'incoming_referrals' 
    });
    
  };

  return Hospital;
};