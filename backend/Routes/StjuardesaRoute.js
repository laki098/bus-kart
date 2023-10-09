import express from "express";
import Linija from "../Models/LinijaModels.js";
import Stanica from "../Models/StanicaModels.js";
import Bus from "../Models/BusModels.js";

const router = express.Router();

router.get("/:idKorisnika", async (req, res) => {
  try {
    const idStjuardese = req.params.idKorisnika;

    const oznakaBusa = req.params.oznakaBusa;
    const izvlacenjeLinija = await Linija.findAll({
      where: {
        stjuardesa: idStjuardese,
      },
      include: [
        {
          model: Stanica,
          as: "pocetnaStanica",
        },
        {
          model: Stanica,
          as: "krajnjaStanica",
        },

        Stanica,
      ],
    });

    res.status(200).json({ message: "uspesno izvadjena", izvlacenjeLinija });
  } catch (error) {
    res.status(500).json({ message: "bag" });
  }
});

router.get("/filterLinija/:id", async (req, res) => {
  try {
    const id = req.params.id;

    //!USLOV DA PITAM DA LI JE BAS TA STJUARDESA

    const izvlacenjeLinija = await Linija.findOne({
      where: { id: id },
      include: [
        {
          model: Stanica,
          as: "pocetnaStanica",
        },
        {
          model: Stanica,
          as: "krajnjaStanica",
        },

        Stanica,
      ],
    });

    res.status(200).json({ message: "uspesno izvadjena st", izvlacenjeLinija });
  } catch (error) {
    res.status(500).json({ message: "bag" });
  }
});

export default router;
