import axios from "axios";

const StaniceApi = () => {
  const upisStanice = async (naziv, adresa) => {
    console.log({
      naziv: naziv,
      adresa: adresa,
    });
    return await axios.post(
      "http://localhost:5000/stanica",
      {
        naziv: naziv,
        adresa: adresa,
      },
      {
        withCredentials: true, //! potrebno je da bi dobili token ili ga prosledili na backend
      }
    );
  };

  const filterStaniceId = async (id) => {
    return await axios.get(`http://localhost:5000/stanica/${id}`, {});
  };

  const brisanjeStanice = async (id) => {
    return await axios.delete(`http://localhost:5000/stanica/${id}`, {});
  };

  const editStanice = async (id, naziv, adresa) => {
    console.log(id, naziv, adresa);
    return await axios.put(`http://localhost:5000/stanica/${id}`, {
      naziv: naziv,
      adresa: adresa,
    });
  };

  return {
    upisStanice,
    brisanjeStanice,
    editStanice,
    filterStaniceId,
  };
};

export default StaniceApi;
