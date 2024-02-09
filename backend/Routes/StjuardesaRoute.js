/* import express from "express";
import Linija from "../Models/LinijaModels.js";
import Stanica from "../Models/StanicaModels.js";
import Bus from "../Models/BusModels.js";
import Medjustanica from "../Models/MedjustanicaModels.js"; */

const express = require("express");
const Linija = require("../Models/LinijaModels.js");
const Stanica = require("../Models/StanicaModels.js");
const Bus = require("../Models/BusModels.js");
const Medjustanica = require("../Models/MedjustanicaModels.js");

const router = express.Router();

router.get("/:idKorisnika", async (req, res) => {
  try {
    const idStjuardese = req.params.idKorisnika;

    const oznakaBusa = req.params.oznakaBusa;
    const izvlacenjeLinija = await Linija.findAll({
      where: {
        stjuardesa: idStjuardese,
      },
      include: [
        {
          model: Stanica,
          as: "pocetnaStanica",
        },
        {
          model: Stanica,
          as: "krajnjaStanica",
        },

        Stanica,
      ],
    });

    res.status(200).json({ message: "uspešno izvađena", izvlacenjeLinija });
  } catch (error) {
    res.status(500).json({ message: "bag" });
  }
});

router.get("/filterLinija/:id", async (req, res) => {
  try {
    const id = req.params.id;

    //!USLOV DA PITAM DA LI JE BAS TA STJUARDESA

    const izvlacenjeLinija = await Linija.findOne({
      where: { id: id },
      include: [
        {
          model: Stanica,
          as: "pocetnaStanica",
        },
        {
          model: Stanica,
          as: "krajnjaStanica",
        },

        Stanica,
      ],
    });

    res.status(200).json({ message: "uspešno izvađena st", izvlacenjeLinija });
  } catch (error) {
    res.status(500).json({ message: "bag" });
  }
});

//? promena vremena za pocetak i kraj rute na medjustanici
router.put("/promenaVremena", async (req, res) => {
  try {
    const { linijaId, redosled, promeniPocetakRute, promeniKrajRute } =
      req.body;

    const medjustanica = await Medjustanica.findOne({
      where: { linijaId, redosled },
    });

    if (!medjustanica) {
      return res.status(404).json({ message: "Međustanica nije pronađena." });
    }

    //? Dodelite trenutno vreme za novo vreme polaska i novo vreme dolaska.
    const trenutnoVreme = new Date();
    //? da vidimo da li je pocetak ili kraj rute
    if (promeniPocetakRute) {
      medjustanica.pocetakRute = trenutnoVreme;
    }
    if (promeniKrajRute) {
      medjustanica.krajRute = trenutnoVreme;
    }

    //? Sačuvajte promene u bazi podataka.
    await medjustanica.save();

    return res.status(200).json({ message: "Vreme je uspešno promenjeno." });
  } catch (error) {
    res.status(500).json({ message: "bag" });
  }
});

//? promena vremena za pocetak i kraj rute na medjustanici
router.put("/promenaVremenaLinija", async (req, res) => {
  try {
    const { linijaId, promeniPocetakRute, promeniKrajRute } = req.body;

    const linija = await Linija.findOne({
      where: { id: linijaId },
    });

    console.log(linija);

    if (!linija) {
      return res.status(404).json({ message: "linija nije pronađena." });
    }

    //? Dodelite trenutno vreme za novo vreme polaska i novo vreme dolaska.
    const trenutnoVreme = new Date();
    //? da vidimo da li je pocetak ili kraj rute
    if (promeniPocetakRute) {
      linija.pocetakRute = trenutnoVreme;
    }
    if (promeniKrajRute) {
      linija.krajRute = trenutnoVreme;
    }

    //? Sačuvajte promene u bazi podataka.
    await linija.save();

    return res.status(200).json({ message: "Vreme je uspešno promenjeno." });
  } catch (error) {
    res.status(500).json({ message: "bag" });
  }
});

module.exports = router;
