/* import { DataTypes } from "sequelize";
import db from "../dbConfig.js"; */

const { DataTypes } = require("sequelize");
const db = require("../dbConfig.js");

const Stanica = db.define(
  "Stanica",
  {
    naziv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "stanica",
    modelName: "Bus",
  }
);

module.exports = Stanica;
