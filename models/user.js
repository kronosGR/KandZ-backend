const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      name: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      email: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.DataTypes.STRING, allowNull: false },
      passwordsalt: { type: Sequelize.DataTypes.STRING, allowNull: false },
      pic: { type: Sequelize.DataTypes.STRING, defaultValue: 'default.png' },
    },
    { timestamps: false }
  );

  User.associate = function (models) {
    User.belongsTo(models.Role);
    User.hasMany(models.Post);
  };
  return User;
};
