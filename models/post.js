const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define(
    'Post',
    {
      title: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      content: { type: Sequelize.DataTypes.TEXT('long'), allowNull: false },
      enabledComment: { type: Sequelize.DataTypes.BOOLEAN, defaultValue: false },
      featuredImage: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'defaultFeatured.png',
      },
    },
    {
      timestamps: true,
    }
  );

  Post.associate = function (models) {
    Post.belongsTo(models.User);
    Post.belongsToMany(models.Tag, { through: 'TagPost' });
  };

  return Post;
};
