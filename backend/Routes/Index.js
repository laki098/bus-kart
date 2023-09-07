import express from "express";
import Linija from "../Models/LinijaModels.js";
import Medjustanica from "../Models/MedjustanicaModels.js";
import Stanica from "../Models/StanicaModels.js";
import Rezervacija from "../Models/RezervacijaModels.js";
import Bus from "../Models/BusModels.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const linija = await Linija.findAll({ include: Stanica, Medjustanica });
    res.status(200).json({ message: "uspesno izvucena linija", linija });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const linija = await Linija.findOne({
      where: { id },
    });

    res.status(200).json({ message: "Uspesno pronadjena linija", linija });
  } catch (error) {
    res.status(500).json({ message: "Doslo je do greske", error });
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
      oznakaBusa,
    } = req.body;

    // Kreiranje početne stanice
    const pocetna = await Stanica.findOne({
      where: {
        naziv: pocetnaStanica,
      },
    });

    // Kreiranje krajnje stanice
    const krajnja = await Stanica.findOne({
      where: {
        naziv: krajnjaStanica,
      },
    });

    //kreiranje broja sedista.. izlacenja po oznaci busa

    const brojMestaUBusu = await Bus.findOne({
      where: {
        oznakaBusa,
      },
      attributes: {
        exclude: [
          "idAutobusa",
          "oznakaBusa",
          "tablice",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    const brojSlobodnihMesta = brojMestaUBusu.brojSedista;

    // Kreiranje medjustanica sa vremenima
    const medjustaniceWithTimes = medjustanice.map((stanica) => ({
      naziv: stanica.stanica,
      vremePolaska: stanica.vremePolaskaM,
      vremeDolaska: stanica.vremeDolaskaM,
      datumPolaska: stanica.datumPolaskaM,
      datumDolaska: stanica.datumDolaskaM,
    }));

    // Kreiranje linije
    const novaLinija = await Linija.create({
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      brojSlobodnihMesta,
      oznakaBusa,
    });

    // Povezivanje početne stanice i krajnje stanice s linijom
    novaLinija.setPocetnaStanica(pocetna);
    novaLinija.setKrajnjaStanica(krajnja);

    // Povezivanje medjustanica sa vremenima s linijom
    await Promise.all(
      medjustaniceWithTimes.map(async (stanica, index) => {
        const foundStanica = await Stanica.findOne({
          where: {
            naziv: stanica.naziv,
          },
        });

        await novaLinija.addStanica(foundStanica, {
          through: {
            redosled: index + 1,
            vremePolaskaM: stanica.vremePolaska,
            vremeDolaskaM: stanica.vremeDolaska,
            datumPolaskaM: stanica.datumPolaska,
            datumDolaskaM: stanica.datumDolaska,
            brojSlobodnihMesta,
          },
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

    const rezultat = [];

    const izvuceneLinijeDatum = await Linija.findAll({
      where: {
        datumPolaska,
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

    //? prolazimo kroz liniju
    for (let index = 0; index < izvuceneLinijeDatum.length; index++) {
      const linija = izvuceneLinijeDatum[index];
      let brojMedjustanicaNaLiniji = 0;

      //? prolazimo kroz medjustanice
      for (let j = 0; j < linija.Stanicas.length; j++) {
        const medjustanica = linija.Stanicas[j];

        const element = medjustanica.Medjustanica;

        //?pitamo da li je na liniji ili medjustanici
        if (
          linija.pocetnaStanica.naziv == nazivPocetneStanice &&
          linija.krajnjaStanica.naziv == nazivKrajnjeStanice
        ) {
          rezultat.push({
            id: linija.id,
            pocetnaStanica: linija.pocetnaStanica.naziv,
            krajnjaStanica: linija.krajnjaStanica.naziv,
            datumPolaska: linija.datumPolaska,
            datumDolaska: linija.datumDolaska,
            vremePolaska: linija.vremePolaska.split(":").slice(0, 2).join(":"),
            vremeDolaska: linija.vremeDolaska.split(":").slice(0, 2).join(":"),
            brojSlobodnihMesta: linija.brojSlobodnihMesta,
          });
          break;
        }
        if (
          linija.pocetnaStanica.naziv == nazivPocetneStanice &&
          medjustanica.naziv == nazivKrajnjeStanice
        ) {
          rezultat.push({
            id: linija.id,
            pocetnaStanica: linija.pocetnaStanica.naziv,
            krajnjaStanica: medjustanica.naziv,
            datumPolaska: linija.datumPolaska,
            datumDolaska: element.datumDolaskaM,
            vremePolaska: linija.vremePolaska.split(":").slice(0, 2).join(":"),
            vremeDolaska: element.vremeDolaskaM
              .split(":")
              .slice(0, 2)
              .join(":"),
            brojSlobodnihMesta: linija.brojSlobodnihMesta,
          });
        }
        if (
          medjustanica.naziv == nazivPocetneStanice &&
          linija.krajnjaStanica.naziv == nazivKrajnjeStanice
        ) {
          rezultat.push({
            id: linija.id,
            pocetnaStanica: medjustanica.naziv,
            krajnjaStanica: linija.krajnjaStanica.naziv,
            datumPolaska: element.datumPolaskaM,
            datumDolaska: linija.datumDolaska,
            vremePolaska: element.vremePolaskaM
              .split(":")
              .slice(0, 2)
              .join(":"),
            vremeDolaska: linija.vremeDolaska.split(":").slice(0, 2).join(":"),
            brojSlobodnihMesta: medjustanica.brojSlobodnihMesta,
          });
          break;
        }

        if (
          medjustanica.naziv == nazivPocetneStanice ||
          medjustanica.naziv == nazivKrajnjeStanice
        ) {
          brojMedjustanicaNaLiniji += 1;
        }
        //! TREBA MI USLOV ZA REDOSLED
        if (brojMedjustanicaNaLiniji == 2) {
          rezultat.push({
            id: linija.id,
            pocetnaStanica: nazivPocetneStanice,
            krajnjaStanica: nazivKrajnjeStanice,
            datumPolaska: element.datumPolaskaM,
            datumDolaska: element.datumDolaskaM,
            vremePolaska: element.vremePolaskaM
              .split(":")
              .slice(0, 2)
              .join(":"),
            vremeDolaska: element.vremeDolaskaM
              .split(":")
              .slice(0, 2)
              .join(":"),
            brojSlobodnihMesta: element.brojSlobodnihMesta,
          });
          break;
        }
      }
    }

    /* const proba = await izvuceneLinijeDatum[0].getPocetnaStanica();
    const proba2 = await izvuceneLinijeDatum[0].getKrajnjaStanica(); */

    res.status(200).json({ message: "uspesno izvučena linija", rezultat });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "doslo je do greske pri filtriranju", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteLinija = await Linija.destroy({
      where: { id },
      limit: 1,
    });

    if (deleteLinija === 0) {
      return res.status(404).json({ message: "Linija nije pronadjena" });
    }
    res.status(200).json({ message: "Linija uspesno obrisana" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "doslo je do greske pri ocitavanju baze", error });
  }
});

export default router;
