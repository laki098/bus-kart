/* import { DataTypes } from "sequelize";
import db from "../dbConfig.js"; */

const { DataTypes } = require("sequelize");
const db = require("../dbConfig.js");

const Bus = db.define(
  "autobusi",
  {
    idAutobusa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    oznakaBusa: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Oznaka autobusa vec postoji",
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Oznaka autobusa ne sme biti prazna",
        },
      },
    },
    tablice: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Tablica vec postoji",
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Polje tablice ne sme biti prazno",
        },
      },
    },
    brojSedista: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 1,
        max: 100,
        notEmpty: {
          args: true,
          msg: "Broj sedista ne sme biti prazno polje",
        },
      },
    },
  },
  {
    tableName: "autobusi",
    modelName: "Bus",
  }
);

module.exports = Bus;
