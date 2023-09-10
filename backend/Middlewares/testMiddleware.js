import Korisnik from "../Models/KorisnikModels.js";
import { checkToken } from "../helpers/authHelpers.js";

export const testMiddleware = (req, res, next) => {
  req.korisnik = "admin";

  if (req.korisnik !== "admin") {
    return res.status(403).send("Korisnik nije admin");
  }

  next();
};

//?Sprecavanje korisnika da pristupi stranici kada nije prijavljen
export const isAuthenticated = async (req, res, next) => {
  try {
    let token;
    //?uzimanje i provera tokena
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token)
      return next(
        new AppError(
          "Niste prijavljeni! Molimo prijavite se da biste dobili pristup",
          401
        )
      );
    //?potvrda(verifikacija)tokena
    const decodedToken = await checkToken(token);

    //?provera da li korisnik postoji
    const user = await Korisnik.findOne(decodedToken.idKorinika);
    /*  console.log(user); */
    if (!user) return next(new AppError("Nosilac ovog tokena ne postoji", 401));

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
