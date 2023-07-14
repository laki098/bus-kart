import { DataTypes } from "sequelize";

import db from "../dbConfig.js";

const Grad = db.define(
  "grad",
  {
    idGrad: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nazivGrada: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Polje naziv grada ne sme biti prazno",
        },
      },
    },
    napomena: {
      type: DataTypes.STRING,
    },
    ostalo: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "grad",
  }
);

export default Grad;
