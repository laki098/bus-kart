import Korisnik from "../Models/KorisnikModels.js";
import { checkToken } from "../helpers/authHelpers.js";
import jwt from "jsonwebtoken";

//?Sprecavanje pristupa endpointu ako korisnik nema odredjenu rolu

export const isAuthorized = (role) => {
  return (req, res, next) => {
    const korisnik = req.korisnik;

    if (!role.includes(korisnik.role)) {
      return res.status(403).json({ message: "Nemate dozvolu za pristup" });
    }

    next();
  };
};

//?Sprecavanje korisnika da pristupi stranici kada nije prijavljen
export const isAuthenticated = async (req, res, next) => {
  try {
    //?uzimanje i provera tokena
    if (!req.cookies.token) {
      return res.status(403).json({ message: "Korisnik nije prijavljen" });
    }

    const token = req.cookies.token;

    //?potvrda(verifikacija)tokena
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    //?provera da li korisnik postoji
    const user = await Korisnik.findByPk(decodedToken.idKorisnik);
    /*  console.log(user); */
    if (!user) return res.status(401).json({ message: "korisnik ne postoji" });

    //?postavljanje korisnika u request
    req.korisnik = {
      email: user.email,
      role: user.role,
    };

    //? provera da li je korisnik promenio lozinku nakon sto je jwt izdat
    //!DA PROVERIMO DATUM UPDATE SA TRENUTNIM

    next();
  } catch (error) {
    res.status(500).json({
      message:
        "Isteklo je vreme sesije, molimo da se prijavite ponovo na sistem.",
    });
  }
};
