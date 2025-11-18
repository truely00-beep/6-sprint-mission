// DB_CONNECTION_STRING을 Sequelize CLI가 인식하도록 설정
require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "DB_CONNECTION_STRING",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DB_CONNECTION_STRING",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Render.com 등의 환경에서는 필요할 수 있음
      },
    },
  },
};
