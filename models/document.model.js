const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const Document = sequelize.define('Document', {
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
        model: 'patients', // Reference to patients table
        key: 'id'
      }
    },
    visit_id: {
      type: DataTypes.UUID,
      allowNull: true, // Optional as some documents might not be visit-specific
      references: {
        model: 'visits', // Reference to visits table
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    document_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Assuming you have a users table
        key: 'id'
      }
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'documents',
    timestamps: false, // We're using uploaded_at instead
    underscored: true
  });
  
  Document.associate = (models) => {
    Document.belongsTo(models.Patient, { foreignKey: 'patient_id' });
    Document.belongsTo(models.Visit, { 
      foreignKey: 'visit_id',
      allowNull: true // Maintains the optional nature
    });
    Document.belongsTo(models.User, { 
      foreignKey: 'uploaded_by',
      as: 'Uploader' // Gives a clear alias
    });
  };

  return Document;
};