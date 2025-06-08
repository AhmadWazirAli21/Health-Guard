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
      allowNull: true,
      references: {
        model: 'hospitals',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'clinical',
        'support',
        'administrative'
      ),
      allowNull: false
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    head_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeUpdate: (department) => {
        department.updated_at = new Date();
      }
    }
  });

  Department.associate = (models) => {
    // Department belongs to a Hospital
    Department.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      as: 'hospital'
    });

    // Department has many Appointments
    Department.hasMany(models.Appointment, {
      foreignKey: 'department_id',
      as: 'appointments'
    });

    // Department has many Visits
    Department.hasMany(models.Visit, {
      foreignKey: 'department_id',
      as: 'visits'
    });

    // Department has many Users (doctors/staff)
    Department.hasMany(models.User, {
      foreignKey: 'department_id',
      as: 'staff'
    });

    // Department has one Head (User)
    Department.belongsTo(models.User, {
      foreignKey: 'head_user_id',
      as: 'head'
    });

    // Department has many Beds
    Department.hasMany(models.Bed, {
      foreignKey: 'department_id',
      as: 'beds'
    });

    // Department has many Rooms
    Department.hasMany(models.Room, {
      foreignKey: 'department_id',
      as: 'rooms',
      onDelete: 'SET NULL', // or 'CASCADE' as per your requirements
      onUpdate: 'CASCADE'
    });
  };

  return Department;
};