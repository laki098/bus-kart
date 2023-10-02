import axios from "axios";

const LinijeApi = () => {
  const getLinije = async () => {
    return await fetch("http://localhost:5000/linija");
  };
  const upisLinije = async (
    pocetnaStanica,
    medjustanice,
    krajnjaStanica,
    vremePolaska,
    vremeDolaska,
    datumPolaska,
    datumDolaska,
    oznakaBusa
  ) => {
    console.log({
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      oznakaBusa,
    });
    return await axios.post("http://localhost:5000/linija", {
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska,
      datumDolaska,
      oznakaBusa,
    });
  };

  const filterLinija = async (
    nazivPocetneStanice,
    nazivKrajnjeStanice,
    datumPolaska
  ) => {
    // return await axios.get("http://localhost:5000/linije/filterLinija", {
    //     mestoPolaska:mestoPolaska, mestoDolaska:mestoDolaska, datumPolaska:datumPolaska
    // })
    return await fetch("http://localhost:5000/linija/filterLinija", {
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
  const filterLinijaID = async (id) => {
    return await axios.get(`http://localhost:5000/linija/${id}`, {});
  };

  const brisanjeLinije = async (idLinije) => {
    console.log(idLinije);
    return await axios.delete(`http://localhost:5000/linija/${idLinije}`, {}); //brisanje radi po id-u
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
    stjuardesa
  ) => {
    console.log(
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
      stjuardesa
    );
    return await axios.put(`http://localhost:5000/linija/${id}`, {
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
    });
  };

  return {
    filterLinija,
    upisLinije,
    getLinije,
    brisanjeLinije,
    editLinije,
    filterLinijaID,
  };
};

export default LinijeApi;
