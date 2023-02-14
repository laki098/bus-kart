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
        mestoPolaska: mestoPolaska,
        mestoDolaska: mestoDolaska,
        datumPolaska: datumPolaska,
      }),
    });
  };
  const brisanjeLinije = async (id) => {
    console.log(id);
    return await axios.post(`http://localhost:5000/linije/delete/${id}`, {
    });
  };

  return { filterLinija, upisLinije, getLinije, brisanjeLinije };
};

export default LinijeApi;