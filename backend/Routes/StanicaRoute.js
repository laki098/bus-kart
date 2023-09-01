import express from "express";
import Stanica from "../Models/StanicaModels.js";

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
    res.status(200).json({ message: "uspesno pronadjena stanica", stanica });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { naziv, adresa } = req.body;

    const novaStanica = await Stanica.create({ naziv, adresa });
    res
      .status(201)
      .json({ message: "Uspesno dodata nova stanica", novaStanica });
  } catch (error) {
    res.status(500).json({ message: error.errors[0].message });
  }
});

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
      res.status(404).json({ message: "Stanica nije pronadjena" });
    }
    res.status(200).json({ message: "Stanica je uspesno izmenjena" });
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
      return res.status(404).json({ message: "Stanica nije pronadjena" });
    }

    res.status(200).json({ message: "Stanica je uspesno izbrisana" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Doslo je do greske prilikom ocitavanja baze", error });
  }
});
export default router;
