import express from "express";
import Rezervacija from "../Models/RezervacijaModels.js";

const router = express.Router();

//? dobijanje rezervacija po bas odredjenoj liniji
router.get("/linija/:linijaId", async (req, res) => {
  try {
    const linijaId = req.params.linijaId;
    console.log(req.params.linijaId)

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
