/* import express from "express";
import Rezervacija from "../Models/RezervacijaModels.js";
import Linija from "../Models/LinijaModels.js";
import Stanica from "../Models/StanicaModels.js";
import Medjustanica from "../Models/MedjustanicaModels.js"; */

const express = require("express");
const Rezervacija = require("../Models/RezervacijaModels.js");
const Linija = require("../Models/LinijaModels.js");
const Stanica = require("../Models/StanicaModels.js");
const Medjustanica = require("../Models/MedjustanicaModels.js");

const router = express.Router();

//? dobijanje rezervacija po bas odredjenoj liniji
router.post("/linija/:linijaId", async (req, res) => {
  try {
    const linijaId = req.params.linijaId;
    const pocetnaStanicaId = req.body.pocetnaStanicaId;
    const krajnjaLinijaId = req.body.krajnjaStanicaId;

    console.log(linijaId, pocetnaStanicaId, krajnjaLinijaId);
    const linija = await Linija.findByPk(linijaId, { include: Stanica });

    let rezervacije = [];
    //? u slucaju da radi pretragu za celu liniju
    if (
      linija.pocetnaStanicaId == pocetnaStanicaId &&
      linija.krajnjaStanicaId == krajnjaLinijaId
    ) {
      const rezervacija = await Rezervacija.findAll({
        where: { linijaId },
      });
      rezervacije = rezervacije.concat(rezervacija);
    }

    //?ako je na pocetnoj i do neke medjusnice
    if (
      linija.pocetnaStanicaId == pocetnaStanicaId &&
      linija.krajnjaStanicaId != krajnjaLinijaId
    ) {
      const rezervacija = [];
      const sveRezervacije = await Rezervacija.findAll({
        where: {
          linijaId,
        },
      });

      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: { linijaId: linijaId, stanicaId: krajnjaLinijaId },
      });
      for (let i = 0; i < sveRezervacije.length; i++) {
        const element = sveRezervacije[i];

        const medjustanicaPocetnaSve = await Medjustanica.findOne({
          where: { linijaId: linijaId, stanicaId: element.pocetnaStanicaId },
        });

        const medjustanicaKrajnjaSve = await Medjustanica.findOne({
          where: { linijaId: linijaId, stanicaId: element.krajnjaStanicaId },
        });

        //?ako je iz svih rezervacija obe medjustanice za tu liniju
        if (
          linija.pocetnaStanicaId != element.pocetnaStanicaId &&
          linija.krajnjaStanicaId != element.krajnjaStanicaId
        ) {
          if (
            medjustanicaPocetnaSve &&
            medjustanicaKrajnja.redosled > medjustanicaPocetnaSve.redosled
          ) {
            rezervacija.push(element);
          }
        }

        //? ako je iz svih rezervacija jedna na pocetnoj, a druga medjustanica
        else if (
          linija.pocetnaStanicaId == element.pocetnaStanicaId &&
          linija.krajnjaStanicaId != element.krajnjaStanicaId
        ) {
          rezervacija.push(element);
        }

        //? ako je iz svih rezervacija prva na medjuliniji, a druga na na glavnoj liniji
        else if (
          linija.pocetnaStanicaId != element.pocetnaStanicaId &&
          linija.krajnjaStanicaId == element.krajnjaStanicaId
        ) {
          if (medjustanicaKrajnja.redosled > medjustanicaPocetnaSve.redosled) {
            rezervacija.push(element);
          }
        } else {
          rezervacija.push(element);
        }
      }
      rezervacije = rezervacije.concat(rezervacija);
    }

    //?ako je od neke medjustanice do neke medjustanice

    if (
      linija.pocetnaStanicaId != pocetnaStanicaId &&
      linija.krajnjaStanicaId != krajnjaLinijaId
    ) {
      const medjustanicaPocetna = await Medjustanica.findOne({
        where: { linijaId: linijaId, stanicaId: pocetnaStanicaId },
      });
      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: { linijaId: linijaId, stanicaId: krajnjaLinijaId },
      });

      const rezervacija = [];
      const sveRezervacije = await Rezervacija.findAll({
        where: {
          linijaId,
        },
      });

      for (let i = 0; i < sveRezervacije.length; i++) {
        const element = sveRezervacije[i];

        const medjustanicaPocetnaSve = await Medjustanica.findOne({
          where: { linijaId: linijaId, stanicaId: element.pocetnaStanicaId },
        });

        const medjustanicaKrajnjaSve = await Medjustanica.findOne({
          where: { linijaId: linijaId, stanicaId: element.krajnjaStanicaId },
        });

        //?ako je iz svih rezervacija obe medjustanice za tu liniju
        if (
          linija.pocetnaStanicaId != element.pocetnaStanicaId &&
          linija.krajnjaStanicaId != element.krajnjaStanicaId
        ) {
          if (
            medjustanicaPocetnaSve.redosled <= medjustanicaPocetna.redosled &&
            medjustanicaKrajnjaSve.redosled > medjustanicaKrajnja.redosled
          ) {
            rezervacija.push(element);
            continue;
          }
          if (
            medjustanicaPocetnaSve.redosled <= medjustanicaPocetna.redosled &&
            medjustanicaKrajnjaSve.redosled > medjustanicaPocetna.redosled
          ) {
            rezervacija.push(element);
            continue;
          }
          if (
            medjustanicaPocetnaSve.redosled >= medjustanicaPocetna.redosled &&
            medjustanicaKrajnjaSve.redosled < medjustanicaKrajnja.redosled
          ) {
            rezervacija.push(element);
            continue;
          }
          if (
            medjustanicaPocetnaSve.redosled < medjustanicaKrajnja.redosled &&
            medjustanicaKrajnjaSve.redosled >= medjustanicaKrajnja.redosled
          ) {
            rezervacija.push(element);
            continue;
          }
        }

        //? ako je iz svih rezervacija prva na medjuliniji, a druga na na glavnoj liniji
        else if (
          linija.pocetnaStanicaId != element.pocetnaStanicaId &&
          linija.krajnjaStanicaId == element.krajnjaStanicaId
        ) {
          if (
            !medjustanicaKrajnjaSve &&
            medjustanicaPocetnaSve.redosled < medjustanicaPocetna.redosled
          ) {
            rezervacija.push(element);
            continue;
          }
          if (
            !medjustanicaKrajnjaSve &&
            medjustanicaKrajnja.redosled > medjustanicaPocetnaSve.redosled
          ) {
            rezervacija.push(element);
            continue;
          }
        }

        //? ako je iz svih rezervacija jedna na pocetnoj, a druga medjustanica
        else if (
          linija.pocetnaStanicaId == element.pocetnaStanicaId &&
          linija.krajnjaStanicaId != element.krajnjaStanicaId
        ) {
          if (
            !medjustanicaPocetnaSve &&
            medjustanicaPocetna.redosled < medjustanicaKrajnjaSve.redosled
          ) {
            rezervacija.push(element);
            continue;
          }
        } else {
          rezervacija.push(element);
        }
      }

      rezervacije = rezervacije.concat(rezervacija);
    }
    //? ako je na nekoj medjustanici i na krajnjoj liniji
    if (
      linija.pocetnaStanicaId != pocetnaStanicaId &&
      linija.krajnjaStanicaId == krajnjaLinijaId
    ) {
      const rezervacija = [];
      const sveRezervacije = await Rezervacija.findAll({
        where: {
          linijaId,
        },
      });

      const medjustanicaPocetna = await Medjustanica.findOne({
        where: { linijaId: linijaId, stanicaId: pocetnaStanicaId },
      });
      for (let i = 0; i < sveRezervacije.length; i++) {
        const element = sveRezervacije[i];

        const medjustanicaPocetnaSve = await Medjustanica.findOne({
          where: { linijaId: linijaId, stanicaId: element.pocetnaStanicaId },
        });
        const medjustanicaKrajnjaSve = await Medjustanica.findOne({
          where: { linijaId: linijaId, stanicaId: element.krajnjaStanicaId },
        });

        //?ako je iz svih rezervacija obe medjustanice za tu liniju
        if (
          linija.pocetnaStanicaId != element.pocetnaStanicaId &&
          linija.krajnjaStanicaId != element.krajnjaStanicaId
        ) {
          if (
            medjustanicaPocetnaSve.redosled <= medjustanicaPocetna.redosled &&
            medjustanicaKrajnjaSve.redosled > medjustanicaPocetna.redosled
          ) {
            rezervacija.push(element);
          }
        }

        //? ako je iz svih rezervacija jedna na pocetnoj, a druga medjustanica
        else if (
          linija.pocetnaStanicaId == element.pocetnaStanicaId &&
          linija.krajnjaStanicaId != element.krajnjaStanicaId
        ) {
          if (medjustanicaKrajnjaSve.redosled > medjustanicaPocetna.redosled) {
            rezervacija.push(element);
          }
        }

        //? ako je iz svih rezervacija prva na medjuliniji, a druga na na glavnoj liniji
        else if (
          linija.pocetnaStanicaId != element.pocetnaStanicaId &&
          linija.krajnjaStanicaId == element.krajnjaStanicaId
        ) {
          rezervacija.push(element);
        } else {
          rezervacija.push(element);
        }
      }
      rezervacije = rezervacije.concat(rezervacija);
    }
    res
      .status(200)
      .json({ message: "Uspešno dobijene rezervacije", rezervacije });
  } catch (error) {
    res.status(500).json({ message: "bag", error: error.message });
  }
});

//? izvlacenje rezervacije po id u
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rezervacija = await Rezervacija.findOne({
      where: { id },
    });
    console.log(id, "---------");
    res
      .status(200)
      .json({ message: "uspešno dobavljena rezervacija", rezervacija });
  } catch (error) {
    res.status(500).json({ message: "došlo je do greške" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; //? ID karte koji se menja
    const {
      brojMesta,
      polaznaStanicaR,
      krajnjaStanicaR,
      datumPolaska,
      datumDolaska,
      vremePolaska,
      vremeDolaska,
      linijaId,
      pocetnaStanicaId,
      krajnjaStanicaId,
      korisnikId,
      osvezenje,
      oznakaSedista,
      tipKarte,
      email,
    } = req.body;

    const sveKarteNaLiniji = await Rezervacija.findAll({
      where: { linijaId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //? provera da li oznakaSedista postoji vec na toj liniji pod tim brojem
    const oznakaSedistaPostoji = sveKarteNaLiniji.some(
      (karta) => karta.oznakaSedista === oznakaSedista
    );

    if (oznakaSedistaPostoji) {
      //? vraćamo poruku da to sedište već postoji
      return res
        .status(400)
        .json({ message: "Oznaka sedišta već postoji", status: "failed" });
    }

    const updateKarta = await Rezervacija.update(
      {
        oznakaSedista,
      },
      { where: { id }, limit: 1 }
    );

    if (updateKarta[0] === 0) {
      return res.status(404).json({ message: "Karta nije pronađena" });
    }

    res
      .status(200)
      .json({ message: "Karta je uspesno promenjena", sveKarteNaLiniji });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: "Proverite unete podatke", status: "failed" });
    }

    res.status(500).json({ message: "Došlo je do greške", error });
  }
});

module.exports = router;
