import { DataTypes } from "sequelize";
import db from "../dbConfig.js";

const Korisnik = db.define(
  "korisnik",
  {
    idKorisnik: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    korisnickoIme: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Korisnicko ime vec postoji",
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Korisnicko ime ne sme biti prazno polje",
        },
        validateKorisnicko(korisnicko) {
          if (korisnicko.trim().length < 5) {
            throw new Error("korisnicko mora biti duza od 5 karaktera");
          }
        },
      },
    },
    lozinka: {
      type: DataTypes.STRING,
      validate: {
        validPassword(lozinka) {
          if (lozinka.trim().length < 8) {
            throw new Error("Lozinka mora biti duza od 8 karaktera");
          }
        },
        notEmpty: {
          args: true,
          msg: "Lozinka ne sme biti prazno polje",
        },
      },
    },
    ime: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "ime ne sme biti prazno polje",
        },
      },
    },
    prezime: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "prezime ne sme biti prazno polje",
        },
      },
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
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email vec postoji",
      },
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
    role: {
      type: DataTypes.STRING,
      defaultValue: "korisnik",
    },
    validan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifikacijskiToken: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    resetToken: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
  },

  {
    tableName: "korisnik",
  }
);

export default Korisnik;
