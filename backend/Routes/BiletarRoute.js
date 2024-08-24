const express = require("express");
const { isAuthenticated, isAuthorized } = require("../Middlewares/auth.js");
const Korisnik = require("../Models/KorisnikModels.js");
const Bus = require("../Models/BusModels.js");
const Rezervacija = require("../Models/RezervacijaModels.js");
const Stanica = require("../Models/StanicaModels.js");
const Medjustanica = require("../Models/MedjustanicaModels.js");
const Linija = require("../Models/LinijaModels.js");
const { Op } = require("sequelize");

const router = express.Router();
const qrcode = require("qrcode");
const fs = require("fs");
const nodemailer = require("nodemailer");

//? Kreirajte transporter za slanje email poruka
const transporter = nodemailer.createTransport(
  process.env.DEPLOY == "1"
    ? {
        host: "mail.bustravel.rs",
        port: 587,
        secure: false, // use TLS,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      }
    : {
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      }
);

router.post("/filterLinija", async (req, res) => {
  try {
    const {
      nazivPocetneStanice,
      nazivKrajnjeStanice,
      datumPolaska,
      vremePolaska,
    } = req.body;

    console.log(req.body);
    const rezultat = [];

    const izvuceneLinijeDatum = await Linija.findAll({
      where: {
        datumPolaska,
        vremePolaska: { [Op.eq]: vremePolaska }, //? Filtriraj po vremenu polaska
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
          kola: linija.kola,
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
            kola: linija.kola,
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
            kola: linija.kola,
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
              kola: linija.kola,
            });
          }

          break;
        }
      }
    }

    res.status(200).json({ message: "uspešno izvučena linija", rezultat });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "došlo je do greške pri filtriranju", error });
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
      oznakaSedista,
      tipKarte,
      email,
      imeIprezime,
      brojTelefona,
    } = req.body;

    console.log(
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
      imeIprezime,
      brojTelefona
    );

    let linija = await Linija.findByPk(linijaId, { include: Stanica });

    let stanicaP = await Stanica.findByPk(pocetnaStanicaId);
    let stanicaK = await Stanica.findByPk(krajnjaStanicaId);

    let korisnik = await Korisnik.findByPk(korisnikId);

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

    //? Provera da li su podaci manji za 15 minuta u odnosu na vreme polaska linije
    const trenutnoVreme = new Date();
    const vremePolaskaRequest = new Date(datumPolaska + "T" + vremePolaska);

    const razlika = (vremePolaskaRequest - trenutnoVreme) / (1000 * 60); // razlika u minutima

    if (razlika < -15) {
      //? Vreme polaska je manje od trenutnog vremena za više od 15 minuta

      res.status(400).json({
        error:
          "Vreme polaska je manje od vremena polaska linije za više od 15 minuta.",
      });
      return;
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

    /* if (!email) {
      return res.status(404).json({
        message: "Ne email kako bi mogao da rezervise ",
      });
    } */

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

    let kola = linija.kola;

    if (!stanicaP || !stanicaK) {
      return res.status(404).json({ message: "Stanica nije pronađena" });
    }

    // Ažuriranje broja slobodnih mesta
    //?umanjuje ako je pocetna na liniji
    if (linija.pocetnaStanicaId == pocetnaStanicaId) {
      if (linija.brojSlobodnihMesta < brojMesta) {
        return res.status(404).json({ message: "nema dovoljno mesta" });
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
        where: { linijaId, stanicaId: krajnjaStanicaId },
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
      linija.brojSlobodnihMesta -= brojMesta;
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
      linija.brojSlobodnihMesta -= brojMesta;
      linija.save();
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
    const kreiranjeRezervacije = await Rezervacija.create({
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
      oznakaSedista,
      tipKarte,
      email,
      imeIprezime,
      brojTelefona,
      kola,
    });
    if (email) {
      const qrCodeText = `
      oznakaRezervacije: ${kreiranjeRezervacije.id + 1}
      LinijaId: ${linijaId}
      Cekiranje URL: ${req.get("host")}/linija/cekiranje/${
        kreiranjeRezervacije.id + 1
      }
  
    
  `;

      //? Postavite opcije za QR kod, na primer veličinu i error correction nivo
      const opcije = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.85,
        margin: 1,
        color: {
          dark: "#000",
          light: "#fff",
        },
      };

      qrcode.toFile("qrcode.png", qrCodeText, opcije, (err, url) => {
        if (err) {
          console.error("Greška pri generisanju QR koda:", err);
          return;
        }
        //? QR kod je generisan i sačuvan kao "qrcode.png"
        //? Nastavite sa slanjem e-mail poruke
      });

      //? slanje mejla korisniku kada uspesno rezervise kartu
      const emailSubject = "Potvrda rezervacije";

      //? Čitajte QR kod kao binarni podaci
      const qrCodeImagePath = "qrcode.png";
      const qrCodeImage = fs.readFileSync(qrCodeImagePath);

      //? Postavite prilog za e-mail
      const attachments = [
        {
          filename: "qrcode.png", //? Naziv priloga
          content: qrCodeImage, //? Sadržaj priloga kao binarni podaci
          cid: "qr-code", //? ID priloga, koristite ga u HTML telu e-maila
        },
      ];

      const emailText = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              margin: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
    
            .card {
              border: 2px solid #3498db;
              border-radius: 10px;
              padding: 20px;
              max-width: 400px;
              text-align: center;
            }
    
            h1 {
              color: #3498db;
            }
    
            p {
              color: #555;
            }
    
            img {
              width: 100%;
              border-radius: 5px;
            }
    
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Hvala što ste rezervisali putovanje!</h1>
            <p>Oznaka sedišta: ${oznakaSedista}</p>
            <p>Polazna Stanica: ${polaznaStanicaR}</p>
            <p>Krajnja Stanica: ${krajnjaStanicaR}</p>
            <p>Datum Polaska: ${datumPolaska}</p>
            <p>Datum Dolaska: ${datumDolaska}</p>
            <p>Vreme Polaska: ${vremePolaska}</p>
            <p>Vreme Dolaska: ${vremeDolaska}</p>
            <p>Osveženje: ${osvezenje}</p>
            <p>Broj kola: ${kola}</p>
            <p>Provera validnosti karte proveriti na sledećem linku:</p>
            <a href="${process.env.CLIENT_BASE_URL}/verifikacija/${kreiranjeRezervacije.id}">Provera validnosti</a>
            <p>Molimo vas da skenirate QR kod za više detalja:</p>
          </div>
        </body>
      </html>
    `;

      //? Unutar vašeg postojećeg koda za slanje e-maila
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: emailSubject,
        html: emailText,
        attachments, //? Dodajte prilog e-mail poruci
      };

      await transporter.sendMail(mailOptions);
    }
    res.status(200).json({ message: "uspesno rezervisali" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
