import axios from "axios";
import apiUrl from "../apiConfig";

const BusApi = () => {
  const upisBus = async (oznakaBusa, tablice, brojSedista) => {
    return await axios.post(`${apiUrl}/autobusi`, {
      oznakaBusa: oznakaBusa,
      tablice: tablice,
      brojSedista: brojSedista,
    });
  };

  const filterBusId = async (idAutobusa) => {
    return await axios.get(`${apiUrl}/autobusi/${idAutobusa}`, {});
  };

  const brisanjeBus = async (idAutobusa) => {
    return await axios.delete(`${apiUrl}/autobusi/${idAutobusa}`, {}); //brisanje radi po id-u
  };

  const editBus = async (idAutobusa, oznakaBusa, tablice, brojSedista) => {
    return await axios.put(`${apiUrl}/autobusi/${idAutobusa}`, {
      //edituje sve inpute, po prosledjenom id-u, bas za tu linuju(id)
      idAutobusa: idAutobusa,
      oznakaBusa: oznakaBusa,
      tablice: tablice,
      brojSedista: brojSedista,
    });
  };

  return {
    upisBus,
    brisanjeBus,
    editBus,
    filterBusId,
  };
};

export default BusApi;
