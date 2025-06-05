const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AmbulanceRequest = sequelize.define('AmbulanceRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,  // Changed from true to false as requests should have a patient
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    requested_by: {
      type: DataTypes.UUID,
      allowNull: false,  // Changed from true to false as requests should have a requester
      references: {
        model: 'users',
        key: 'id'
      }
    },
    paramedic_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',  // Changed to users table with role='paramedic'
        key: 'id'
      }
    },
    request_time: {
      type: DataTypes.DATE,
      allowNull: false,  // Changed from true to false
      defaultValue: DataTypes.NOW
    },
    pickup_location: {
      type: DataTypes.TEXT,
      allowNull: false  // Changed from true to false
    },
    dropoff_location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('requested', 'en_route', 'arrived', 'completed', 'cancelled'),
      defaultValue: 'requested',  // Added default value
      allowNull: false  // Changed from true to false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,  // Changed from true to false
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,  // Changed from true to false
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ambulancerequests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeUpdate: (request) => {
        // Auto-update logic when status changes
        if (request.status === 'completed' && request.changed('status')) {
          request.updated_at = new Date();
        }
      }
    }
  });

  // Define all relationships
  AmbulanceRequest.associate = (models) => {
    // 1. Relationship with Patient
    AmbulanceRequest.belongsTo(models.Patient, {
      foreignKey: 'patient_id',
      as: 'patient'
    });

    // 2. Relationship with Requester (from users table)
    AmbulanceRequest.belongsTo(models.User, {
      foreignKey: 'requested_by',
      as: 'requester'
    });

    // 3. Relationship with Paramedic (from users table with role=paramedic)
    AmbulanceRequest.belongsTo(models.User, {
      foreignKey: 'paramedic_id',
      as: 'paramedic',
      scope: {
        role: 'paramedic'
      }
    });

    // 4. Relationship with Visit (if ambulance requests create visits)
    AmbulanceRequest.hasOne(models.Visit, {
      foreignKey: 'ambulance_request_id',
      as: 'visit'
    });
  };

  return AmbulanceRequest;
};