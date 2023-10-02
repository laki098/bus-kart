import { DataTypes } from "sequelize";
import db from "../dbConfig.js";
import Linija from "./LinijaModels.js";
import Stanica from "./StanicaModels.js";
import Korisnik from "./KorisnikModels.js";

const Rezervacija = db.define(
  "Rezervacija",
  {
    brojMesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    polaznaStanicaR: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    krajnjaStanicaR: {
      type: DataTypes.STRING,
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
    vremePolaska: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    vremeDolaska: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    osvezenje: {
      type: DataTypes.STRING,
    },
    cekiran: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    oznakaSedista: {
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

Rezervacija.belongsTo(Korisnik, { foreignKey: "korisnikId" });
Korisnik.hasMany(Rezervacija, { foreignKey: "korisnikId" });

export default Rezervacija;
