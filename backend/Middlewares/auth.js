const Korisnik = require("../Models/KorisnikModels.js");
const { checkToken } = require("../helpers/authHelpers.js");
const jwt = require("jsonwebtoken");

// Sprecavanje pristupa endpointu ako korisnik nema određenu ulogu
exports.isAuthorized = (role) => {
  return (req, res, next) => {
    const korisnik = req.korisnik;

    if (!role.includes(korisnik.role)) {
      return res.status(403).json({ message: "Nemate dozvolu za pristup" });
    }

    next();
  };
};

// Sprecavanje korisnika da pristupi stranici kada nije prijavljen
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Uzimanje i provera tokena
    if (!req.cookies.token) {
      return res.status(403).json({ message: "Korisnik nije prijavljen" });
    }

    const token = req.cookies.token;

    // Potvrda (verifikacija) tokena
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Provera da li korisnik postoji
    const user = await Korisnik.findByPk(decodedToken.idKorisnik);

    if (!user) return res.status(401).json({ message: "Korisnik ne postoji" });

    // Postavljanje korisnika u zahtev (request)
    req.korisnik = {
      email: user.email,
      role: user.role,
    };

    // Provera da li je korisnik promenio lozinku nakon što je JWT izdat
    //! DA PROVERIMO DATUM UPDATE SA TRENUTNIM

    next();
  } catch (error) {
    res.status(500).json({
      message:
        "Isteklo je vreme sesije, molimo da se prijavite ponovo na sistem.",
    });
  }
};
