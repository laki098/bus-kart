import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import BusRouter from "./Routes/BusRoute.js";
import KorisnikRouter from "./Routes/KorisnikRoute.js";
import GradRouter from "./Routes/GradRoute.js";
import LinijaRoute from "./Routes/Index.js";

//? Kreiranje server
export const app = express();
//? Middleware za koriscenje JSON podataka (kad prosledis sa postman-om BODY)
app.use(express.json());
app.use(cookieParser());

//? Pravljenje rute
app.use("/korisnik", KorisnikRouter);
app.use("/autobusi", BusRouter);
app.use("/gradovi", GradRouter);
app.use("/linija", LinijaRoute);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log("Server je pokenut na portu 3000");
});

export default app;
