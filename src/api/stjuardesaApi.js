import axios from "axios";
import apiUrl from "../apiConfig";

const StjuardesaApi = () => {
  const promenaVremena = async (
    linijaId,
    redosled,
    promeniPocetakRute,
    promeniKrajRute
  ) => {
    return await axios.put(`${apiUrl}/stjuardesa/promenaVremena`, {
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
    return await axios.put(`${apiUrl}/stjuardesa/promenaVremenaLinija`, {
      linijaId,
      promeniPocetakRute,
      promeniKrajRute,
    });
  };
  return { promenaVremena, promenaVremenaLinija };
};
export default StjuardesaApi;
