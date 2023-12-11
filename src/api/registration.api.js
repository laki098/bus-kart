import axios from "axios";
import apiUrl from "../apiConfig";

const RegistracijaApi = () => {
  const getKorisnik = async () => {
    return await fetch(`${apiUrl}/korisnik`);
  };
  const registracija = async (
    korisnickoIme,
    lozinka,
    ime,
    prezime,
    email,
    brojTelefona
  ) => {
    return await axios.post(`${apiUrl}/korisnik/registration`, {
      korisnickoIme: korisnickoIme,
      lozinka: lozinka,
      ime: ime,
      prezime: prezime,
      email: email,
      brojTelefona: brojTelefona,
    });
  };
  return { getKorisnik, registracija };
};

export default RegistracijaApi;
