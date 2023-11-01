/* import { DataTypes } from "sequelize";
import db from "../dbConfig.js";
import Stanica from "./StanicaModels.js";
import Linija from "./LinijaModels.js"; */

const { DataTypes } = require("sequelize");
const db = require("../dbConfig.js");
const Stanica = require("./StanicaModels.js");
const Linija = require("./LinijaModels.js");

const Medjustanica = db.define(
  "Medjustanica",
  {
    redosled: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    brojSlobodnihMesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vremePolaskaM: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    vremeDolaskaM: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    datumPolaskaM: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    datumDolaskaM: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    pocetakRute: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    krajRute: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "medjustanica",
    modelName: "Bus",
  }
);

Linija.belongsToMany(Stanica, {
  through: Medjustanica,
  foreignKey: "linijaId",
  otherKey: "stanicaId",
});
Stanica.belongsToMany(Linija, {
  through: Medjustanica,
  foreignKey: "stanicaId",
  otherKey: "linijaId",
});

module.exports = Medjustanica;
