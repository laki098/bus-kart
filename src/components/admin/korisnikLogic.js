import { useState } from "react";
import KorisnikApi from "../../api/korisnikApi";
import { toast } from "react-toastify";


const KorisnikLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const editKorisnik = (data) => {
    KorisnikApi()
      .editKorisnik(
        data.idKorisnik,
        data.korisnickoIme,
        data.ime,
        data.prezime,
        data.brojTelefona,
        data.email,
        data.role,
        data.vremeTrajanjaRole,
        data.privremenaRola
      )
      .then((response) => {
        if (response.status === 200) {
          notifySuccest(response.data.message); // Ako je status 200, prikaži uspešnu poruku
          setTimeout(() => {
            window.location.href = "/korisniciInitial";
          }, 2000);
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

  return { changeHandler, editKorisnik, setData };
};

export default KorisnikLogic;
