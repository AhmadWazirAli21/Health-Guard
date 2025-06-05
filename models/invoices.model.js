const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
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
    visit_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'visits',
        key: 'id'
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'cancelled'),
      allowNull: false,
      defaultValue: 'unpaid'
    },
    issued_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
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
    },
    // Add status field if you need to track failed/processed transactions
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'completed'
    }
  }, {
    tableName: 'invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeUpdate: (invoice) => {
        // Auto-update status based on payment amounts
        if (invoice.changed('paid_amount')) {
          if (invoice.paid_amount >= invoice.total_amount) {
            invoice.status = 'paid';
          } else if (invoice.paid_amount > 0) {
            invoice.status = 'partial';
          } else {
            invoice.status = 'unpaid';
          }
        }
      }
    }
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Patient, { foreignKey: 'patient_id' });
    Invoice.belongsTo(models.Visit, { 
      foreignKey: 'visit_id',
      allowNull: true 
    });
    Invoice.hasMany(models.Transaction, {
        foreignKey: 'invoice_id',
        as: 'transactions'
      });
  };
  // Add this to Invoice model:

  return Invoice;
};