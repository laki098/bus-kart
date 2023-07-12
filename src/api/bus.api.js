import axios from "axios";

const BusApi = () => {
  /* const getBus = async () => {
    return await axios.get("http://localhost:5000/autobusi/autobusi");
  }; */
  const upisBus = async (tablica, brojMesta) => {
    console.log({
      tablica: tablica,
      brojMesta: brojMesta,
    });
    return await axios.post("http://localhost:5000/autobusi/autobusiNov", {
      tablica: tablica,
      brojMesta: brojMesta,
    });
  };

  /* const filterBus = async (tablica, brojMesta) => {
    // return await axios.get("http://localhost:5000/linije/filterLinija", {
    //     mestoPolaska:mestoPolaska, mestoDolaska:mestoDolaska, datumPolaska:datumPolaska
    // })
    return await fetch("http://localhost:5000/autobusi/filterAutobusi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //filter radi po mestu polaska, mestu dolaska i datumu polaska
        tablica: tablica, //
        brojMesta: brojMesta, 
      }),
    });
  };*/
  const filterBusId = async (id) => {
    return await axios.get(`http://localhost:5000/autobusi/filterID/${id}`, {});
  };

  /* const brisanjeBus = async (id) => {
    return await axios.post(`http://localhost:5000/autobusi/delete/${id}`, {}); //brisanje radi po id-u
  };

  const editBus = async (
    id,
    tablica,
    brojMesta,
  ) => {
    return await axios.post(`http://localhost:5000/autobusi/update/${id}`, {
      //edituje sve inpute, po prosledjenom id-u, bas za tu linuju(id)
      tablica: tablica,
      brojMesta: brojMesta,
    });
  }; */

  return {
    /* filterBus, */
    upisBus,
    /* brisanjeBus,
    editBus,*/
    filterBusId,
  };
};

export default BusApi;
