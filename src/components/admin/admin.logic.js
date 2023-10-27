import { useState } from "react";
import LinijeApi from "../../api/linije.api";
import { toast } from "react-toastify";

const AdminLogic = () => {
  let [data, setData] = useState({ medjustanice: [] });

  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const handlerMedjustanice = (e, index) => {
    const { name, value } = e.target;
    const novaMedjustanica = [...data.medjustanice];
    novaMedjustanica[index][name] = value;
    setData({
      ...data,
      medjustanice: novaMedjustanica,
    });
  };

  const dodajMedjustanicu = () => {
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

  const raspakovanaMedjustanica = data.medjustanice.map((item) => {
    return {
      stanica: item.stanica,
      vremePolaskaM: item.vremePolaskaM,
      vremeDolaskaM: item.vremeDolaskaM,
      datumPolaskaM: item.datumPolaskaM,
      datumDolaskaM: item.datumDolaskaM,
    };
  });
  console.log(raspakovanaMedjustanica);

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
        console.log(response);
        notifySuccest(); // Prikazuje notifikaciju o uspešnom pravljenju linije
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editLinije = (data, id) => {
    LinijeApi()
      .editLinije(
        id,
        data.pocetnaStanica,
        data.medjustanice,
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
        notifySuccest(); // Prikazuje notifikaciju o uspešnom editovanju linije
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const notifySuccest = () => {
    toast.success("Uspešno!", {
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
  };
};

export default AdminLogic;
