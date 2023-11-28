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
    const autobusi = await Cena.findOne({
      where: { id },
    });
    res
      .status(200)
      .json({ message: "uspesno dobavljena rezervacija", autobusi });
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

module.exports = router;
