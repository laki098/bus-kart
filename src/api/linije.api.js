import axios from "axios";
import apiUrl from "../apiConfig";

const LinijeApi = () => {
  const getLinije = async () => {
    return await fetch(`${apiUrl}/linija`);
  };
  const upisLinije = async (
    pocetnaStanica,
    medjustanice,
    krajnjaStanica,
    vremePolaska,
    vremeDolaska,
    datumPolaska,
    datumDolaska,
    oznakaBusa,
    kola
  ) => {
    return await axios.post(`${apiUrl}/linija`, {
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      oznakaBusa,
      kola,
    });
  };

  const filterLinija = async (
    nazivPocetneStanice,
    nazivKrajnjeStanice,
    datumPolaska
  ) => {
    return await fetch(`${apiUrl}/linija/filterLinija`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //filter radi po mestu polaska, mestu dolaska i datumu polaska
        nazivPocetneStanice, //
        nazivKrajnjeStanice, //
        datumPolaska, //
      }),
    });
  };

  const filterLinijaId = async (
    nazivPocetneStanice,
    nazivKrajnjeStanice,
    datumPolaska,
    id
  ) => {
    return await fetch(`${apiUrl}/linija/filterLinijaId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //filter radi po mestu polaska, mestu dolaska i datumu polaska
        nazivPocetneStanice, //
        nazivKrajnjeStanice, //
        datumPolaska,
        id, //
      }),
    });
  };

  const filterLinijaID = async (id) => {
    return await axios.get(`${apiUrl}/linija/${id}`, {});
  };

  const brisanjeLinije = async (idLinije) => {
    return await axios.delete(`${apiUrl}/linija/${idLinije}`, {}); //brisanje radi po id-u
  };

  const editLinije = async (
    id,
    pocetnaStanica,
    medjustanice,
    krajnjaStanica,
    vremePolaska,
    vremeDolaska,
    datumPolaska,
    datumDolaska,
    oznakaBusa,
    pocetakRute,
    krajRute,
    vozac,
    stjuardesa,
    kola
  ) => {
    return await axios.put(`${apiUrl}/linija/${id}`, {
      //edituje sve inpute, po prosledjenom id-u, bas za tu linuju(id)
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      oznakaBusa,
      pocetakRute,
      krajRute,
      vozac,
      stjuardesa,
      kola,
    });
  };

  return {
    filterLinija,
    upisLinije,
    getLinije,
    brisanjeLinije,
    editLinije,
    filterLinijaID,
    filterLinijaId,
  };
};

export default LinijeApi;
