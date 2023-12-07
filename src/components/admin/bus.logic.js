import { useState } from "react";
import BusApi from "../../api/bus.api";
import { toast } from "react-toastify";

const BusLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  

  const upisBus = async () => {
    BusApi()
      .upisBus(data.oznakaBusa, data.tablice, data.brojSedista)
      .then((response) => {
        notifySuccest();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editBus = (data) => {
    BusApi()
      .editBus(data.idAutobusa, data.oznakaBusa, data.tablice, data.brojSedista)
      .then((response) => {
        notifySuccest();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const notifySuccest = () => {
    toast.success("Uspešno", {
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

  return { changeHandler, setData, upisBus, editBus };
};

export default BusLogic;
