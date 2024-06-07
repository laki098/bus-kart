/* import { DataTypes } from "sequelize";
import db from "../dbConfig.js";
import Linija from "./LinijaModels.js";
import Stanica from "./StanicaModels.js";
import Korisnik from "./KorisnikModels.js"; */

const { DataTypes } = require("sequelize");
const db = require("../dbConfig.js");
const Stanica = require("./StanicaModels.js");
const Linija = require("./LinijaModels.js");
const Korisnik = require("./KorisnikModels.js");

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
    tipKarte: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,

      validate: {
        isEmail: {
          args: true,
          msg: "unesite ispravno mejl",
        },

        notEmpty: {
          args: true,
          msg: "email ne sme biti prazno polje",
        },
      },
    },
    imeIprezime: {
      type: DataTypes.STRING,
    },
    brojTelefona: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "broj telefona ne sme biti prazno polje",
        },
      },
    },
    kola: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
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

module.exports = Rezervacija;
