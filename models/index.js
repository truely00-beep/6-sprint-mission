// models/index.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// PostgreSQL 연결 설정 (DB_CONNECTION_STRING 환경 변수 사용)
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: "postgres",
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델 로드
db.Product = require("./product")(sequelize, Sequelize);
db.Article = require("./article")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);

// 관계 설정 적용
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
