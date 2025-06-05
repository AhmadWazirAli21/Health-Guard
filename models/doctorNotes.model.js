const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const DoctorNote = sequelize.define('DoctorNote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    visit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'visits', // Assuming you have a visits table
        key: 'id'
      }
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'doctors', // Assuming you have a doctors table
        key: 'id'
      }
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'doctornotes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // No updated_at field in your schema
    underscored: true
  });

  DoctorNote.associate = (models) => {
    DoctorNote.belongsTo(models.Visit, { foreignKey: 'visit_id' });
    DoctorNote.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
  };

  return DoctorNote;
};