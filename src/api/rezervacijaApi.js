import axios from "axios";
import apiUrl from "../apiConfig";

const RezervacijaApi = () => {
  const rezervacija = async (
    brojMesta,
    polaznaStanicaR,
    krajnjaStanicaR,
    datumPolaska,
    datumDolaska,
    vremePolaska,
    vremeDolaska,
    linijaId,
    pocetnaStanicaId,
    krajnjaStanicaId,
    korisnikId,
    osvezenje,
    oznakaSedista
  ) => {
    return await axios.post(`${apiUrl}/linija/rezervacija`, {
      brojMesta,
      polaznaStanicaR,
      krajnjaStanicaR,
      datumPolaska,
      datumDolaska,
      vremePolaska,
      vremeDolaska,
      linijaId,
      pocetnaStanicaId,
      krajnjaStanicaId,
      korisnikId,
      osvezenje,
      oznakaSedista,
    });
  };

  return { rezervacija };
};

export default RezervacijaApi;
