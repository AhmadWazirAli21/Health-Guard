const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prescription = sequelize.define('Prescription', {
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
        model: 'doctors',
        key: 'id'
      }
    },
    visit_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'visits',
        key: 'id'
      }
    },
    medication_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id'
      }
    },
    dosage: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    frequency: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prescribed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    tableName: 'prescriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  // Define relationships
  Prescription.associate = (models) => {
    // 1. Relationship with Patient
    Prescription.belongsTo(models.Patient, {
      foreignKey: 'patient_id',
      as: 'patient'
    });

    // 2. Relationship with Doctor
    Prescription.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });

    // 3. Relationship with Visit (optional)
    Prescription.belongsTo(models.Visit, {
      foreignKey: 'visit_id',
      as: 'visit',
      allowNull: true
    });

    // 4. Relationship with Medication
    Prescription.belongsTo(models.Medication, {
      foreignKey: 'medication_id',
      as: 'medication'
    });

    // 5. Relationship with PrescriptionFulfillments (if exists)
    Prescription.hasMany(models.PrescriptionFulfillment, {
      foreignKey: 'prescription_id',
      as: 'fulfillments'
    });
    Prescription.belongsTo(models.User, {
        foreignKey: 'doctor_id',
        as: 'prescribing_user',
        scope: {
          role: 'doctor' // Only associate with users who are doctors
        }
      });
  };

  return Prescription;
};