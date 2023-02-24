import { useState, useRef } from "react";
import { toast } from "react-toastify";
import RegistracijaApi from "../../api/registration.api";
import COHelpers from "../../helpers/helpers";

const RezervacijaLogic = () => {
  let [data, setData] = useState({});
  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const registracija = () => {
    RegistracijaApi()
      .registracija(
        data.ime,
        data.pol_stan,
        data.vremePol,
        data.datum,
        data.email,
        data.brtel
      )
      .then((rasponse) => {
        console.log(rasponse);
        notifySuccest();
      })
      .catch((error) => {
        console.log(error);
        /* / alert("korisnicko ime isto") /; */
        notifyWarn();
      });
  };

  const notifySuccest = () => {
    toast.success(" Uspešno ste se registrovali!", {
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

  const notifyWarn = () => {
    toast.warn(" Korisničko ime je zauzeto!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const formValidation = (ime, pol_stan, vremePol, datum, email, brtel) => {
    const validIme = COHelpers.isStringNotEmpty(ime.current.value);
    const validPol_stan = COHelpers.validEmail(pol_stan.current.value);
    const validVremePol = COHelpers.isStringNotEmpty(vremePol.current.value);
    const validDatum = COHelpers.isStringNotEmpty(datum.current.value);
    const validEmail = COHelpers.isStringNotEmpty(email.current.value);
    const validBrtel = COHelpers.isStringNotEmpty(brtel.current.value);

    const isFormValid =
      validIme &&
      validPol_stan &&
      validVremePol &&
      validDatum &&
      validEmail &&
      validBrtel;
    return {
      isFormValid,
      validIme,
      validPol_stan,
      validVremePol,
      validDatum,
      validEmail,
      validBrtel,
    };
  };

  return {
    changeHandler,
    setData,
    registracija,
    formValidation,
  };
};

export default RezervacijaLogic;
