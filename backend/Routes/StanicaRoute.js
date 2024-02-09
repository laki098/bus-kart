/* import express from "express";
import Stanica from "../Models/StanicaModels.js";
import { isAuthenticated, isAuthorized } from "../Middlewares/auth.js"; */

const express = require("express");
const Stanica = require("../Models/StanicaModels.js");
const { isAuthenticated, isAuthorized } = require("../Middlewares/auth.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stanice = await Stanica.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return res.json({ stanice });
  } catch (error) {
    res.status(500).json({ message: "eeaeasrasr", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const stanica = await Stanica.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).json({ message: "uspešno pronađena stanica", stanica });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške", error });
  }
});

router.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin", "biletar"]),
  async (req, res) => {
    try {
      const { naziv, adresa } = req.body;

      console.log(naziv);

      const novaStanica = await Stanica.create({ naziv, adresa });
      res
        .status(201)
        .json({ message: "Uspešno dodata nova stanica", novaStanica });
    } catch (error) {
      res.status(500).json({ message: error.errors[0].message });
    }
  }
);

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { naziv, adresa } = req.body;

    const updateStanica = await Stanica.update(
      {
        naziv,
        adresa,
      },
      { where: { id }, limit: 1 }
    );
    if (updateStanica[0] === 0) {
      res.status(404).json({ message: "Stanica nije pronađena" });
    }
    res.status(200).json({ message: "Stanica je uspešno izmenjena" });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteStanica = await Stanica.destroy({
      where: { id },
      limit: 1,
    });

    if (deleteStanica === 0) {
      return res.status(404).json({ message: "Stanica nije pronađena" });
    }

    res.status(200).json({ message: "Stanica je uspešno izbrisana" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom očitavanja baze", error });
  }
});
module.exports = router;
