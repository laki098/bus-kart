import { useState } from "react";
import StaniceApi from "../../../api/stanice.api";
import { toast } from "react-toastify";
const StaniceLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const upisStanice = async () => {
    StaniceApi()
      .upisStanice(data.naziv, data.adresa)
      .then((response) => {
        if (response.status === 201) {
        notifySuccest(response.data.message);
        setTimeout(() => {
          window.location.href = "/stanice.initial";
        }, 2000); // Prikazuje notifikacije
      }})
      .catch((error) => {
        console.log(error);
      });
  };

  const editStanice = (data) => {
    StaniceApi()
      .editStanice(data.id, data.naziv, data.adresa)
      .then((response) => {
        if (response.status === 200) {
        notifySuccest(response.data.message);
        setTimeout(() => {
          window.location.href = "/stanice.initial";
        }, 2000); // Prikazuje notifikacije
      } if (response.status === 404) {
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

  return { changeHandler, setData, upisStanice, editStanice };
};

export default StaniceLogic;
