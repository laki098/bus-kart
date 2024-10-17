require("dotenv/config");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const Korisnik = require("../Models/KorisnikModels.js");
const Rezervacija = require("../Models/RezervacijaModels.js");

const router = express.Router();

const clientUrl = process.env.CLIENT_BASE_URL;

//? dobavljanje svih korisnika
router.get("/", async (req, res) => {
  try {
    const korisnici = await Korisnik.findAll();
    return res.json({ korisnici });
  } catch (error) {
    res.status(500).json({ message: "eeaeasrasr", error });
  }
});

//?dobavljanje korisnika po id-u
router.get("/:idKorisnik", async (req, res) => {
  const { idKorisnik } = req.params;
  try {
    const korisnik = await Korisnik.findOne({
      where: { idKorisnik: idKorisnik },
    });
    res
      .status(200)
      .json({ message: "uspesno dobavljeni svi korisnici", korisnik });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// Kreirajte transporter za slanje email poruka
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

//? registacija na sistem
router.post("/registration", async (req, res) => {
  try {
    const { korisnickoIme, lozinka, ime, prezime, brojTelefona, email } =
      req.body;

    // Dodatna logika za proveru postojanja korisničkog imena i emaila
    const existingUsername = await Korisnik.findOne({
      where: { korisnickoIme: korisnickoIme },
    });

    const existingEmail = await Korisnik.findOne({
      where: { email: email },
    });

    if (existingUsername) {
      return res.status(400).json({ message: "Korisničko ime već postoji." });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email adresa već postoji." });
    }
    if (korisnickoIme.length < 5) {
      return res
        .status(400)
        .json({ message: "Korisničko ime mora imati najmanje 5 karaktera." });
    }
    if (brojTelefona.length < 9) {
      return res
        .status(400)
        .json({ message: "Broj telefona mora imati najmanje 9 cifara." });
    }

    //? Generisemo verifikacioni token
    const verifikacijskiToken = uuidv4();

    //? Hesiramo lozinku
    const hesiranaLozinka = await bcrypt.hash(lozinka, 10); // 10 je broj rundi soli

    await Korisnik.create({
      korisnickoIme,
      lozinka: hesiranaLozinka,
      ime,
      prezime,
      brojTelefona,
      email,
      verifikacijskiToken,
    });

    //? Kreirajte HTML kod za dugme
    const verifyButtonHtml = `<a href=${req.protocol}://${req.get(
      "host"
    )}/korisnik/verify/${verifikacijskiToken} style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Potvrdite vašu email adresu</a>`;

    //? Pošaljite email za verifikaciju
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Potvrdite vašu email adresu",
      html: `Kliknite na dugme ispod da biste potvrdili vašu email adresu:<br><br>${verifyButtonHtml}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      status: "success",
      message:
        "Uspešno kreiran korisnik. Molimo proverite vašu email adresu radi potvrde.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.errors[0].message });
  }
});

//?verifikacija tokena
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await Korisnik.findOne({
      where: { verifikacijskiToken: token },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Neispravan verifikacioni token" });
    }

    //? Ažurirajte status verifikacije korisnika
    user.validan = true;
    user.verifikacijskiToken = null;
    await user.save();

    res.redirect(`${clientUrl}/login.component`); //! STAVITI LINK GDE CE DA VODI POSLE CEKIRANJA MEJLA
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//?prijava na sistem
router.post("/login", async (req, res) => {
  try {
    const { korisnickoIme, lozinka } = req.body;

    //? Pronalazenje korisnika po bas tom korisnickom imenu
    const korisnik = await Korisnik.findOne({ where: { korisnickoIme } });

    if (!korisnik) {
      //? provera dali korisnik postoji
      return res.status(404).json({ message: "Korisničko ime ne postoji" });
    }

    //? uporedjivanje hesovane lozinke sa unetom lozinkom
    const ispravnaLozinka = await bcrypt.compare(lozinka, korisnik.lozinka);

    if (!ispravnaLozinka) {
      //? Neispravna lozinka
      return res.status(401).json({ message: "Neispravna lozinka" });
    }
    const exp = korisnik.role == "korisnik" ? "1h" : "8h";

    //? Generisanje JWT tokena
    const token = jwt.sign(
      { email: korisnik.email, idKorisnik: korisnik.idKorisnik },
      process.env.JWT_SECRET,
      {
        expiresIn: exp,
      }
    );

    //? kreiranje korisnickih podataka za slanje u cookies
    const userData = {
      idKorisnika: korisnik.idKorisnik,
      korisnickoIme: korisnik.korisnickoIme,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      brojTelefona: korisnik.brojTelefona,
      email: korisnik.email,
      rola: korisnik.role,
    };

    //? slanje json web tokena u cookies
    const cookieExp =
      korisnik.role === "korisnik"
        ? new Date(Date.now() + 1000 * 60 * 60)
        : new Date(Date.now() + 1000 * 60 * 60 * 8);

    res.cookie("token", token, {
      expires: cookieExp,
      httpOnly: true,
      path: "/",
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    //? slanje korisnicke podatke u cookies
    const cookieSettings = {
      expires: cookieExp,
      path: "/",
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    };
    if (process.env.DEPLOY === "1") {
      cookieSettings.domain = clientUrl
        .replace("https://", "")
        .replace("http://", "");
    }
    res.cookie("userData", JSON.stringify(userData), cookieSettings);

    res.status(200).json({
      userData,
      message: `Korisnik ${userData.ime} je uspešno prijavljen.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

//?odjava sa sistema
router.post("/logout", (req, res) => {
  try {
    //? Brisanje JWT tokena iz kolačića
    res.clearCookie("token");
    if (process.env.DEPLOY === "1") {
      res.clearCookie("userData", {
        domain: clientUrl.replace("https://", "").replace("http://", ""),
      });
    } else {
      res.clearCookie("userData");
    }
    //? Vraćanje odgovora sa statusom 200 i porukom odjavljivanja
    res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

//?kada korisnik zaboravi sifru, prosledjivanje mejla i slanje na mejl reset token
router.post("/zaboravljena-sifra", async (req, res) => {
  try {
    const { email } = req.body;

    //? provera da li korisnik postoji sa ovim mejlom u bazi
    const korisnik = await Korisnik.findOne({ where: { email } });

    if (!korisnik) {
      return res
        .status(404)
        .json({ message: "Korisnik sa datim email-om ne postoji" });
    }

    //?kreiranje tokena za reset
    const resetToken = uuidv4();

    //? cuvanje tokena u bazi
    korisnik.resetToken = resetToken;
    await korisnik.save();

    //? kreiranje html dugmeta i slanje na mejl
    const resetButtonHtml = `<a href=${clientUrl}/passwordreset/${resetToken} style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Resetuj šifru</a>`;

    const resetLinkHtml = `Kliknite na link ispod da biste resetovali vašu šifru:<br><br>${resetButtonHtml}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resetovanje šifre",
      html: resetLinkHtml,
    };

    await transporter.sendMail(mailOptions);
    const trenutnoVreme = new Date();
    console.log("Trenutno vreme je:", trenutnoVreme);
    res.status(200).json({
      message: "Email sa instrukcijama za resetovanje šifre je poslat",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//?kreiranje nove rute koja prihvata verifikacioni token i prikazati formu za unos nove šifre
router.get("/reset-sifra/:token", (req, res) => {
  const { token } = req.params;

  res.render(`${clientUrl}/passwordreset`, { token });
});

router.post("/reset-sifra/:token", async (req, res) => {
  const { token } = req.params;
  const { novaSifra, potvrdaSifre } = req.body;

  try {
    const korisnik = await Korisnik.findOne({ where: { resetToken: token } });

    console.log("Found user:", korisnik);

    if (!korisnik) {
      return res.status(404).json({
        message: "Neispravan verifikacioni token za resetovanje šifre",
      });
    }

    if (novaSifra !== potvrdaSifre) {
      return res
        .status(400)
        .json({ message: "Nova šifra i potvrda šifre se ne podudaraju" });
    }

    const hesiranaSifra = await bcrypt.hash(novaSifra, 10);

    korisnik.lozinka = hesiranaSifra;
    korisnik.resetToken = null;
    await korisnik.save();

    res.status(200).json({ message: "Šifra je uspešno resetovana" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

//?Brisanje korisnika po id-u
router.delete("/:idKorisnik", async (req, res) => {
  try {
    const { idKorisnik } = req.params; //? id korisnika koji se brise

    const deleteKorisnik = await Korisnik.destroy({
      where: { idKorisnik: idKorisnik },
      limit: 1,
    });

    if (deleteKorisnik === 0) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    res.status(200).json({ message: "Korisnik uspešno obrisan" });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

//? editovanje korisnika po id-u
router.put("/:idKorisnik", async (req, res) => {
  try {
    const { idKorisnik } = req.params; //ID korisnika koji se menja
    const {
      korisnickoIme,
      ime,
      prezime,
      brojTelefona,
      email,
      role,
      vremeTrajanjaRole,
      privremenaRola,
    } = req.body;
    console.log(idKorisnik);

    let updateKorisnik;

    let staraRola;
    if (privremenaRola) {
      const korisnik = await Korisnik.findByPk(idKorisnik);
      staraRola = korisnik.role;
    }

    updateKorisnik = await Korisnik.update(
      { korisnickoIme, ime, prezime, brojTelefona, email, role },
      { where: { idKorisnik: idKorisnik }, limit: 1 }
    );

    if (privremenaRola) {
      setTimeout(() => {
        Korisnik.update(
          {
            role: staraRola,
          },
          {
            where: { idKorisnik: idKorisnik },
            limit: 1,
          }
        );
      }, vremeTrajanjaRole * 60 * 60 * 1000);
    }

    if (updateKorisnik[0] === 0) {
      return res.status(404).json({ message: "korisnik nije pronađen" });
    }
    return res.status(200).json({ message: "Korisnik uspešno promenjen" });
  } catch (error) {
    res.status(500).json({ message: "došlo je do greške", error });
  }
});

//? dobavljanje karti za odredjenog korisnika
router.post("/karta", async (req, res) => {
  try {
    const { korisnikId } = req.body;

    const rezultat = [];

    const karte = await Rezervacija.findAll({
      where: { korisnikId },
    });

    res.status(200).json({ message: "izvučen korisnik", karte });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "došlo je do greške pri filtriranju", error });
  }
});

module.exports = router;
