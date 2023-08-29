import axios from "axios";

const BusApi = () => {
  const upisBus = async (oznakaBusa, tablice, brojSedista) => {
    console.log({
      oznakaBusa: oznakaBusa,
      tablice: tablice,
      brojSedista: brojSedista,
    });
    return await axios.post("http://localhost:5000/autobusi", {
      oznakaBusa: oznakaBusa,
      tablice: tablice,
      brojSedista: brojSedista,
    });
  };

  const filterBusId = async (idAutobusa) => {
    return await axios.get(`http://localhost:5000/autobusi/${idAutobusa}`, {});
  };

  const brisanjeBus = async (idAutobusa) => {
    return await axios.delete(
      `http://localhost:5000/autobusi/${idAutobusa}`,
      {}
    ); //brisanje radi po id-u
  };

  const editBus = async (idAutobusa, oznakaBusa, tablice, brojSedista) => {
    return await axios.put(`http://localhost:5000/autobusi/${idAutobusa}`, {
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
