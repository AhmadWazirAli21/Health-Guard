const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Visit = sequelize.define('Visit', {
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
        model: 'users', // Using your users table with role='doctor'
        key: 'id'
      }
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    appointment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'appointments',
        key: 'id'
      }
    },
    visit_type: {
      type: DataTypes.ENUM('outpatient', 'inpatient', 'emergency'),
      allowNull: false
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'completed', 'cancelled'),
      defaultValue: 'in_progress',
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'visits',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeUpdate: (visit) => {
        // Auto-set check_out_time when status changes to completed
        if (visit.status === 'completed' && !visit.check_out_time) {
          visit.check_out_time = new Date();
        }
      }
    }
  });

  // Define all relationships
  Visit.associate = (models) => {
    // 1. Relationship with Patient
    Visit.belongsTo(models.Patient, {
      foreignKey: 'patient_id',
      as: 'patient'
    });

    // 2. Relationship with Doctor (from users table)
    Visit.belongsTo(models.User, {
      foreignKey: 'doctor_id',
      as: 'doctor',
      scope: {
        role: 'doctor'
      }
    });

    // 3. Relationship with Department
    Visit.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });

    // 4. Relationship with Appointment (optional)
    Visit.belongsTo(models.Appointment, {
      foreignKey: 'appointment_id',
      as: 'appointment'
    });

    // 5. Relationship with Prescriptions
    Visit.hasMany(models.Prescription, {
      foreignKey: 'visit_id',
      as: 'prescriptions'
    });

    // 6. Relationship with DoctorNotes
    Visit.hasMany(models.DoctorNote, {
      foreignKey: 'visit_id',
      as: 'notes'
    });

    // 7. Relationship with Documents
    Visit.hasMany(models.Document, {
      foreignKey: 'visit_id',
      as: 'documents'
    });

    // 8. Relationship with Invoices
    Visit.hasMany(models.Invoice, {
      foreignKey: 'visit_id',
      as: 'invoices'
    });
  };

  return Visit;
};