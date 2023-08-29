import express from "express";
import Linija from "../Models/LinijaModels.js";
import Medjustanica from "../Models/MedjustanicaModels.js";
import Stanica from "../Models/StanicaModels.js";
import Rezervacija from "../Models/RezervacijaModels.js";
import { BIGINT } from "sequelize";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const linija = await Linija.findAll({ include: Stanica, Medjustanica });
    res.status(200).json({ message: "uspesno izvucena linija", linija });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Endpoint za kreiranje nove linije
// Kod za kreiranje nove linije
router.post("/", async (req, res) => {
  try {
    const {
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      brojSlobodnihMesta,
    } = req.body;

    // Kreiranje početne stanice
    const pocetna = await Stanica.findOne({
      where: {
        naziv: pocetnaStanica,
      },
    }); //!promeniti da ide preko ID-a

    // Kreiranje krajnje stanice
    const krajnja = await Stanica.findOne({
      where: {
        naziv: krajnjaStanica,
      },
    }); //!promeniti da ide preko ID-a

    // Kreiranje međustanica
    const sveMedjustanice = await Promise.all(
      medjustanice.map((stanica) =>
        Stanica.findAll({
          where: {
            naziv: stanica,
          },
        })
      )
    );

    // Kreiranje linije
    const novaLinija = await Linija.create({
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      brojSlobodnihMesta,
    });

    // Povezivanje početne stanice i krajnje stanice s linijom
    novaLinija.setPocetnaStanica(pocetna);
    novaLinija.setKrajnjaStanica(krajnja);

    // Povezivanje međustanica s linijom
    await Promise.all(
      sveMedjustanice.map(async (stanica, index) => {
        await novaLinija.addStanica(stanica, {
          through: { redosled: index + 1, brojSlobodnihMesta },
        });
      })
    );

    return res.status(201).json({ message: "Uspesno dodata nova linija" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/rezervacija", async (req, res) => {
  try {
    const { brojMesta, linijaId, pocetnaStanicaId, krajnjaStanicaId } =
      req.body;

    let linija = await Linija.findByPk(linijaId, { include: Stanica });

    let stanicaP = await Stanica.findByPk(pocetnaStanicaId);
    let stanicaK = await Stanica.findByPk(krajnjaStanicaId);

    let postojiStanicaP = false;
    let postojiStanicaK = false;

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
      res.status(404).json({
        message: "Nepostoji stanica pocetna ",
      });
    }

    if (!postojiStanicaK) {
      res.status(404).json({
        message: "Nepostoji stanica krajnja na ispisanoj liniji",
      });
    }

    if (!linija) {
      res.status(404).json({ message: "Linija nije pronadjena" });
    }

    if (!stanicaP || !stanicaK) {
      res.status(404).json({ message: "Stanica nije pronadjena" });
    }

    // Ažuriranje broja slobodnih mesta
    //?umanjuje ako je pocetna na liniji
    if (linija.pocetnaStanicaId == pocetnaStanicaId) {
      if (linija.brojSlobodnihMesta < brojMesta) {
        res.status(404).json({ message: "nema dovoljno mesta" });
      }
      linija.brojSlobodnihMesta -= brojMesta;
      await linija.save();
    }

    //? uslov da se umanje sedista na svim medjustanicama ako se izabere cela linija
    if (
      linija.pocetnaStanicaId == pocetnaStanicaId &&
      linija.krajnjaStanicaId == krajnjaStanicaId
    ) {
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];
        console.log(element);
        element.brojSlobodnihMesta -= brojMesta;
        element.save();
      }
    }

    //? ako je na pocetnoj i do neke medjusnice
    if (
      linija.pocetnaStanicaId == pocetnaStanicaId &&
      linija.krajnjaStanicaId != krajnjaStanicaId
    ) {
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });
      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: linijaId,
        stanicaId: krajnjaStanicaId,
      });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];
        if (element.redosled <= medjustanicaKrajnja.redosled) {
          element.brojSlobodnihMesta -= brojMesta;
          element.save();
        }
      }
    }
    //? uslov da se umanje sedista u slucaju da ako umanjimo izemdju vise medjustanicastanica
    if (
      linija.pocetnaStanicaId != pocetnaStanicaId &&
      linija.krajnjaStanicaId != krajnjaStanicaId
    ) {
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });
      const medjustanicaPocetna = await Medjustanica.findOne({
        where: linijaId,
        stanicaId: pocetnaStanicaId,
      });
      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: linijaId,
        stanicaId: krajnjaStanicaId,
      });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];
        if (
          element.redosled >= medjustanicaPocetna.redosled &&
          element.redosled <= medjustanicaKrajnja.redosled
        ) {
          element.brojSlobodnihMesta -= brojMesta;
          element.save();
        }
      }
    }
    //? ako ide od neke medjustanice do krajnje stanice na liniji
    else {
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });
      const medjustanicaPocetna = await Medjustanica.findOne({
        where: linijaId,
        stanicaId: pocetnaStanicaId,
      });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];
        if (element.redosled >= medjustanicaPocetna.redosled) {
          element.brojSlobodnihMesta -= brojMesta;
          element.save();
        }
      }
    }

    await Rezervacija.create({
      brojMesta,
      linijaId,
      pocetnaStanicaId,
      krajnjaStanicaId,
    });
    res.status(200).json({ message: "uspesno rezervisali" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/filterLinija", async (req, res) => {
  try {
    const { nazivPocetneStanice, nazivKrajnjeStanice, datumPolaska } = req.body;

    const pocetnaStanica = await Stanica.findOne({
      where: {
        naziv: nazivPocetneStanice,
      },
    });

    const krajnjaStanica = await Stanica.findOne({
      where: {
        naziv: nazivKrajnjeStanice,
      },
    });

    const jestePocetnaMedjustanica = await Medjustanica.findByPk(
      pocetnaStanica.id
    );

    const jesteKrajnjaMedjustanica = await Medjustanica.findByPk(
      krajnjaStanica.id
    );

    if (!jestePocetnaMedjustanica) {
      const linije = await Linija.findAll({
        where: {
          datumPolaska,
          pocetnaStanicaId: pocetnaStanica.id,
        },
      });
    }

    // const medjustanice = await Linija.findAll({
    //   where: {
    //     pocetnaStanicaId: pocetnaStanica.id,
    //     krajnjaStanicaId: krajnjaStanica.id,
    //   },
    //   include: Stanica,
    // });

    const linije = await Linija.findAll({
      where: {
        datumPolaska,
        $or: [
          {
            pocetnaStanicaId: pocetnaStanica.id,
            krajnjaStanicaId: krajnjaStanica.id,
          },
          {
            pocetnaStanicaId: pocetnaStanica.id,
            krajnjaStanicaId: medjustanice.id,
          },
        ],
      },
      include: Stanica,
    });

    res.status(200).json({ message: "uspesno izvučena linija", linije });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "doslo je do greske pri filtriranju", error });
  }
});

export default router;
