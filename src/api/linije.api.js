import axios from "axios";

const LinijeApi = () => {
  const getLinije = async () => {
    return await fetch("http://localhost:5000/linije");
  };
  const upisLinije = async (
    mestoPolaska,
    mestoDolaska,
    datumPolaska,
    datumDolaska,
    vremePolaska,
    vremeDolaska,
    prevoznik
  ) => {
    console.log({
      mestoPolaska: mestoPolaska,
      mestoDolaska: mestoDolaska,
      datumPolaska: datumPolaska,
      datumDolaska: datumDolaska,
      vremePolaska: vremePolaska,
      vremeDolaska: vremeDolaska,
      prevoznik: prevoznik,
    });
    return await axios.post("http://localhost:5000/linije/linijeNov", {
      mestoPolaska: mestoPolaska,
      mestoDolaska: mestoDolaska,
      datumPolaska: datumPolaska,
      datumDolaska: datumDolaska,
      vremePolaska: vremePolaska,
      vremeDolaska: vremeDolaska,
      prevoznik: prevoznik,
    });
  };

  const filterLinija = async (mestoPolaska, mestoDolaska, datumPolaska) => {
    // return await axios.get("http://localhost:5000/linije/filterLinija", {
    //     mestoPolaska:mestoPolaska, mestoDolaska:mestoDolaska, datumPolaska:datumPolaska
    // })
    return await fetch("http://localhost:5000/linije/filterLinija", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //filter radi po mestu polaska, mestu dolaska i datumu polaska
        mestoPolaska: mestoPolaska, //
        mestoDolaska: mestoDolaska, //
        datumPolaska: datumPolaska, //
      }),
    });
  };
  const filterLinijaID = async (id) => {
    return await axios.get(
      `http://localhost:5000/linije/filterLinijaID/${id}`,
      {}
    );
  };

  const brisanjeLinije = async (id) => {
    return await axios.post(`http://localhost:5000/linije/delete/${id}`, {}); //brisanje radi po id-u
  };

  const editLinije = async (
    id,
    mestoPolaska,
    mestoDolaska,
    vremePolaska,
    vremeDolaska,
    prevoznik,
    datumPolaska,
    datumDolaska
  ) => {
    return await axios.post(`http://localhost:5000/linije/update/${id}`, {
      //edituje sve inpute, po prosledjenom id-u, bas za tu linuju(id)
      mestoPolaska: mestoPolaska,
      mestoDolaska: mestoDolaska,
      vremePolaska: vremePolaska,
      vremeDolaska: vremeDolaska,
      prevoznik: prevoznik,
      datumPolaska: datumPolaska,
      datumDolaska: datumDolaska,
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
