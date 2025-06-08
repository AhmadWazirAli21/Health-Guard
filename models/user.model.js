const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      }
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, 10);
      },
      beforeUpdate: (user) => {
        if (user.changed('password')) {
          user.password = bcrypt.hashSync(user.password, 10);
        }
      }
    }
  });

  User.associate = (models) => {
    // User has many appointments (as doctor)
    User.hasMany(models.Appointment, {
      foreignKey: 'doctor_id',
      as: 'appointments'
    });
    
    // User has many prescriptions (as doctor)
    User.hasMany(models.Prescription, {
      foreignKey: 'doctor_id',
      as: 'prescriptions'
    });
    
    // User has many medical records (as doctor)
    User.hasMany(models.MedicalRecord, {
      foreignKey: 'doctor_id',
      as: 'medical_records'
    });
    
    // User has many lab results (as doctor)
    User.hasMany(models.LabResult, {
      foreignKey: 'doctor_id',
      as: 'lab_results'
    });
    
    // User has many visits (as doctor)
    User.hasMany(models.Visit, {
      foreignKey: 'doctor_id',
      as: 'visits'
    });
    
    // User has many transactions
    User.hasMany(models.Transaction, {
      foreignKey: 'user_id',
      as: 'transactions'
    });
    
    // Many-to-many relationship with Role through UserRole
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'user_id',
      otherKey: 'role_id',
      as: 'roles'
    });
  };

  // Method to compare passwords
  User.prototype.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
  };

  return User;
};