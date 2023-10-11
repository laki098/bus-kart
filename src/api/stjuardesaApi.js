import axios from "axios";

const StjuardesaApi = () => {
  const promenaVremena = async (
    linijaId,
    redosled,
    promeniPocetakRute,
    promeniKrajRute
  ) => {
    return await axios.put("http://localhost:5000/stjuardesa/promenaVremena", {
      linijaId,
      redosled,
      promeniPocetakRute,
      promeniKrajRute,
    });
  };
  const promenaVremenaLinija = async (
    linijaId,
    promeniPocetakRute,
    promeniKrajRute
  ) => {
    console.log(linijaId, promeniPocetakRute, promeniKrajRute);
    return await axios.put(
      "http://localhost:5000/stjuardesa/promenaVremenaLinija",
      {
        linijaId,
        promeniPocetakRute,
        promeniKrajRute,
      }
    );
  };
  return { promenaVremena, promenaVremenaLinija };
};
export default StjuardesaApi;
