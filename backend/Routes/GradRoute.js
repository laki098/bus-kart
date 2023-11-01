/* import express from "express";

import Grad from "../Models/GradModels.js";
import Stanica from "../Models/StanicaModels.js"; */

const express = require("express");
const Grad = require("../Models/GradModels.js");
const Stanica = require("../Models/StanicaModels.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const gradovi = await Grad.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return res.json({ gradovi });
  } catch (error) {
    res.status(500).json({ message: "eeaeasrasr", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nazivGrada, napomena, ostalo } = req.body;

    await Grad.create({
      nazivGrada,
      napomena,
      ostalo,
    });
    return res.status(201).json({ message: "Uspesno dodat nov grad" });
  } catch (error) {
    res.status(500).json({ message: error.errors[0].message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; //? ID grada koji se menja(dolazni id)
    const { nazivGrada, napomena, ostalo } = req.body;

    const updateGrada = await Grad.update(
      { nazivGrada, napomena, ostalo },
      { where: { idGrad: id }, limit: 1 }
    );

    if (updateGrada[0] === 0) {
      return res.status(404).json({ message: "Grad nije pronadjen" });
    }

    return res.status(200).json({ message: "Grad je uspesno promenjen" });
  } catch (error) {
    res.status(500).json({ message: error.errors[0].message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; //? ID grada koji se menja(dolazni id)

    const deleteGrad = await Grad.destroy({
      where: { idGrad: id },
      limit: 1,
    });

    if (deleteGrad === 0) {
      return res.status(404).json({ message: "Grad nije pronadjen" });
    }
    res.status(200).json({ message: "Uspesno je obrisan Grad" });
  } catch (error) {
    res.status(500).json({ message: "Došlo je do greške" });
  }
});

/* // Endpoint za kreiranje nove linije
router.post("/linije", async (req, res) => {
  try {
    const { grad1Id, grad2Id, medjugradovi } = req.body;

    // Kreiranje nove linije
    const novaLinija = await Linija.create();

    // Dodavanje gradova na liniju
    const grad1 = await Grad.findByPk(grad1Id);
    const grad2 = await Grad.findByPk(grad2Id);
    await novaLinija.addGradovi([grad1, grad2]);

    // Kreiranje veza između gradova
    const linijaGradovi = [
      { GradId: grad1.id, redosled: 1 },
      { GradId: grad2.id, redosled: 2 },
    ];
    for (let i = 0; i < medjugradovi.length; i++) {
      const medjugradId = medjugradovi[i];
      const medjugrad = await Grad.findByPk(medjugradId);
      linijaGradovi.push({ GradId: medjugrad.id, redosled: i + 3 });
    }
    await LinijaGrad.bulkCreate(linijaGradovi, { validate: true });

    res.status(201).json({ message: "Linija uspešno kreirana." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška prilikom kreiranja linije." });
  }
}); */

module.exports = router;
