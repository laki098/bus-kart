import axios from "axios";

const KorisnikApi = () => {
  const filterKorisnikId = async (idKorisnik) => {
    return await axios.get(`http://localhost:5000/korisnik/${idKorisnik}`, {});
  };

  const brisanjeKorisnika = async (idKorisnik) => {
    return await axios.delete(`http://localhost:5000/korisnik/${idKorisnik}`);
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
      `http://localhost:5000/korisnik/${idKorisnik}`,
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
