const express = require("express");
const cron = require("node-cron");

const Rezervacija = require("../Models/RezervacijaModels");
const Korisnik = require("../Models/KorisnikModels");
const { Op } = require("sequelize");

const router = express.Router();

const proveriNecekirane = async () => {
  const sada = new Date();
  const preSatVremena = new Date(sada.getTime() - 60 * 60 * 1000); // Pre tačno sat vremena

  try {
    //? Pronađi rezervacije koje su završene u poslednjih sat vremena i gde korisnik nije čekiran
    const necekiraneRezervacije = await Rezervacija.findAll({
      where: {
        datumDolaska: {
          [Op.eq]: new Date().toISOString().split("T")[0],
        },
        cekiran: false,
        vremeDolaska: {
          [Op.between]: [
            preSatVremena.toTimeString().split(" ")[0],
            sada.toTimeString().split(" ")[0],
          ],
        },
      },
      include: [{ model: Korisnik, required: true }],
    });

    console.log(necekiraneRezervacije);

    //? Ažuriraj broj nedolazaka za korisnike
    for (const rezervacija of necekiraneRezervacije) {
      const korisnik = await Korisnik.findByPk(rezervacija.korisnikId);
      if (korisnik) {
        await korisnik.update({
          brojNeDolazaka: korisnik.brojNeDolazaka + 1,
        });
      }
    }

    console.log(
      `Ažurirano ${necekiraneRezervacije.length} korisnika za nedolaske.`
    );
  } catch (err) {
    console.error("Greška prilikom ažuriranja korisnika za nedolaske:", err);
  }
};

//? Funkcija koja sadrži logiku za cron job
const izvrsiCronPosao = async () => {
  console.log("Izvršavanje cron posla...");
  await proveriNecekirane();
  //? Dodaj svoju logiku ovde
};

//? Cron job koji se pokreće svakog sata
cron.schedule("0 * * * *", () => {
  console.log("Cron job pokrenut:", new Date());
  izvrsiCronPosao();
});

router.get("/manual", (req, res) => {
  try {
    izvrsiCronPosao(); // Ručno pokretanje cron posla
    res.status(200).send(`Cron posao uspešno pokrenut ručno: ${new Date()}`);
  } catch (err) {
    res.status(500).send("Došlo je do greške prilikom pokretanja cron posla.");
  }
});

module.exports = router;
