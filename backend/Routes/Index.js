/* import express from "express";
import Linija from "../Models/LinijaModels.js";
import Medjustanica from "../Models/MedjustanicaModels.js";
import Stanica from "../Models/StanicaModels.js";
import Rezervacija from "../Models/RezervacijaModels.js";
import Bus from "../Models/BusModels.js";

import qrcode from "qrcode";
import fs from "fs";
import nodemailer from "nodemailer";
import Korisnik from "../Models/KorisnikModels.js";
import { isAuthenticated, isAuthorized } from "../Middlewares/auth.js"; */

const express = require("express");
const { isAuthenticated, isAuthorized } = require("../Middlewares/auth.js");
const Korisnik = require("../Models/KorisnikModels.js");
const Bus = require("../Models/BusModels.js");
const Rezervacija = require("../Models/RezervacijaModels.js");
const Stanica = require("../Models/StanicaModels.js");
const Medjustanica = require("../Models/MedjustanicaModels.js");
const Linija = require("../Models/LinijaModels.js");
const db = require("../dbConfig.js");

const qrcode = require("qrcode");
const fs = require("fs");
const nodemailer = require("nodemailer");

const { Op } = require("sequelize");

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

    //? Dohvatanje linije iz baze podataka
    const linija = await Linija.findOne({
      where: { id },
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

    //? Ako nije pronađena linija s datim ID-jem
    if (!linija) {
      return res.status(404).json({ message: "Linija nije pronađena" });
    }

    //? Sortiranje stanica linije po redosledu međustanica
    linija.Stanicas.sort((stanica1, stanica2) => {
      return stanica1.Medjustanica.redosled - stanica2.Medjustanica.redosled;
    });

    //? Slanje odgovora sa sortiranom linijom
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
      kola,
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

    // Kreiranje linija za svaki datum
    for (let i = 0; i < datumPolaska.length; i++) {
      const datumPolaska1 = datumPolaska[i];
      const datumDolaska1 = datumDolaska[i];

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
        datumPolaska: datumPolaska1,
        datumDolaska: datumDolaska1,
        pocetakRute: stanica.pocetakRute,
        krajRute: stanica.krajRute,
      }));

      // Kreiranje linije
      const novaLinija = await Linija.create({
        vremePolaska,
        vremeDolaska,
        datumPolaska: datumPolaska1,
        datumDolaska: datumDolaska1,
        brojSlobodnihMesta,
        oznakaBusa,
        pocetakRute,
        krajRute,
        stjuardesa,
        vozac,
        kola,
      });

      // Povezivanje početne stanice i krajnje stanice s linijom
      novaLinija.setPocetnaStanica(pocetna);
      novaLinija.setKrajnjaStanica(krajnja);
      // Povezivanje medjustanica sa vremenima s linijom
      if (
        Array.isArray(medjustaniceWithTimes) &&
        medjustaniceWithTimes.length > 0
      ) {
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
      }
    }

    return res.status(201).json({ message: "Uspešno dodate nova linija" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greška na serveru", detalji: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const transaction = await db.transaction();
  try {
    const linijaId = req.params.id;
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
      kola,
    } = req.body;

    // Preuzmi autobus na osnovu oznakeBusa iz modela Bus
    const autobus = await Bus.findOne(
      { where: { oznakaBusa } },
      { transaction }
    );
    if (!autobus) {
      await transaction.rollback();
      return res.status(404).json({ message: "Autobus nije pronađen." });
    }

    const brojSedista = autobus.brojSedista;

    const postojucaLinija = await Linija.findByPk(linijaId, {
      include: Stanica,
      transaction,
    });
    if (!postojucaLinija) {
      await transaction.rollback();
      return res.status(404).json({ message: "Linija nije pronađena." });
    }

    // Povezivanje početne i krajnje stanice s linijom
    const pocetna = await Stanica.findOne(
      { where: { naziv: pocetnaStanica } },
      { transaction }
    );
    const krajnja = await Stanica.findOne(
      { where: { naziv: krajnjaStanica } },
      { transaction }
    );
    if (!pocetna || !krajnja) {
      await transaction.rollback();
      return res.status(404).json({ message: "Stanica nije pronađena." });
    }
    postojucaLinija.pocetnaStanicaId = pocetna.id;
    postojucaLinija.krajnjaStanicaId = krajnja.id;

    // Ažurirana svojstva linije
    postojucaLinija.vremePolaska = vremePolaska;
    postojucaLinija.vremeDolaska = vremeDolaska;
    postojucaLinija.datumPolaska = datumPolaska;
    postojucaLinija.datumDolaska = datumDolaska;
    postojucaLinija.oznakaBusa = oznakaBusa;
    postojucaLinija.pocetakRute = pocetakRute;
    postojucaLinija.krajRute = krajRute;
    postojucaLinija.stjuardesa = stjuardesa;
    postojucaLinija.vozac = vozac;
    postojucaLinija.kola = kola;

    // Validacija rezervacija u odnosu na kapacitet novog autobusa
    const reservations = await Rezervacija.findAll({
      where: { linijaId },
      transaction,
    });

    // Provera: Ukupan broj rezervacija ne sme biti veći od kapaciteta autobusa
    if (reservations.length > brojSedista) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Nije moguće promeniti autobus: broj rezervacija prelazi kapacitet novog autobusa.",
      });
    }

    //  Validacija pojedinačnih rezervacija
    let zauzetaSedista = new Set();
    reservations.forEach((rez) => {
      const sediste = Number(rez.oznakaSedista);
      console.log(sediste, brojSedista, "---------------------");
      if (sediste >= 1 && sediste <= brojSedista) {
        zauzetaSedista.add(sediste);
      }
    });

    for (const rez of reservations) {
      const trenutnoSediste = Number(rez.oznakaSedista);
      if (trenutnoSediste < 1 || trenutnoSediste > brojSedista) {
        console.log(
          `Rezervacija ID ${rez.id}: oznakaSedista ${trenutnoSediste} van opsega [1, ${brojSedista}]`
        );
        let novoSediste = null;
        for (let i = 1; i <= brojSedista; i++) {
          if (!zauzetaSedista.has(i)) {
            novoSediste = i;
            zauzetaSedista.add(i);
            break;
          }
        }
        if (novoSediste === null) {
          await transaction.rollback();
          return res.status(400).json({
            message: "Nema slobodnih sedišta za preusmeravanje rezervacije.",
          });
        }
        rez.oznakaSedista = novoSediste;
        await rez.save({ transaction });
        console.log(
          `Rezervacija ID ${rez.id} ažurirana: novo oznakaSedista ${novoSediste}`
        );
        // Opciono: dodaj logiku za slanje email notifikacije korisniku
      }
    }

    // Izračunaj broj slobodnih mesta: kapacitet autobusa minus broj rezervacija
    const brojRezervacija = reservations.length;
    const slobodnaMesta = brojSedista - brojRezervacija;
    postojucaLinija.brojSlobodnihMesta = slobodnaMesta;

    // Sačuvaj izmene linije unutar transakcije
    await postojucaLinija.save({ transaction });

    // Azuriranje medjustanice
    for (let i = 0; i < medjustanice.length; i++) {
      if (
        medjustanice[i] === null ||
        (medjustanice[i] && Object.keys(medjustanice[i]).length === 0)
      ) {
        continue;
      }
      const medjustanicaData = medjustanice[i];
      const redosled = medjustanicaData.redosled;
      const stanicaIdFr = medjustanicaData.stanica;
      let stanicaId1;

      if (stanicaIdFr) {
        stanicaId1 = await Stanica.findOne({ where: { naziv: stanicaIdFr } });
      }

      const medjustanica = await Medjustanica.findOne({
        where: { redosled, linijaId },
      });
      if (!medjustanica) {
        await Medjustanica.create({
          redosled,
          brojSlobodnihMesta: postojucaLinija.brojSlobodnihMesta,
          vremePolaskaM: medjustanicaData.vremePolaskaM,
          vremeDolaskaM: medjustanicaData.vremeDolaskaM,
          datumPolaskaM: medjustanicaData.datumPolaskaM,
          datumDolaskaM: medjustanicaData.datumDolaskaM,
          pocetakRute: null,
          krajRute: null,
          linijaId,
          stanicaId: stanicaId1.id,
        });
      } else {
        const updateData = {};

        if (
          medjustanicaData.vremePolaskaM !== undefined &&
          medjustanicaData.vremePolaskaM !== null
        ) {
          updateData.vremePolaskaM = medjustanicaData.vremePolaskaM;
        }
        if (
          medjustanicaData.vremeDolaskaM !== undefined &&
          medjustanicaData.vremeDolaskaM !== null
        ) {
          updateData.vremeDolaskaM = medjustanicaData.vremeDolaskaM;
        }
        if (
          medjustanicaData.datumPolaskaM !== undefined &&
          medjustanicaData.datumPolaskaM !== null
        ) {
          updateData.datumPolaskaM = medjustanicaData.datumPolaskaM;
        }
        if (
          medjustanicaData.datumDolaskaM !== undefined &&
          medjustanicaData.datumDolaskaM !== null
        ) {
          updateData.datumDolaskaM = medjustanicaData.datumDolaskaM;
        }
        if (
          medjustanicaData.pocetakRute !== undefined &&
          medjustanicaData.pocetakRute !== null
        ) {
          updateData.pocetakRute = medjustanicaData.pocetakRute;
        }
        if (
          medjustanicaData.krajRute !== undefined &&
          medjustanicaData.krajRute !== null
        ) {
          updateData.krajRute = medjustanicaData.krajRute;
        }
        if (stanicaId1 && stanicaId1.id !== undefined) {
          updateData.stanicaId = stanicaId1.id;
        }

        await Medjustanica.update(updateData, {
          where: { redosled, linijaId },
        });
      }
    }

    // Commit transakcije da se sve promene sačuvaju u bazi
    await transaction.commit();
    return res.status(200).json({ message: "Uspešno uređena linija." });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({ error });
  }
});

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

router.post("/rezervacija", async (req, res) => {
  const t = await db.transaction();
  try {
    const {
      // brojMesta više ne koristimo direktno (računamo iz sedišta)
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
      oznakaSedista, // može biti [1,2,3] ili "1,2,3" ili 5
      tipKarte,
      email,
      imeIprezime,
      brojTelefona,
    } = req.body;

    // --- Normalizacija sedišta ---
    let seatsToReserve = [];
    if (Array.isArray(oznakaSedista)) {
      seatsToReserve = oznakaSedista;
    } else if (typeof oznakaSedista === "string") {
      seatsToReserve = oznakaSedista
        .split(",")
        .map((s) => Number(String(s).trim()))
        .filter((n) => Number.isFinite(n));
    } else if (typeof oznakaSedista === "number") {
      seatsToReserve = [oznakaSedista];
    }
    // uniq + >=1
    seatsToReserve = Array.from(new Set(seatsToReserve.map(Number))).filter(
      (n) => Number.isFinite(n) && n >= 1
    );
    if (seatsToReserve.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Nisu prosleđena sedišta." });
    }
    const requestedCount = seatsToReserve.length;

    // --- Učitavanje i lockovanje podataka ---
    const linija = await Linija.findByPk(linijaId, {
      include: Stanica,
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!linija) {
      await t.rollback();
      return res.status(404).json({ message: "Linija nije pronađena" });
    }

    const stanicaP = await Stanica.findByPk(pocetnaStanicaId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const stanicaK = await Stanica.findByPk(krajnjaStanicaId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!stanicaP || !stanicaK) {
      await t.rollback();
      return res.status(404).json({ message: "Stanica nije pronađena" });
    }

    const korisnik = await Korisnik.findByPk(korisnikId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!korisnik) {
      await t.rollback();
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    // --- Vremenska validacija (15 min) ---
    const trenutnoVreme = new Date();
    const vremePolaskaRequest = new Date(`${datumPolaska}T${vremePolaska}`);
    const razlikaMin = (vremePolaskaRequest - trenutnoVreme) / (1000 * 60);
    if (razlikaMin < -15) {
      await t.rollback();
      return res.status(400).json({
        message:
          "Vreme polaska je manje od vremena polaska linije za više od 15 minuta.",
      });
    }

    // --- Provera da li su početna/krajnja validne za liniju ---
    let postojiStanicaP = false;
    let postojiStanicaK = false;

    if ((linija.Stanicas || []).length === 0) {
      if (linija.pocetnaStanicaId === pocetnaStanicaId) postojiStanicaP = true;
      if (linija.krajnjaStanicaId === krajnjaStanicaId) postojiStanicaK = true;
    } else {
      for (const s of linija.Stanicas) {
        if (
          s.id === pocetnaStanicaId ||
          linija.pocetnaStanicaId === pocetnaStanicaId
        ) {
          postojiStanicaP = true;
        }
        if (
          s.id === krajnjaStanicaId ||
          linija.krajnjaStanicaId === krajnjaStanicaId
        ) {
          postojiStanicaK = true;
        }
      }
    }

    if (!postojiStanicaP) {
      await t.rollback();
      return res.status(404).json({ message: "Ne postoji stanica početna" });
    }
    if (!postojiStanicaK) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Ne postoji stanica krajnja na ispisanoj liniji" });
    }

    // --- Limit: max 3 karte po liniji za običnog korisnika ---
    if (korisnik.role === "korisnik") {
      const totalPrevSeatsRaw = await Rezervacija.sum("brojMesta", {
        where: { korisnikId, linijaId },
        transaction: t,
      });
      const totalPrevSeats = Number(totalPrevSeatsRaw) || 0;
      if (totalPrevSeats + requestedCount > 3) {
        await t.rollback();
        return res.status(400).json({
          message:
            "Rezervacija ne može da pređe 3 karte online za istu liniju. Ako želite više mesta, pozovite dispečera.",
        });
      }
    }

    // --- Provera zauzetosti traženih sedišta na istoj liniji ---
    const existingSeats = await Rezervacija.findAll({
      where: {
        linijaId,
        oznakaSedista: { [Op.in]: seatsToReserve },
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (existingSeats.length > 0) {
      const taken = existingSeats.map((r) => r.oznakaSedista);
      await t.rollback();
      return res.status(409).json({
        message: `Neka od traženih sedišta su već zauzeta: ${taken.join(", ")}`,
      });
    }

    // --- Ažuriranje slobodnih mesta (linija + medjustanice) ---
    // 1) Početna = početna linije
    if (linija.pocetnaStanicaId === pocetnaStanicaId) {
      if (linija.brojSlobodnihMesta < requestedCount) {
        await t.rollback();
        return res.status(404).json({ message: "nema dovoljno mesta" });
      }
      linija.brojSlobodnihMesta -= requestedCount;
      await linija.save({ transaction: t });
    }

    // 2) kompletna ruta (početna linije -> krajnja linije)
    if (
      linija.pocetnaStanicaId === pocetnaStanicaId &&
      linija.krajnjaStanicaId === krajnjaStanicaId
    ) {
      const medjustaniceSve = await Medjustanica.findAll({
        where: { linijaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      for (const m of medjustaniceSve) {
        if (m.brojSlobodnihMesta < requestedCount) {
          await t.rollback();
          return res.status(404).json({ message: "nema dovoljno mesta" });
        }
        m.brojSlobodnihMesta -= requestedCount;
        await m.save({ transaction: t });
      }
    }

    // 3) početna linije -> neka međustanica
    if (
      linija.pocetnaStanicaId === pocetnaStanicaId &&
      linija.krajnjaStanicaId !== krajnjaStanicaId
    ) {
      const medjustaniceSve = await Medjustanica.findAll({
        where: { linijaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: { linijaId, stanicaId: krajnjaStanicaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      for (const m of medjustaniceSve) {
        if (m.redosled < medjustanicaKrajnja.redosled) {
          if (m.brojSlobodnihMesta < requestedCount) {
            await t.rollback();
            return res.status(404).json({ message: "nema dovoljno mesta" });
          }
          m.brojSlobodnihMesta -= requestedCount;
          await m.save({ transaction: t });
        }
      }
    }

    // 4) između dve međustanice (ni početna ni krajnja linije)
    if (
      linija.pocetnaStanicaId !== pocetnaStanicaId &&
      linija.krajnjaStanicaId !== krajnjaStanicaId
    ) {
      linija.brojSlobodnihMesta -= requestedCount;
      await linija.save({ transaction: t });

      const medjustaniceSve = await Medjustanica.findAll({
        where: { linijaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const medjustanicaPocetna = await Medjustanica.findOne({
        where: { linijaId, stanicaId: pocetnaStanicaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const medjustanicaKrajnja = await Medjustanica.findOne({
        where: { linijaId, stanicaId: krajnjaStanicaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      for (const m of medjustaniceSve) {
        if (
          m.redosled >= medjustanicaPocetna.redosled &&
          m.redosled < medjustanicaKrajnja.redosled
        ) {
          if (m.brojSlobodnihMesta < requestedCount) {
            await t.rollback();
            return res.status(404).json({ message: "nema dovoljno mesta" });
          }
          m.brojSlobodnihMesta -= requestedCount;
          await m.save({ transaction: t });
        }
      }
    }

    // 5) neka međustanica -> krajnja linije
    if (
      linija.pocetnaStanicaId !== pocetnaStanicaId &&
      linija.krajnjaStanicaId === krajnjaStanicaId
    ) {
      linija.brojSlobodnihMesta -= requestedCount;
      await linija.save({ transaction: t });

      const medjustaniceSve = await Medjustanica.findAll({
        where: { linijaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const medjustanicaPocetna = await Medjustanica.findOne({
        where: { linijaId, stanicaId: pocetnaStanicaId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      for (const m of medjustaniceSve) {
        if (m.redosled >= medjustanicaPocetna.redosled) {
          if (m.brojSlobodnihMesta < requestedCount) {
            await t.rollback();
            return res.status(404).json({ message: "nema dovoljno mesta" });
          }
          m.brojSlobodnihMesta -= requestedCount;
          await m.save({ transaction: t });
        }
      }
    }

    // --- Kreiraj rezervaciju za SVAKO sedište ---
    const createdReservations = [];
    for (const seat of seatsToReserve) {
      const r = await Rezervacija.create(
        {
          brojMesta: 1,
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
          oznakaSedista: seat,
          tipKarte,
          email,
          imeIprezime,
          brojTelefona,
          kola: linija.kola,
        },
        { transaction: t }
      );
      createdReservations.push(r);
    }

    // --- Commit ---
    await t.commit();

    // --- Poseban mejl za SVAKU kartu (posle commit-a) ---
    if (email) {
      const opcijeQR = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.85,
        margin: 1,
        color: { dark: "#000", light: "#fff" },
      };

      for (const rez of createdReservations) {
        try {
          const qrText = `
oznakaRezervacije: ${rez.id}
LinijaId: ${linijaId}
Cekiranje URL: ${req.get("host")}/linija/cekiranje/${rez.id}
          `.trim();

          const qrBuffer = await qrcode.toBuffer(qrText, opcijeQR);

          const emailSubject = `Potvrda rezervacije – sedište ${rez.oznakaSedista}`;
          const emailHtml = `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height:1.6; }
      .card { border: 2px solid #3498db; border-radius:10px; padding:20px; max-width:480px; }
      h1 { color:#3498db; margin-top:0; }
      p { color:#333; margin:6px 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Hvala što ste rezervisali putovanje!</h1>
      <p><b>Oznaka sedišta:</b> ${rez.oznakaSedista}</p>
      <p><b>Polazna stanica:</b> ${polaznaStanicaR}</p>
      <p><b>Krajnja stanica:</b> ${krajnjaStanicaR}</p>
      <p><b>Datum polaska:</b> ${datumPolaska}</p>
      <p><b>Datum dolaska:</b> ${datumDolaska}</p>
      <p><b>Vreme polaska:</b> ${vremePolaska}</p>
      <p><b>Vreme dolaska:</b> ${vremeDolaska}</p>
      <p><b>Osveženje:</b> ${osvezenje}</p>
      <p><b>Broj kola:</b> ${linija.kola}</p>
      <p><strong>Napomena:</strong> Moguće su promene broja sedišta. Bićete pravovremeno obavešteni ukoliko dođe do promene.</p>
      <p>Provera validnosti karte:</p>
      <p><a href="${process.env.CLIENT_BASE_URL}/verifikacija/${rez.id}">Provera validnosti</a></p>
      <p>QR kod za ovu kartu je u prilogu.</p>
    </div>
  </body>
</html>
          `;

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: emailSubject,
            html: emailHtml,
            attachments: [
              {
                filename: "qrcode.png",
                content: qrBuffer, // direktno iz memorije, bez snimanja na disk
                cid: "qr-code",
              },
            ],
          });
        } catch (mailErr) {
          console.error("Slanje mejla neuspešno (rez:", rez.id, "):", mailErr);
        }
      }
    }

    return res.status(200).json({
      message: "Uspešno rezervisano.",
      rezervacije: createdReservations.map((r) => ({
        id: r.id,
        sediste: r.oznakaSedista,
      })),
    });
  } catch (error) {
    try {
      await t.rollback();
    } catch (_) {}
    console.log(error);
    return res.status(500).json(error.message || "Greška na serveru");
  }
});

//?Cekiranje karte po id rezervacije
router.post(
  "/cekiranje/:id",
  isAuthenticated,
  isAuthorized(["stjuardesa"]),
  async (req, res) => {
    try {
      //?dobijanje id rezervacije
      const { id } = req.params;
      const { linijaId, idLinijaFront } = req.body;

      //?izvlacimo Rezervaciju po id-u
      const izvlacenjeRezervacije = await Rezervacija.findByPk(id);
      const linijaIdInt = parseInt(linijaId, 10);

      if (linijaIdInt != idLinijaFront) {
        res.status(404).json({ message: "Ova karta nije za ovu liniju" });
        return;
      }

      //?Provera da li rezervacija postoji
      if (!izvlacenjeRezervacije) {
        res.status(404).json({ message: "Nepostojeća rezervacija" });
        return;
      }

      //?provera da li je karta vec cekirana
      if (izvlacenjeRezervacije.cekiran === true) {
        res.status(409).json({ message: "Karta je već čekirana" });
        return;
      }

      izvlacenjeRezervacije.cekiran = true;
      await izvlacenjeRezervacije.save();
      res.status(200).json({ message: "Uspešno čekiranje" });
    } catch (error) {
      res.status(500).json({ message: "Došlo je do greške", error });
    }
  }
);

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

router.post("/filterLinijaId", async (req, res) => {
  try {
    const { nazivPocetneStanice, nazivKrajnjeStanice, datumPolaska, id } =
      req.body;

    let rezultat = [];

    const izvuceneLinijeDatum = await Linija.findAll({
      where: {
        datumPolaska,
        id,
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

    res.status(200).json({ message: "uspešno izvučena linija", rezultat });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "došlo je do greške pri filtriranju", error });
  }
});

router.post("/filtriraneLinije", async (req, res) => {
  try {
    const sveLinije = await Linija.findAll({
      include: [
        {
          model: Stanica,
          as: "pocetnaStanica",
        },
        {
          model: Stanica,
          as: "krajnjaStanica",
        },
        {
          model: Stanica,
          as: "Stanicas",
        },
      ],
    });

    //? Set za praćenje već viđenih kombinacija
    const vidjeneKombinacije = new Set();

    //? Filtriranje linija i provera da se stanice ne ponavljaju
    const filtriraneLinije = sveLinije.filter((linija) => {
      //? Kreiranje jedinstvene kombinacije uključujući vreme polaska
      let kombinacija =
        linija.pocetnaStanica.naziv +
        linija.krajnjaStanica.naziv +
        linija.vremePolaska; // Dodavanje vremena polaska u kombinaciju

      //? Dodajemo međustanice u kombinaciju sa redosledom
      linija.Stanicas.forEach((medjustanica) => {
        kombinacija += medjustanica.naziv + medjustanica.redosled;
      });

      //? Provera da li smo već videli ovu kombinaciju
      if (!vidjeneKombinacije.has(kombinacija)) {
        //? Dodajemo kombinaciju u set ako je prvi put viđena
        vidjeneKombinacije.add(kombinacija);
        return true;
      }

      return false;
    });

    res
      .status(200)
      .json({ message: "Uspešno izvučena linija", filtriraneLinije });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Došlo je do greške pri očitavanju baze", error });
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
      return res.status(404).json({ message: "Linija nije pronađena" });
    }
    res.status(200).json({ message: "Linija uspešno obrisana" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "došlo je do greške pri očitavanju baze", error });
  }
});

module.exports = router;
