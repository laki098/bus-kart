import axios from "axios";
import apiUrl from "../apiConfig";

const CeneApi = () => {
  const upisCene = async (pocetnaStanica, krajnjaStanicaR, cenaKarte) => {
    console.log({
      pocetnaStanica: pocetnaStanica,
      krajnjaStanicaR: krajnjaStanicaR,
      cenaKarte: cenaKarte,
    });
    return await axios.post(`${apiUrl}/cena`, {
      pocetnaStanica: pocetnaStanica,
      krajnjaStanicaR: krajnjaStanicaR,
      cenaKarte: cenaKarte,
    });
  };

  const filterCeneId = async (id) => {
    return await axios.get(`${apiUrl}/cena/${id}`, {});
  };

  const brisanjeCene = async (id) => {
    return await axios.delete(`${apiUrl}/cena/${id}`, {});
  };

  const editCene = async (id, pocetnaStanica, krajnjaStanicaR, cenaKarte) => {
    console.log(id, pocetnaStanica, krajnjaStanicaR, cenaKarte);
    return await axios.put(`${apiUrl}/cena/${id}`, {
      pocetnaStanica: pocetnaStanica,
      krajnjaStanicaR: krajnjaStanicaR,
      cenaKarte: cenaKarte,
    });
  };

  return {
    upisCene,
    filterCeneId,
    brisanjeCene,
    editCene,
  };
};

export default CeneApi;
