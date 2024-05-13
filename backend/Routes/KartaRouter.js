const express = require("express");
const { isAuthenticated, isAuthorized } = require("../Middlewares/auth.js");
const Korisnik = require("../Models/KorisnikModels.js");
const Bus = require("../Models/BusModels.js");
const Rezervacija = require("../Models/RezervacijaModels.js");
const Stanica = require("../Models/StanicaModels.js");
const Medjustanica = require("../Models/MedjustanicaModels.js");
const Linija = require("../Models/LinijaModels.js");

const qrcode = require("qrcode");
const fs = require("fs");

const nodemailer = require("nodemailer");
const { where } = require("sequelize");

const router = express.Router();

router.delete("/otkazivanje", async (req, res) => {
  try {
    const {
      rezervacijaId,
      linijaId,
      pocetnaStanicaId,
      krajnjaStanicaId,
      brojMesta,
    } = req.body;

    console.log(rezervacijaId);

    let karta = await Rezervacija.findByPk(rezervacijaId);

    if (!karta) {
      return res.status(404).json({ message: "Ne postoji ova karta!" });
    }

    let linija = await Linija.findByPk(linijaId, { include: Stanica });

    const oznakaBusa = linija.oznakaBusa;
    const autobus = await Bus.findOne({
      where: { oznakaBusa: oznakaBusa },
    });
    let brojMestaUBusu = autobus.brojSedista;

    let stanicaP = await Stanica.findByPk(pocetnaStanicaId);
    let stanicaK = await Stanica.findByPk(krajnjaStanicaId);

    let postojiStanicaP = false;
    let postojiStanicaK = false;

    if (linija.Stanicas.length == 0) {
      if (linija.pocetnaStanicaId == pocetnaStanicaId) {
        postojiStanicaP = true;
      }
      if (linija.krajnjaStanicaId == krajnjaStanicaId) {
        postojiStanicaK = true;
      }
    }

    for (let i = 0; i < linija.Stanicas.length; i++) {
      const stanica = linija.Stanicas[i];

      if (
        stanicaP.id == stanica.id ||
        linija.pocetnaStanicaId == pocetnaStanicaId
      ) {
        postojiStanicaP = true;
      }

      if (
        stanicaK.id == stanica.id ||
        linija.krajnjaStanicaId == krajnjaStanicaId
      ) {
        postojiStanicaK = true;
      }
    }

    if (!postojiStanicaP) {
      return res.status(404).json({
        message: "Ne postoji stanica početna ",
      });
    }

    if (!postojiStanicaK) {
      return res.status(404).json({
        message: "Ne postoji stanica krajnja na ispisanoj liniji",
      });
    }

    if (!linija) {
      return res.status(404).json({ message: "Linija nije pronađena" });
    }

    if (!stanicaP || !stanicaK) {
      return res.status(404).json({ message: "Stanica nije pronađena" });
    }

    // Ažuriranje broja slobodnih mesta
    //?uvecava ako je pocetna na liniji
    if (linija.pocetnaStanicaId == pocetnaStanicaId) {
      linija.brojSlobodnihMesta += brojMesta;
      await linija.save();
    }

    //? uslov da se uveca sedista na svim medjustanicama ako se izabere cela linija
    if (
      linija.pocetnaStanicaId == pocetnaStanicaId &&
      linija.krajnjaStanicaId == krajnjaStanicaId
    ) {
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];

        element.brojSlobodnihMesta += brojMesta;
        element.save();
      }
    }

    //? ako je na pocetnoj i do neke medjusnice
    if (
      linija.pocetnaStanicaId == pocetnaStanicaId &&
      linija.krajnjaStanicaId != krajnjaStanicaId
    ) {
      const medjustanicaSve = await Medjustanica.findAll({
        where: { linijaId },
      });
      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: { linijaId, stanicaId: krajnjaStanicaId },
      });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];
        if (element.redosled < medjustanicaKrajnja.redosled) {
          element.brojSlobodnihMesta += brojMesta;
          element.save();
        }
      }
    }

    //? uslov da se uvecava sedista u slucaju da ako uveca izemdju vise medjustanicastanica
    if (
      linija.pocetnaStanicaId != pocetnaStanicaId &&
      linija.krajnjaStanicaId != krajnjaStanicaId
    ) {
      linija.brojSlobodnihMesta += brojMesta;
      linija.save();
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });

      const medjustanicaPocetna = await Medjustanica.findOne({
        where: { linijaId, stanicaId: pocetnaStanicaId },
      });

      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: { linijaId, stanicaId: krajnjaStanicaId },
      });

      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];

        if (
          element.redosled >= medjustanicaPocetna.redosled &&
          element.redosled < medjustanicaKrajnja.redosled
        ) {
          if (element.brojSlobodnihMesta < brojMesta) {
            res.status(404).json({ message: "nema dovoljno mesta" });
            return;
          }

          element.brojSlobodnihMesta += brojMesta;
          element.save();
        }
      }
    }

    //? ako ide od neke medjustanice do krajnje stanice na liniji
    if (
      linija.pocetnaStanicaId != pocetnaStanicaId &&
      linija.krajnjaStanicaId == krajnjaStanicaId
    ) {
      linija.brojSlobodnihMesta += brojMesta;
      linija.save();
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });
      const medjustanicaPocetna = await Medjustanica.findOne({
        where: { linijaId, stanicaId: pocetnaStanicaId },
      });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];
        if (element.redosled >= medjustanicaPocetna.redosled) {
          element.brojSlobodnihMesta += brojMesta;
          element.save();
        }
      }
    }

    const deleteLinija = await Rezervacija.destroy({
      where: { id: rezervacijaId },
      limit: 1,
    });

    if (deleteLinija === 0) {
      return res.status(404).json({ message: "Linija nije pronađena" });
    }
    res.status(200).json({ message: "Linija uspešno obrisana" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "došlo je do greške pri očitavanju baze", error });
  }
});

router.put("/promena", async (req, res) => {
  try {
    const {
      rezervacijaId,
      linijaIdS,
      pocetnaStanicaId,
      krajnjaStanicaId,
      brojMesta,
      datumPolaska,
      datumDolaska,
      vremePolaska,
      vremeDolaska,
      osvezenje,
      oznakaSedista,
      linijaIdN,
    } = req.body;

    let karta = await Rezervacija.findByPk(rezervacijaId);

    if (!karta) {
      return res.status(404).json({ message: "Ne postoji ova karta!" });
    }

    if (linijaIdS != linijaIdN) {
      let linija = await Linija.findByPk(linijaIdS, { include: Stanica });

      const oznakaBusa = linija.oznakaBusa;
      const autobus = await Bus.findOne({
        where: { oznakaBusa: oznakaBusa },
      });
      let brojMestaUBusu = autobus.brojSedista;

      let stanicaP = await Stanica.findByPk(pocetnaStanicaId);
      let stanicaK = await Stanica.findByPk(krajnjaStanicaId);

      let postojiStanicaP = false;
      let postojiStanicaK = false;

      if (linija.Stanicas.length == 0) {
        if (linija.pocetnaStanicaId == pocetnaStanicaId) {
          postojiStanicaP = true;
        }
        if (linija.krajnjaStanicaId == krajnjaStanicaId) {
          postojiStanicaK = true;
        }
      }

      for (let i = 0; i < linija.Stanicas.length; i++) {
        const stanica = linija.Stanicas[i];

        if (
          stanicaP.id == stanica.id ||
          linija.pocetnaStanicaId == pocetnaStanicaId
        ) {
          postojiStanicaP = true;
        }

        if (
          stanicaK.id == stanica.id ||
          linija.krajnjaStanicaId == krajnjaStanicaId
        ) {
          postojiStanicaK = true;
        }
      }

      if (!postojiStanicaP) {
        return res.status(404).json({
          message: "Ne postoji stanica početna ",
        });
      }

      if (!postojiStanicaK) {
        return res.status(404).json({
          message: "Ne postoji stanica krajnja na ispisanoj liniji",
        });
      }

      if (!linija) {
        return res.status(404).json({ message: "Linija nije pronađena" });
      }

      if (!stanicaP || !stanicaK) {
        return res.status(404).json({ message: "Stanica nije pronađena" });
      }

      // Ažuriranje broja slobodnih mesta
      //?uvecava ako je pocetna na liniji
      if (linija.pocetnaStanicaId == pocetnaStanicaId) {
        linija.brojSlobodnihMesta += brojMesta;
        await linija.save();
      }

      //? uslov da se uveca sedista na svim medjustanicama ako se izabere cela linija
      if (
        linija.pocetnaStanicaId == pocetnaStanicaId &&
        linija.krajnjaStanicaId == krajnjaStanicaId
      ) {
        const medjustanicaSve = await Medjustanica.findAll({
          where: { linijaId: linijaIdS },
        });
        for (let i = 0; i < medjustanicaSve.length; i++) {
          const element = medjustanicaSve[i];

          element.brojSlobodnihMesta += brojMesta;
          element.save();
        }
      }

      //? ako je na pocetnoj i do neke medjusnice
      if (
        linija.pocetnaStanicaId == pocetnaStanicaId &&
        linija.krajnjaStanicaId != krajnjaStanicaId
      ) {
        const medjustanicaSve = await Medjustanica.findAll({
          where: { linijaId: linijaIdS },
        });
        const medjustanicaKrajnja = await Medjustanica.findOne({
          where: { linijaId: linijaIdS, stanicaId: krajnjaStanicaId },
        });
        for (let i = 0; i < medjustanicaSve.length; i++) {
          const element = medjustanicaSve[i];
          if (element.redosled < medjustanicaKrajnja.redosled) {
            element.brojSlobodnihMesta += brojMesta;
            element.save();
          }
        }
      }

      //? uslov da se uvecava sedista u slucaju da ako uveca izemdju vise medjustanicastanica
      if (
        linija.pocetnaStanicaId != pocetnaStanicaId &&
        linija.krajnjaStanicaId != krajnjaStanicaId
      ) {
        linija.brojSlobodnihMesta += brojMesta;
        linija.save();
        const medjustanicaSve = await Medjustanica.findAll({
          where: { linijaId: linijaIdS },
        });

        const medjustanicaPocetna = await Medjustanica.findOne({
          where: { linijaId: linijaIdS, stanicaId: pocetnaStanicaId },
        });

        const medjustanicaKrajnja = await Medjustanica.findOne({
          where: { linijaId: linijaIdS, stanicaId: krajnjaStanicaId },
        });

        for (let i = 0; i < medjustanicaSve.length; i++) {
          const element = medjustanicaSve[i];

          if (
            element.redosled >= medjustanicaPocetna.redosled &&
            element.redosled < medjustanicaKrajnja.redosled
          ) {
            if (element.brojSlobodnihMesta < brojMesta) {
              res.status(404).json({ message: "nema dovoljno mesta" });
              return;
            }

            element.brojSlobodnihMesta += brojMesta;
            element.save();
          }
        }
      }

      //? ako ide od neke medjustanice do krajnje stanice na liniji
      if (
        linija.pocetnaStanicaId != pocetnaStanicaId &&
        linija.krajnjaStanicaId == krajnjaStanicaId
      ) {
        linija.brojSlobodnihMesta += brojMesta;
        linija.save();
        const medjustanicaSve = await Medjustanica.findAll({
          where: { linijaId: linijaIdS },
        });
        const medjustanicaPocetna = await Medjustanica.findOne({
          where: { linijaId: linijaIdS, stanicaId: pocetnaStanicaId },
        });
        for (let i = 0; i < medjustanicaSve.length; i++) {
          const element = medjustanicaSve[i];
          if (element.redosled >= medjustanicaPocetna.redosled) {
            element.brojSlobodnihMesta += brojMesta;
            element.save();
          }
        }
      }
    }
    console.log(rezervacijaId);
    const updateKarte = await Rezervacija.update(
      {
        datumPolaska,
        datumDolaska,
        vremePolaska,
        vremeDolaska,
        osvezenje,
        oznakaSedista,
        linijaid: linijaIdN,
      },
      { where: { id: rezervacijaId }, limit: 1 }
    );

    res.status(200).json({ message: "Karta uspešno izmenjena" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "došlo je do greške pri očitavanju baze", error });
  }
});

module.exports = router;
