import { useState } from "react";
import KorisnikApi from "../../api/korisnikApi";

const KorisnikLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  console.log(data);

  const editKorisnik = (data) => {
    KorisnikApi()
      .editKorisnik(
        data.idKorisnik,
        data.korisnickoIme,
        data.ime,
        data.prezime,
        data.brojTelefona,
        data.email,
        data.role
      )
      .then((response) => {
        alert("radi");
        window.history.back();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { changeHandler, editKorisnik, setData };
};

export default KorisnikLogic;
