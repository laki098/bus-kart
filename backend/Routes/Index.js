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

//? Endpoint za kreiranje nove linije
//? Kod za kreiranje nove linije
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
      pocetakRute,
      krajRute,
      stjuardesa,
      vozac,
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
      pocetakRute: stanica.pocetakRute,
      krajRute: stanica.krajRute,
    }));

    // Kreiranje linije
    const novaLinija = await Linija.create({
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      brojSlobodnihMesta,
      oznakaBusa,
      pocetakRute,
      krajRute,
      stjuardesa,
      vozac,
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
            pocetakRute,
            krajRute,
          },
        });
      })
    );

    return res.status(201).json({ message: "Uspesno dodata nova linija" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const linijaId = req.params.id;
    console.log(linijaId, "-----------------------------------")
    const {
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      oznakaBusa,
      pocetakRute,
      krajRute,
      stjuardesa,
      vozac,
    } = req.body;

    // Pronađite postojeću liniju koju želite urediti
    const postojucaLinija = await Linija.findByPk(linijaId, {
      include: Stanica,
    });

    if (!postojucaLinija) {
      return res.status(404).json({ message: "Linija nije pronađena." });
    }

    // Ažurirajte svojstva linije prema novim informacijama
    postojucaLinija.vremePolaska = vremePolaska;
    postojucaLinija.vremeDolaska = vremeDolaska;
    postojucaLinija.datumPolaska = datumPolaska;
    postojucaLinija.datumDolaska = datumDolaska;
    postojucaLinija.oznakaBusa = oznakaBusa;
    postojucaLinija.pocetakRute = pocetakRute;
    postojucaLinija.krajRute = krajRute;
    postojucaLinija.stjuardesa = stjuardesa;
    postojucaLinija.vozac = vozac;

    // Povezivanje početne stanice i krajnje stanice s linijom
    const pocetna = await Stanica.findOne({
      where: {
        naziv: pocetnaStanica,
      },
    });

    const krajnja = await Stanica.findOne({
      where: {
        naziv: krajnjaStanica,
      },
    });

    postojucaLinija.pocetnaStanicaId = pocetna.id;
    postojucaLinija.krajnjaStanicaId = krajnja.id;

    // Spremite promjene u bazi podataka za liniju
    await postojucaLinija.save();

    // Sada ažurirajte medjustanice
    for (let i = 0; i < medjustanice.length; i++) {
      const medjustanicaData = medjustanice[i];
      const stanicaNaziv = medjustanicaData.stanica;

      const stanicaId1 = await Stanica.findOne({
        where: { naziv: stanicaNaziv },
      });

      console.log(stanicaId1.id);
      const stanicaId = stanicaId1.id;
      const novaMedjustanica = await Medjustanica.findOne({
        where: {
          stanicaId,
          linijaId,
        },
      });

      if (novaMedjustanica) {
        // Ažurirajte podatke medjustanice
        novaMedjustanica.vremePolaskaM = medjustanicaData.vremePolaskaM;
        novaMedjustanica.vremeDolaskaM = medjustanicaData.vremeDolaskaM;
        novaMedjustanica.datumPolaskaM = medjustanicaData.datumPolaskaM;
        novaMedjustanica.datumDolaskaM = medjustanicaData.datumDolaskaM;
        novaMedjustanica.pocetakRute = medjustanicaData.pocetakRute;
        novaMedjustanica.krajRute = medjustanicaData.krajRute;

        // Spremite promjene u bazi podataka za medjustanicu
        await novaMedjustanica.save();
      }
    }

    return res.status(200).json({ message: "Uspješno uređena linija." });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/rezervacija", async (req, res) => {
  try {
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
    } = req.body;

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
        return;
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
        if (element.brojSlobodnihMesta < brojMesta) {
          res.status(404).json({ message: "nema dovoljno mesta" });
          return;
        }
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
        if (element.redosled < medjustanicaKrajnja.redosled) {
          if (element.brojSlobodnihMesta < brojMesta) {
            res.status(404).json({ message: "nema dovoljno mesta" });
            return;
          }
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

          element.brojSlobodnihMesta -= brojMesta;
          element.save();
        }
      }
    }
    //? ako ide od neke medjustanice do krajnje stanice na liniji
    if (
      linija.pocetnaStanicaId != pocetnaStanicaId &&
      linija.krajnjaStanicaId == krajnjaStanicaId
    ) {
      const medjustanicaSve = await Medjustanica.findAll({ where: linijaId });
      const medjustanicaPocetna = await Medjustanica.findOne({
        where: { linijaId, stanicaId: pocetnaStanicaId },
      });
      for (let i = 0; i < medjustanicaSve.length; i++) {
        const element = medjustanicaSve[i];
        if (element.redosled >= medjustanicaPocetna.redosled) {
          if (element.brojSlobodnihMesta < brojMesta) {
            res.status(404).json({ message: "nema dovoljno mesta" });
            return;
          }
          element.brojSlobodnihMesta -= brojMesta;
          element.save();
        }
      }
    }

    await Rezervacija.create({
      brojMesta,
      linijaId,
      polaznaStanicaR,
      krajnjaStanicaR,
      datumPolaska,
      datumDolaska,
      vremePolaska,
      vremeDolaska,
      pocetnaStanicaId,
      krajnjaStanicaId,
      korisnikId,
      osvezenje,
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

      let najmanjiBroj;
      let brojSlobodnihMesta1 = [];
      console.log(linija.pocetnaStanica.naziv);
      if (nazivPocetneStanice == linija.pocetnaStanica.naziv) {
        brojSlobodnihMesta1.push(linija.brojSlobodnihMesta);
      }
      for (let j = 0; j < linija.Stanicas.length; j++) {
        const medjustanica = linija.Stanicas[j];
        const element = medjustanica.Medjustanica;

        brojSlobodnihMesta1.push(element.brojSlobodnihMesta);
      }
      najmanjiBroj = Math.min(...brojSlobodnihMesta1);

      if (
        linija.pocetnaStanica.naziv == nazivPocetneStanice &&
        linija.krajnjaStanica.naziv == nazivKrajnjeStanice
      ) {
        rezultat.push({
          id: linija.id,
          pocetnaStanica: linija.pocetnaStanica.naziv,
          pocetnaStanicaId: linija.pocetnaStanicaId,
          krajnjaStanicaId: linija.krajnjaStanicaId,
          krajnjaStanica: linija.krajnjaStanica.naziv,
          datumPolaska: linija.datumPolaska,
          datumDolaska: linija.datumDolaska,
          vremePolaska: linija.vremePolaska.split(":").slice(0, 2).join(":"),
          vremeDolaska: linija.vremeDolaska.split(":").slice(0, 2).join(":"),
          brojSlobodnihMesta: najmanjiBroj,
          oznakaBusa: linija.oznakaBusa,
        });
      }

      let pocetnaStanicaRedosled;
      let krajnjaStanicaRedosled;

      for (let j = 0; j < linija.Stanicas.length; j++) {
        const medjustanica = linija.Stanicas[j];
        const element = medjustanica.Medjustanica;

        if (medjustanica.naziv == nazivPocetneStanice) {
          pocetnaStanicaRedosled = element.redosled;
        }
        if (medjustanica.naziv == nazivKrajnjeStanice) {
          krajnjaStanicaRedosled = element.redosled;
        }
      }

      najmanjiBroj;
      brojSlobodnihMesta1 = [];
      if (nazivPocetneStanice == linija.pocetnaStanica.naziv) {
        brojSlobodnihMesta1.push(linija.brojSlobodnihMesta);
      }
      for (let j = 0; j < linija.Stanicas.length; j++) {
        const medjustanica = linija.Stanicas[j];
        const element = medjustanica.Medjustanica;
        if (pocetnaStanicaRedosled == undefined) {
          if (
            element.redosled >= pocetnaStanicaRedosled ||
            element.redosled < krajnjaStanicaRedosled
          ) {
            brojSlobodnihMesta1.push(element.brojSlobodnihMesta);
          }
        }
        if (krajnjaStanicaRedosled == undefined) {
          if (
            element.redosled >= pocetnaStanicaRedosled ||
            element.redosled < krajnjaStanicaRedosled
          ) {
            brojSlobodnihMesta1.push(element.brojSlobodnihMesta);
          }
        }
        if (
          element.redosled >= pocetnaStanicaRedosled &&
          element.redosled < krajnjaStanicaRedosled
        ) {
          brojSlobodnihMesta1.push(element.brojSlobodnihMesta);
        }
      }

      najmanjiBroj = Math.min(...brojSlobodnihMesta1);

      //? prolazimo kroz medjustanice
      for (let j = 0; j < linija.Stanicas.length; j++) {
        const medjustanica = linija.Stanicas[j];

        const element = medjustanica.Medjustanica;

        //?pitamo da li je na liniji ili medjustanici
        if (
          linija.pocetnaStanica.naziv == nazivPocetneStanice &&
          medjustanica.naziv == nazivKrajnjeStanice
        ) {
          rezultat.push({
            id: linija.id,
            pocetnaStanica: linija.pocetnaStanica.naziv,
            pocetnaStanicaId: linija.pocetnaStanicaId,
            krajnjaStanicaId: element.stanicaId,
            krajnjaStanica: medjustanica.naziv,
            datumPolaska: linija.datumPolaska,
            datumDolaska: element.datumDolaskaM,
            vremePolaska: linija.vremePolaska.split(":").slice(0, 2).join(":"),
            vremeDolaska: element.vremeDolaskaM
              .split(":")
              .slice(0, 2)
              .join(":"),
            brojSlobodnihMesta: najmanjiBroj,
            oznakaBusa: linija.oznakaBusa,
          });
        }

        if (
          medjustanica.naziv == nazivPocetneStanice &&
          linija.krajnjaStanica.naziv == nazivKrajnjeStanice
        ) {
          rezultat.push({
            id: linija.id,
            pocetnaStanica: medjustanica.naziv,
            pocetnaStanicaId: element.stanicaId,
            krajnjaStanicaId: linija.krajnjaStanicaId,
            krajnjaStanica: linija.krajnjaStanica.naziv,
            datumPolaska: element.datumPolaskaM,
            datumDolaska: linija.datumDolaska,
            vremePolaska: element.vremePolaskaM
              .split(":")
              .slice(0, 2)
              .join(":"),
            vremeDolaska: linija.vremeDolaska.split(":").slice(0, 2).join(":"),
            brojSlobodnihMesta: najmanjiBroj,
            oznakaBusa: linija.oznakaBusa,
          });
          break;
        }

        if (
          medjustanica.naziv == nazivPocetneStanice ||
          medjustanica.naziv == nazivKrajnjeStanice
        ) {
          brojMedjustanicaNaLiniji += 1;
        }

        if (brojMedjustanicaNaLiniji == 2) {
          const pocetnaFilterId = await Stanica.findOne({
            where: {
              naziv: nazivPocetneStanice,
            },
          });
          //? izvuko sam bas tu medju stanicu koja je pocetna
          const pocetnaFilterMedju = await Medjustanica.findOne({
            where: {
              stanicaId: pocetnaFilterId.id,
            },
          });

          const kranjnjaFilterId = await Stanica.findOne({
            where: {
              naziv: nazivKrajnjeStanice,
            },
          });
          //? izvuko sam bas tu medju stanicu koja je krajnja
          const krajnjaFilterMedju = await Medjustanica.findOne({
            where: { stanicaId: kranjnjaFilterId.id },
          });

          if (pocetnaFilterMedju.redosled <= krajnjaFilterMedju.redosled) {
            const brSedistaMedjulinija = await Medjustanica.findAll({
              where: { linijaId: linija.id },
            });

            rezultat.push({
              id: linija.id,
              pocetnaStanica: nazivPocetneStanice,
              pocetnaStanicaId: pocetnaFilterId.id,
              krajnjaStanicaId: kranjnjaFilterId.id,
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
              brojSlobodnihMesta: najmanjiBroj,
              oznakaBusa: linija.oznakaBusa,
            });
          }

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
