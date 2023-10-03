const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define(
    'Setting',
    {
      // id: {type:Sequelize.DataTypes.INTEGER, autoIncrement:true, primaryKey:true}
      tile: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.DataTypes.STRING, allowNull: false },
      url: { type: Sequelize.DataTypes.STRING, allowNull: false },
      featuredPosts: Sequelize.DataTypes.STRING,
    },
    { timestamps: false }
  );

  return Setting;
};
