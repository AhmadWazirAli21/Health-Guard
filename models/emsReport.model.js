const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  const EmsReport = sequelize.define('EmsReport', {
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
    paramedic_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    patient_temp_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    chief_complaint: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interventions: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    vitals: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    incident_location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    handoff_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'emsreports',
    timestamps: false, // Using manual timestamp field
    underscored: true,
    // No updated_at field in the original table
  });

  // Define associations
  EmsReport.associate = (models) => {
    EmsReport.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      as: 'hospital'
    });
    
    EmsReport.belongsTo(models.User, {
      foreignKey: 'paramedic_id',
      as: 'paramedic'
    });
  };

  return EmsReport;
};