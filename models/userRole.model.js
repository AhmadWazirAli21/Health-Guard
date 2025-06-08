const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users', // This references the 'users' table
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'roles', // This references the 'roles' table
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'userroles',
    timestamps: false, // Assuming no created_at/updated_at columns
    underscored: true,
    // Composite primary key setup
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'role_id']
      }
    ]
  });

  // If you need to add any associations or hooks:
  UserRole.associate = (models) => {
    // Associations from UserRole to User and Role can be defined here if needed,
    // e.g., UserRole.belongsTo(models.User, { foreignKey: 'user_id' });
    // UserRole.belongsTo(models.Role, { foreignKey: 'role_id' });
    // However, these are often not necessary if User and Role define the belongsToMany.
  };

  return UserRole;
};