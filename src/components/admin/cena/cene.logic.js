import { useState } from "react";
import CeneApi from "../../../api/cene.api";
import { toast } from "react-toastify";

const CeneLogic = () => {
    let[data, setData] = useState({});

    const changeHandler = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };


    const upisCene = async () => {
        CeneApi()
        .upisCene(data.pocetnaStanica, data.krajnjaStanicaR, data.cenaKarte)
        .then((response) => {
          if (response.status === 201) {
            notifySuccest(response.data.message);
            setTimeout(() => {
              window.location.href = "/cene.initial";
            }, 2000);
          } // Prikazuje notifikacije
          })
        .catch((error) => {
            console.log(error);
        });
    };

    const editCene = (data) => {
        CeneApi()
        .editCene(data.id,data.pocetnaStanica, data.krajnjaStanicaR, data.cenaKarte)
        .then((response) => {
          if (response.status === 200) {
            notifySuccest(response.data.message);
            setTimeout(() => {
              window.location.href = "/cene.initial";
            }, 2000);
          } if (response.status === 404) {
            notifyWarn(data.message);
          }
          }).catch((error) => {
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

  return {changeHandler, setData, upisCene, editCene};
};

export default CeneLogic;