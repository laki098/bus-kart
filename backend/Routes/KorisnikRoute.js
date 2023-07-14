import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

import Korisnik from "../Models/KorisnikModels.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const korisnici = await Korisnik.findAll();
    return res.json({ korisnici });
  } catch (error) {
    res.status(500).json({ message: "eeaeasrasr", error });
  }
});

// Kreirajte transporter za slanje email poruka
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post("/signup", async (req, res) => {
  try {
    const { korisnickoIme, lozinka, ime, prezime, brojTelefona, email } =
      req.body;

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

    // Kreirajte HTML kod za dugme
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
      message:
        "Uspešno kreiran korisnik. Molimo proverite vašu email adresu radi potvrde.",
    });
  } catch (error) {
    res.status(500).json({ message: error.errors[0].message });
  }
});

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

    res.redirect("https://www.eurocompass.rs/"); //! STAVITI LINK GDE CE DA VODI POSLE CEKIRANJA MEJLA
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { korisnickoIme, lozinka } = req.body;

    //? Pronalazenje korisnika po bas tom korisnickom imenu
    const korisnik = await Korisnik.findOne({ where: { korisnickoIme } });

    if (!korisnik) {
      //? provera dali korisnik postoji
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    //? uporedjivanje hesovane lozinke sa unetom lozinkom
    const ispravnaLozinka = await bcrypt.compare(lozinka, korisnik.lozinka);

    if (!ispravnaLozinka) {
      //? Neispravna lozinka
      return res.status(401).json({ message: "Neispravna lozinka" });
    }
    const exp = korisnik.rola === "korisnik" ? "1h" : "8h";
    //? Generisanje JWT tokena
    const token = jwt.sign({ korisnik }, process.env.JWT_SECRET, {
      expiresIn: exp,
    });

    //? slanje json web tokena u cookies
    const cookieExp =
      korisnik.rola === "korisnik"
        ? new Date(Date.now() + 1000 * 60 * 60)
        : new Date(Date.now() + 1000 * 60 * 60 * 8);
    res.cookie("jwt", token, {
      expires: cookieExp,
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.post("/logout", (req, res) => {
  try {
    // Brisanje JWT tokena iz kolačića
    res.clearCookie("jwt");

    // Vraćanje odgovora sa statusom 200 i porukom odjavljivanja
    res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.post("/zaboravljena-sifra", async (req, res) => {
  try {
    const { email } = req.body;

    //? provera da li korisnik postoji sa ovim mejlom u bazi
    const korisnik = await Korisnik.findOne({ where: { email } });

    if (!korisnik) {
      return res
        .status(404)
        .json({ message: "korisnik sa datim email-om ne postoji" });
    }

    //?kreiranje tokena za reset
    const resetToken = uuidv4();

    //? cuvanje tokena u bazi
    korisnik.resetToken = resetToken;
    await korisnik.save();

    //? kreiranje html dugmeta i slanje na mejl
    const resetButtonHtml = `<a href=${req.protocol}://${req.get(
      "host"
    )}/reset-sifra/${resetToken} style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Resetuj šifru</a>`;

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

  res.render("reset-sifra", { token }); //! promeniti rutu kada povezemo sa reactom
});

router.post("/reset-sifra/:token", async (req, res) => {
  const { token } = req.params;
  const { novaSifra, potvrdaSifre } = req.body;

  //? provera tokena u bazi sa tokenom na emailu
  const korisnik = await Korisnik.findOne({ where: { resetToken: token } });

  if (!korisnik) {
    return res
      .status(404)
      .json({ message: "Neispravan verifikacioni token za resetovanje šifre" });
  }

  //? Proverite da li nova šifra i potvrda šifre odgovaraju
  if (novaSifra !== potvrdaSifre) {
    return res
      .status(400)
      .json({ message: "Nova šifra i potvrda šifre se ne podudaraju" });
  }

  //? Hesirajte novu šifru
  const hesiranaSifra = await bcrypt.hash(novaSifra, 10);

  //? Ažurirajte šifru korisnika
  korisnik.lozinka = hesiranaSifra;
  korisnik.resetToken = null;
  await korisnik.save();

  res.status(200).json({ message: "Šifra je uspešno resetovana" });
});

export default router;
