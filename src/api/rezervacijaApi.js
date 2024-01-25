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
    oznakaSedista,
    tipKarte              //dodala
  ) => {
    console.log(tipKarte)
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
      tipKarte         //dodala
    });
  };
  const rezervacijaPovratna = async (
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
    tipKarte         //dodala
  ) => {
    console.log(
      "--------------222------",
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
      tipKarte           //dodala
    );
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
      tipKarte           //dodala
    });
  };

  return { rezervacija, rezervacijaPovratna };
};

export default RezervacijaApi;
