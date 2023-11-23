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
            notifySuccest(); // Prikazuje notifikacije
          })
        .catch((error) => {
            console.log(error);
        });
    };

    const editCene = (data) => {
        CeneApi()
        .editCene(data.pocetnaStanica, data.krajnjaStanicaR, data.cenaKarte)
        .then((response) => {
            notifySuccest(); // Prikazuje notifikacije
          }).catch((error) => {
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

  return {changeHandler, setData, upisCene, editCene};
};

export default CeneLogic;