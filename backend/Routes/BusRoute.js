/* import express from "express";

import Bus from "../Models/BusModels.js"; */

const express = require("express");
const Bus = require("../Models/BusModels.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const autobusi = await Bus.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res
      .status(200)
      .json({ message: "uspešno dobavljeni svi autobusi", autobusi });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

router.get("/:idAutobusa", async (req, res) => {
  const { idAutobusa } = req.params;
  try {
    const autobusi = await Bus.findOne({
      where: { idAutobusa: idAutobusa },
    });
    res
      .status(200)
      .json({ message: "uspešno dobavljeni svi autobusi", autobusi });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

router.get("/oznaka/:oznakaBusa", async (req, res) => {
  const { oznakaBusa } = req.params;
  console.log(oznakaBusa);
  try {
    const autobusi = await Bus.findOne({
      where: { oznakaBusa: oznakaBusa },
    });
    res
      .status(200)
      .json({ message: "uspešno dobavljeni svi autobusi", autobusi });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { oznakaBusa, tablice, brojSedista } = req.body;

    const newBus = await Bus.create({ oznakaBusa, tablice, brojSedista });
    res.status(201).json({ message: "Uspešno kreiran autobus", newBus });
  } catch (error) {
    res.status(500).json({ message: error.errors[0].message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID autobusa koji se menja
    const { oznakaBusa, tablice, brojSedista } = req.body;

    const updatedBus = await Bus.update(
      { oznakaBusa, tablice, brojSedista },
      { where: { idAutobusa: id }, limit: 1 }
    );

    if (updatedBus[0] === 0) {
      return res.status(404).json({ message: "Autobus nije pronađen" });
    }

    res.status(200).json({ message: "Autobus je uspešno izmenjen" });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: "Proverite unete podatke", status: "failed" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Već postoji autobus sa ovim tablicama ili oznakom",
        status: "failed",
      });
    }
    res.status(500).json({ message: "Došlo je do greške", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID autobusa koji se briše

    const deletedBus = await Bus.destroy({
      where: { idAutobusa: id },
      limit: 1,
    });

    if (deletedBus === 0) {
      return res.status(404).json({ message: "Autobus nije pronađen" });
    }

    res.status(200).json({ message: "Autobus je uspešno obrisan" });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

module.exports = router;
