import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import database from "./dbConfig.js";

import BusRouter from "./Routes/BusRoute.js";
import KorisnikRouter from "./Routes/KorisnikRoute.js";
import GradRouter from "./Routes/GradRoute.js";
import LinijaRoute from "./Routes/Index.js";
import StanicaRouter from "./Routes/StanicaRoute.js";
import StjuardesaRouter from "./Routes/StjuardesaRoute.js";
import RezervacijaRoute from "./Routes/RezervacijaRoute.js";
import Korisnik from "./Models/KorisnikModels.js";
import bc from "bcrypt";
import CenaRouter from "./Routes/CenaRoute.js";

//? Kreiranje server
export const app = express();

//? Middleware za koriscenje JSON podataka (kad prosledis sa postman-om BODY)
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
database
  .authenticate()
  .then(() => {
    Korisnik.findOrCreate({
      where: { korisnickoIme: "admin" },
      defaults: {
        korisnickoIme: "admin",
        lozinka: bc.hashSync("admin123", 10),
        ime: "admin",
        prezime: "admin",
        brojTelefona: "123456789",
        email: "admin@admin.com",
        role: "admin",
        validan: true,
      },
    });
    console.log("Sequilize connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to Sequelize", err);
  });

//? Pravljenje rute
app.use("/korisnik", KorisnikRouter);
app.use("/autobusi", BusRouter);
app.use("/gradovi", GradRouter);
app.use("/linija", LinijaRoute);
app.use("/stanica", StanicaRouter);
app.use("/stjuardesa", StjuardesaRouter);
app.use("/rezervacije", RezervacijaRoute);
app.use("/cena", CenaRouter);

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log("Server je pokenut na portu 5000");
});

export default app;
