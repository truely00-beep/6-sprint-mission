// models/product.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      imagePath: {
        // 이미지 경로 필드 추가
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "products",
      timestamps: true, // createdAt, updatedAt
    }
  );

  Product.associate = (models) => {
    // Product 1 : N Comment. Product 삭제 시 연관된 Comment도 삭제 (CASCADE)
    Product.hasMany(models.Comment, {
      foreignKey: "productId",
      onDelete: "CASCADE",
    });
  };

  return Product;
};
