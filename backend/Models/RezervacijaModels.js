import { DataTypes } from "sequelize";
import db from "../dbConfig.js";
import Linija from "./LinijaModels.js";
import Stanica from "./StanicaModels.js";

const Rezervacija = db.define(
  "Rezervacija",
  {
    brojMesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "rezervacija",
  }
);

Rezervacija.belongsTo(Linija, { foreignKey: "linijaId" });
Linija.hasMany(Rezervacija, { foreignKey: "linijaId" });

// Veza između Linije i Stanica - Pocetna stanica
Rezervacija.belongsTo(Stanica, {
  as: "pocetnaStanica",
  foreignKey: "pocetnaStanicaId",
});
Stanica.hasMany(Linija, { foreignKey: "pocetnaStanicaId" });

// Veza između Linije i Stanica - Krajnja stanica
Rezervacija.belongsTo(Stanica, {
  as: "krajnjaStanica",
  foreignKey: "krajnjaStanicaId",
});
Stanica.hasMany(Rezervacija, { foreignKey: "krajnjaStanicaId" });

export default Rezervacija;
