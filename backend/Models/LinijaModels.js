import { DataTypes } from "sequelize";
import db from "../dbConfig.js";
import Stanica from "./StanicaModels.js";

const Linija = db.define(
  "Linija",
  {
    vremePolaska: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    vremeDolaska: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    datumPolaska: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    datumDolaska: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    brojSlobodnihMesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    oznakaBusa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "linija",
    modelName: "Bus",
  }
);

// Veza između Linije i Stanica - Pocetna stanica
Linija.belongsTo(Stanica, {
  as: "pocetnaStanica",
  foreignKey: "pocetnaStanicaId",
});
Stanica.hasMany(Linija, { foreignKey: "pocetnaStanicaId" });

// Veza između Linije i Stanica - Krajnja stanica
Linija.belongsTo(Stanica, {
  as: "krajnjaStanica",
  foreignKey: "krajnjaStanicaId",
});
Stanica.hasMany(Linija, { foreignKey: "krajnjaStanicaId" });

export default Linija;
