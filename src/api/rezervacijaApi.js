import axios from "axios";

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
    console.log(
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
    );
    return await axios.post("http://localhost:5000/linija/rezervacija", {
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
    });
  };
  return { rezervacija };
};

export default RezervacijaApi;
