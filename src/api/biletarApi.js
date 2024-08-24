import axios from "axios";
import apiUrl from "../apiConfig";

const BiletarApi = () => {
  const filterLinija = async (
    nazivPocetneStanice,
    nazivKrajnjeStanice,
    datumPolaska,
    vremePolaska
  ) => {
    try {
      const response = await fetch(`${apiUrl}/biletar/filterLinija`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nazivPocetneStanice,
          nazivKrajnjeStanice,
          datumPolaska,
          vremePolaska,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Proveravamo da li rezultat niz ima elemenata
      if (data.rezultat && data.rezultat.length === 0) {
        console.log("Ne postoje linije za zadate parametre.");
      } else {
        console.log("Rezultat:", data.rezultat);
      }

      return data;
    } catch (error) {
      console.error("Greška prilikom filtriranja linija:", error);
      throw error;
    }
  };

  const rezervacijaBiletar = async (
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
    email,
    imeIprezime,
    brojTelefona
  ) => {
    return await axios.post(`${apiUrl}/biletar/rezervacija`, {
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
      email,
      imeIprezime,
      brojTelefona,
    });
  };

  return {
    filterLinija,
    rezervacijaBiletar,
  };
};

export default BiletarApi;
