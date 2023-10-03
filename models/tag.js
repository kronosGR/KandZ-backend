const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
    name: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
  });

  Tag.associate = function (models) {
    Tag.belongsToMany(models.Post, { through: 'TagPost' });
  };
  return Tag;
};
