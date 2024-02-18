/* import { Sequelize } from "sequelize"; */

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.DEPLOY==='1' ? "mariadb" : "mysql",
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//? pravi Modele(tabele u bazi) ako ne postoje
sequelize.sync();

module.exports = sequelize;
