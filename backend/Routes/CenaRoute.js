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

module.exports = router;
