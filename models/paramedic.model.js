const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Paramedic = sequelize.define('Paramedic', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    national_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    station: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    license_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    certified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    tableName: 'paramedics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['national_id']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['license_number']
      }
    ]
  });
  
  Paramedic.associate = (models) => {
    // 1. Relationship with AmbulanceRequests (paramedic can have many requests)
    Paramedic.hasMany(models.AmbulanceRequest, {
      foreignKey: 'paramedic_id',
      as: 'ambulance_requests'
    });

    // 2. Relationship with Users (if your system has user accounts)
    Paramedic.belongsTo(models.User, {
      foreignKey: 'user_id',  // You might need to add this field
      as: 'user_account'
    });

    // 3. Relationship with Visits (if paramedics create visits)
    Paramedic.hasMany(models.Visit, {
      foreignKey: 'paramedic_id',
      as: 'visits'
    });

    // 4. Relationship with Documents (if paramedics upload documents)
    Paramedic.hasMany(models.Document, {
      foreignKey: 'uploaded_by',
      as: 'uploaded_documents'
    });

    // 5. Relationship with Stations (if stations are a separate table)
    Paramedic.belongsTo(models.Station, {
      foreignKey: 'station_id',  // Would replace the station string field
      as: 'assigned_station'
    });
  };
  return Paramedic;
};