import axios from "axios";

const RezervacijaApi = () => {
  const rezervacija = async (
    brojMesta,
    linijaId,
    pocetnaStanicaId,
    krajnjaStanicaId
  ) => {
    console.log(brojMesta, linijaId, pocetnaStanicaId, krajnjaStanicaId);
    return await axios.post("http://localhost:5000/linija/rezervacija", {
      brojMesta,
      linijaId,
      pocetnaStanicaId,
      krajnjaStanicaId,
    });
  };
  return { rezervacija };
};

export default RezervacijaApi;
