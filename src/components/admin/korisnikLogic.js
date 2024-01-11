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
        notifySuccest();
        setTimeout(() => {
          window.location.href = "/korisniciInitial";
        }, 2000); // Prikazuje notifikaciju o uspešnoj promeni
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const notifySuccest = () => {
    toast.success("Uspešno ste promenili podatak!", {
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

  return { changeHandler, editKorisnik, setData };
};

export default KorisnikLogic;
