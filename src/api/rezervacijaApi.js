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
    tipKarte,
    email //dodala
  ) => {
    console.log(tipKarte);
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
      tipKarte,
      email, //dodala
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
    tipKarte,
    email //dodala
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
      tipKarte,
      email //dodala
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
      tipKarte,
      email, //dodala
    });
  };

  const rezervacijaPovratnaIzmena = async (
    brojMesta,
    polaznaStanicaR,
    krajnjaStanicaR,
    datumPolaska,
    datumDolaska,
    vremePolaska,
    vremeDolaska,
    povIspravkaIdLinija,      //linijaId,
    pocetnaStanicaId,
    krajnjaStanicaId,
    korisnikId,
    osvezenje,
    oznakaSedista,
    tipKarte,
    email, //dodala
    //rezervacijaId,    // dodala
  ) => {
    console.log(
      "--------------!!!!------",
      brojMesta,
      polaznaStanicaR,
      krajnjaStanicaR,
      datumPolaska,
      datumDolaska,
      vremePolaska,
      vremeDolaska,
      povIspravkaIdLinija,      //linijaId,
      pocetnaStanicaId,
      krajnjaStanicaId,
      korisnikId,
      osvezenje,
      oznakaSedista,
      tipKarte,
      email, //dodala
      //rezervacijaId,
    );
    /* bilo je dole post      */
    /* return await axios.put(`${apiUrl}/linija/rezervacija/${rezervacijaId}`, */
    // dole je pisalo linijaId

    const url = `${apiUrl}/linija/rezervacija/${povIspravkaIdLinija}`; // Dinamički generirajte URL s ID-om rezervacije
    const url1  = `${apiUrl}/linija/rezervacija`;
    return await axios.patch(url, {
      brojMesta,
      polaznaStanicaR,
      krajnjaStanicaR,
      datumPolaska,
      datumDolaska,
      vremePolaska,
      vremeDolaska,
      povIspravkaIdLinija,      //linijaId,
      pocetnaStanicaId,
      krajnjaStanicaId,
      korisnikId,
      osvezenje,
      oznakaSedista,
      tipKarte,
      email, //dodala
      //rezervacijaId,
    });
  };

  const pre_rezervacija = async (
    brojMesta,
    polaznaStanicaR,
    krajnjaStanicaR,
    datumPolaska,
    datumDolaska,
    vremePolaska,
    vremeDolaska,
    linijaId,       //povIspravkaIdLinija,
    pocetnaStanicaId,
    krajnjaStanicaId,
    korisnikId,
    osvezenje,
    oznakaSedista,
    tipKarte,
    email //dodala
  ) => {
    console.log('PreRezervacija');
    return await axios.post(`${apiUrl}/linija/rezervacija`, {
      //axios.post(`${apiUrl}/linija/rezervacija`, {
      //axios.put(`${apiUrl}/linija/rezervacija/${linijaId}`, {
      brojMesta,
      polaznaStanicaR,
      krajnjaStanicaR,
      datumPolaska,
      datumDolaska,
      vremePolaska,
      vremeDolaska,
      linijaId,       //povIspravkaIdLinija, 
      pocetnaStanicaId,
      krajnjaStanicaId,
      korisnikId,
      osvezenje,
      oznakaSedista,
      tipKarte,
      email, //dodala
    });
  };

  return { rezervacija, rezervacijaPovratna, rezervacijaPovratnaIzmena, pre_rezervacija };
};

export default RezervacijaApi;
