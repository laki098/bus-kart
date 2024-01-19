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
        if (response.status === 201) {
        notifySuccest(response.data.message);
        setTimeout(() => {
          window.location.href = "/bus.initial";
        }, 2000);
      }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editBus = (data) => {
    BusApi()
      .editBus(data.idAutobusa, data.oznakaBusa, data.tablice, data.brojSedista)
      .then((response) => {
        if (response.status === 200) {
          notifySuccest(response.data.message);
          setTimeout(() => {
            window.location.href = "/bus.initial";
          }, 2000);
        } if (response.status === 400) {
          notifyWarn(data.message);
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
  }

  return { changeHandler, setData, upisBus, editBus };
};

export default BusLogic;
