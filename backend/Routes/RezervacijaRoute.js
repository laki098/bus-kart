import express from "express";
import Rezervacija from "../Models/RezervacijaModels.js";

const router = express.Router();

//? dobijanje rezervacija po bas odredjenoj liniji
router.get("/linija", async (req, res) => {
  try {
    const linijaId = req.body.linijaId;

    const rezervacije = await Rezervacija.findAll({
      where: { linijaId },
    });

    res
      .status(200)
      .json({ message: "Uspesno dobijene rezervacije", rezervacije });
  } catch (error) {
    res.status(500).json({ message: "bag" });
  }
});

export default router;
