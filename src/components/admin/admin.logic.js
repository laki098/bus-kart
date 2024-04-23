import { useState } from "react";
import LinijeApi from "../../api/linije.api";
import { toast } from "react-toastify";

const AdminLogic = () => {
  let [data, setData] = useState({
    medjustanice: [],
    datumPolaska: [],
    datumDolaska: [],
    vremePolaska: "", // Dodajemo vreme polaska i dolaska
    vremeDolaska: "",
  });


  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const handlerMedjustanice = (e, index) => {
    const { name, value } = e.target;
    const novaMedjustanica = [...data.medjustanice];
    console.log(novaMedjustanica);

    //? Proširenje niza do odgovarajuće dužine
    while (novaMedjustanica.length <= index) {
      novaMedjustanica.push({});
    }

    //? Postavljanje novih vrednosti na odgovarajućim pozicijama u nizu
    novaMedjustanica[index] = {
      ...novaMedjustanica[index],
      [name]: value,
      redosled: index + 1,
    };
    setData({
      ...data,
      medjustanice: novaMedjustanica,
    });
  };

  const handlerDatumPolaska = (e) =>
    setData({
      ...data,
      datumPolaska: [e.target.value, ...data.datumPolaska],
    });

  const handlerDatumDolaska = (e) =>
    setData({
      ...data,
      datumDolaska: [e.target.value, ...data.datumDolaska],
    });

  const dodajMedjustanicu = () => {
    console.log(data);
    setData({
      ...data,
      medjustanice: [...data.medjustanice, {}],
    });
  };

  const ukloniMedjustanicu = (index) => {
    const novaMedjustanica = [...data.medjustanice];
    novaMedjustanica.splice(index, 1);
    setData({
      ...data,
      medjustanice: novaMedjustanica,
    });
  };

  const raspakovanaMedjustanicaEdit = data.medjustanice.map((item) => {
    return {
      redosled: item.redosled,
      stanica: item.stanica,
      vremePolaskaM: item.vremePolaskaM,
      vremeDolaskaM: item.vremeDolaskaM,
      datumPolaskaM: item.datumPolaskaM,
      datumDolaskaM: item.datumDolaskaM,
    };
  });

  const raspakovanaMedjustanica = data.medjustanice.map((item) => {
    return {
      stanica: item.stanica,
      vremePolaskaM: item.vremePolaskaM,
      vremeDolaskaM: item.vremeDolaskaM,
      datumPolaskaM: item.datumPolaskaM,
      datumDolaskaM: item.datumDolaskaM,
    };
  });

  const vremePolaskaMValues = raspakovanaMedjustanica.map(item => item.vremePolaskaM);
  const vremeDolaskaMValues = raspakovanaMedjustanica.map(item => item.vremeDolaskaM);

/* console.log(vremePolaskaMValues); // Ispisuje vrednosti vremePolaskaM
console.log(vremeDolaskaMValues); */

  const upisLinije = async () => {
    LinijeApi()
      .upisLinije(
        data.pocetnaStanica,
        raspakovanaMedjustanica,
        data.krajnjaStanica,
        data.vremePolaska,
        data.vremeDolaska,
        data.datumPolaska,
        data.datumDolaska,
        data.oznakaBusa
      )
      .then((response) => {
        if (response.status === 201) {
          notifySuccest(response.data.message);
          setTimeout(() => {
            window.location.href = "/admin.initial";
          }, 2000); // Prikazuje notifikaciju o uspešnom pravljenju linije
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 500) {
          notifyWarn(error.response.data.message);
        }
      });
  };

  const editLinije = (data, id) => {
    console.log(data);
    LinijeApi()
      .editLinije(
        id,
        data.pocetnaStanica,
        raspakovanaMedjustanicaEdit,
        data.krajnjaStanica,
        data.vremePolaska,
        data.vremeDolaska,
        data.datumPolaska,
        data.datumDolaska,
        data.oznakaBusa,
        data.pocetakRute,
        data.krajRute,
        data.vozac,
        data.stjuardesa
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          notifySuccest(response.data.message);
          setTimeout(() => {
            window.location.href = "/admin.initial";
          }, 2000); // Prikazuje notifikaciju o uspešnom pravljenju linije
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const notifySuccest = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const notifyWarn = (message) => {
    toast.warn(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const brisanjeLinije = async (id) => {
    console.log("id", id);
    return await LinijeApi().brisanjeLinije(id);
    // .then((response) => {
    //   console.log(response);
    //   return response
    //   alert("Konacccno");
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };
  return {
    changeHandler,
    setData,
    upisLinije,
    brisanjeLinije,
    editLinije,
    handlerMedjustanice,
    dodajMedjustanicu,
    ukloniMedjustanicu,
    handlerDatumPolaska,
    handlerDatumDolaska,
  };
};

export default AdminLogic;
