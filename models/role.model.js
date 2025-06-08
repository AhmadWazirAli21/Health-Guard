const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'roles',
    timestamps: false, // Assuming your table doesn't have created_at/updated_at columns
    underscored: true
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: models.UserRole,      // Specify the join table
      foreignKey: 'role_id',       // Foreign key in UserRole that points to Role
      otherKey: 'user_id',         // Foreign key in UserRole that points to User
      as: 'users'                  // Alias for the association (e.g., role.getUsers())
    });
  };

  return Role;
};