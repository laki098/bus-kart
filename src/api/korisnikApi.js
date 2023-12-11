import axios from "axios";
import apiUrl from "../apiConfig";

const KorisnikApi = () => {
  const filterKorisnikId = async (idKorisnik) => {
    return await axios.get(`${apiUrl}/korisnik/${idKorisnik}`, {});
  };

  const brisanjeKorisnika = async (idKorisnik) => {
    return await axios.delete(`${apiUrl}/korisnik/${idKorisnik}`);
  };

  const editKorisnik = async (
    idKorisnik,
    korisnickoIme,
    ime,
    prezime,
    brojTelefona,
    email,
    role,
    vremeTrajanjaRole,
    privremenaRola
  ) => {
    return await axios.put(
      `${apiUrl}/korisnik/${idKorisnik}`,
      {
        idKorisnik,
        korisnickoIme,
        ime,
        prezime,
        brojTelefona,
        email,
        role,
        vremeTrajanjaRole,
        privremenaRola,
      },
      {
        withCredentials: true,
      }
    );
  };

  return { filterKorisnikId, brisanjeKorisnika, editKorisnik };
};

export default KorisnikApi;
