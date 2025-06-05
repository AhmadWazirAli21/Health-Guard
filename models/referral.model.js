const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Referral = sequelize.define('Referral', {
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
    from_hospital_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'hospitals',
        key: 'id'
      }
    },
    to_hospital_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'hospitals',
        key: 'id'
      }
    },
    referred_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    referral_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    follow_up_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    tableName: 'referrals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeUpdate: (referral) => {
        if (referral.status === 'completed' && referral.changed('status')) {
          referral.follow_up_required = false; // Auto-update when completed
        }
      }
    }
  });

  // Define relationships
  Referral.associate = (models) => {
    // 1. Relationship with Patient
    Referral.belongsTo(models.Patient, {
      foreignKey: 'patient_id',
      as: 'patient'
    });

    // 2. Relationship with Referring Hospital
    Referral.belongsTo(models.Hospital, {
      foreignKey: 'from_hospital_id',
      as: 'from_hospital'
    });

    // 3. Relationship with Receiving Hospital
    Referral.belongsTo(models.Hospital, {
      foreignKey: 'to_hospital_id',
      as: 'to_hospital'
    });

    // 4. Relationship with Referring Doctor
    Referral.belongsTo(models.Doctor, {
      foreignKey: 'referred_by',
      as: 'referring_doctor'
    });

    // 5. Relationship with ReferralDocuments (if exists)
    Referral.hasMany(models.ReferralDocument, {
      foreignKey: 'referral_id',
      as: 'documents'
    });

    // 6. Relationship with FollowUps (if exists)
    Referral.hasMany(models.FollowUp, {
      foreignKey: 'referral_id',
      as: 'follow_ups'
    });
    Referral.belongsTo(models.User, {
        foreignKey: 'referred_by',
        as: 'referring_user'
      });
  };

  return Referral;
};