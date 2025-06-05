const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const Department = sequelize.define('Department', {
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
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM(
        'clinical',
        'support',
        'administrative'
      ),
      allowNull: true
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    head_user_id: {
      type: DataTypes.UUID,
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
    tableName: 'departments',
    timestamps: false, // Using manual timestamp fields
    underscored: true,
    hooks: {
      beforeUpdate: (department) => {
        department.updated_at = new Date();
      }
    }
  });

  // Define associations
  Department.associate = (models) => {
    // Department belongs to a Hospital
    Department.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      as: 'hospital',
      onDelete: 'SET NULL', // or 'CASCADE' if you want to delete departments when hospital is deleted
      onUpdate: 'CASCADE'
    });
    
    // Department has one head (User)
    Department.belongsTo(models.User, {
      foreignKey: 'head_user_id',
      as: 'head',
      onDelete: 'SET NULL', // or 'CASCADE' as per your requirements
      onUpdate: 'CASCADE'
    });
    
    // Department has many staff members (Users)
    Department.hasMany(models.User, {
      foreignKey: 'department_id',
      as: 'staff',
      onDelete: 'SET NULL', // or 'CASCADE' as per your requirements
      onUpdate: 'CASCADE'
    });
    
    // Department has many Visits
    Department.hasMany(models.Visit, {
      foreignKey: 'department_id',
      as: 'visits',
      onDelete: 'SET NULL', // or 'CASCADE' as per your requirements
      onUpdate: 'CASCADE'
    });

    Appointment.hasOne(models.Visit, {
      foreignKey: 'appointment_id',
      as: 'resulting_visit',
      onDelete: 'SET NULL', // or 'CASCADE' as per your requirements
      onUpdate: 'CASCADE'
    });
  };

  return Department;
};