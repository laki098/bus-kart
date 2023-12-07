/* import express from "express";
import Cena from "../Models/Cena.js"; */

const express = require("express");
const Cena = require("../Models/Cena.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cena = await Cena.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return res.json({ cena });
  } catch (error) {
    res.status(500).json({ message: "eeaeasrasr", error });
  }
});

//? izvlacenje cene po id u
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log(id);
    const cena = await Cena.findOne({
      where: { id },
    });
    res.status(200).json({ message: "uspesno dobavljena rezervacija", cena });
  } catch (error) {
    res.status(500).json({ message: "doslo je do greske" });
  }
});

//? izvlacenje cene po pocetnom i krajnjem gradu i obracun
router.post("/filterCena", async (req, res) => {
  const { pocetnaStanica, krajnjaStanicaR, tipKarte } = req.body;

  try {
    const cena = await Cena.findOne({
      where: { pocetnaStanica, krajnjaStanicaR },
    });
    if (tipKarte == "Jednosmerna") {
      res.status(200).json({ message: "uspesno dobavljena rezervacija", cena });
    }
    if (tipKarte == "Povratna") {
      const cenaPovratne = cena.cenaKarte + cena.cenaKarte * 0.7;
      res
        .status(200)
        .json({ message: "uspesno dobavljena rezervacija", cenaPovratne });
    }
    res.status(200).json({ message: "uspesno dobavljena rezervacija", cena });
  } catch (error) {
    res.status(500).json({ message: "doslo je do greske" });
  }
});

//? postavljanje novog autobusa
router.post("/", async (req, res) => {
  try {
    const { pocetnaStanica, krajnjaStanicaR, cenaKarte } = req.body;

    const novaCena = await Cena.create({
      pocetnaStanica,
      krajnjaStanicaR,
      cenaKarte,
    });
    res.status(201).json({ message: "uspesno kreirana cena", novaCena });
  } catch (error) {
    res.status(500).json({ message: error.errors[0].message });
  }
});

//? izmena cene
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID cene koji se menja
    const { pocetnaStanica, krajnjaStanicaR, cenaKarte } = req.body;

    const izmenaCene = await Cena.update(
      { pocetnaStanica, krajnjaStanicaR, cenaKarte },
      { where: { id: id }, limit: 1 }
    );

    if (izmenaCene[0] === 0) {
      return res.status(404).json({ message: "Cnea nije pronađen" });
    }

    res.status(200).json({ message: "Cena je uspešno izmenjen" });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške", error });
  }
});

//? Brisanje cene
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID autobusa koji se briše

    const deleteCene = await Cena.destroy({
      where: { id },
      limit: 1,
    });

    if (deleteCene === 0) {
      return res.status(404).json({ message: "Cena nije pronađen" });
    }

    res.status(200).json({ message: "Cena je uspešno obrisan" });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

module.exports = router;
