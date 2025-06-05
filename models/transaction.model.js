const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    invoice_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'invoices',
        key: 'id'
      }
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['cash', 'credit_card', 'debit_card', 'bank_transfer', 'insurance', 'mobile_payment']]
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    reference_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'transactions',
    timestamps: false, // We're using created_at instead
    underscored: true,
    hooks: {
      afterCreate: async (transaction) => {
        // Update invoice paid_amount when transaction is created
        const invoice = await transaction.getInvoice();
        await invoice.update({
          paid_amount: parseFloat(invoice.paid_amount) + parseFloat(transaction.amount)
        });
      }
    }
  });

  // Define relationships
  Transaction.associate = (models) => {
    // 1. Relationship with Invoice
    Transaction.belongsTo(models.Invoice, {
      foreignKey: 'invoice_id',
      as: 'invoice'
    });

    // 2. Relationship with PaymentMethod (if you normalize payment methods)
    Transaction.belongsTo(models.PaymentMethod, {
      foreignKey: 'payment_method_id', // Would replace payment_method string
      as: 'payment_method_detail'
    });
  };

  return Transaction;
};