// models/comment.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      productId: {
        // 중고마켓 상품 ID (Nullable: 게시글 댓글일 수 있음)
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      articleId: {
        // 자유게시판 게시글 ID (Nullable: 상품 댓글일 수 있음)
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "comments",
      timestamps: true,
    }
  );

  Comment.associate = (models) => {
    // Product와의 관계 설정
    Comment.belongsTo(models.Product, {
      foreignKey: "productId",
    });
    // Article과의 관계 설정
    Comment.belongsTo(models.Article, {
      foreignKey: "articleId",
    });
  };

  return Comment;
};
