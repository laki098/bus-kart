import { DataTypes } from "sequelize";
import db from "../dbConfig.js";

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

export default Stanica;
