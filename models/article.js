// models/article.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Article = sequelize.define(
    "Article",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "articles",
      timestamps: true,
    }
  );

  Article.associate = (models) => {
    // Article 1 : N Comment. Article 삭제 시 연관된 Comment도 삭제 (CASCADE)
    Article.hasMany(models.Comment, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
    });
  };

  return Article;
};
