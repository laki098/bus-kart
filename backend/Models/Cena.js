import { DataTypes } from "sequelize";
import db from "../dbConfig.js";

const Cena = db.define(
  "Cena",
  {
    pocetnaStanica: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    krajnjaStanicaR: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cenaKarte: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cena",
  }
);

export default Cena;
