/* import express from "express";
import bc from "bcrypt";
 */
const express = require("express");
const bc = require("bcrypt");

//? Ovo je middleware, on takodje dobije req i res, koji ima iste podatke kao i taj endpoint na kome ga koristimo. Moze da se koristi da proverimo da li je korisnik admin npr.
import { testMiddleware } from "../Middlewares/testMiddleware.js";

const router = express.Router();

//? Pravljenje get endpoint-a. Svaki endpoint dobija request(podaci koji dolaze na server sa fronta/postmena) i response(podaci koje saljemo nazad korisniku/posmenu).
//! Uvek mora prvo request(req) pa response(res).
router.get("/autobusi", testMiddleware, function (req, res) {
  // res.status(404).send("ovo je home");
  // res.sendStatus(404);
  // req.body.ime
  const pera = "ASDasda";
  const mika = 5;

  /* console.log(req.korisnik); */

  res.json({ pera, mika });
});

//? request(req) objekat sadrzi body koji saljemo sa postmena ili sa fronta.
router.post("/autobusi", async function (req, res) {
  /* console.log(req.body); */
  const ime = req.body.ime;
  const sifra = req.body.sifra;
  const kodiranaSifra = await bc.hash(sifra.toString(), 8);

  res.status(200).json({ message: kodiranaSifra });
});

module.exports = router;
