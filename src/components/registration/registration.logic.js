import { useState} from "react";
import { toast } from "react-toastify";
import RegistracijaApi from "../../api/registration.api";
import COHelpers from "../../helpers/helpers";

const RegistrationLogic = () => {
  let [data, setData] = useState({});
  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    const registracija = () => {
      RegistracijaApi()
        .registracija(
          data.korisnickoIme,
          data.lozinka,
          data.ime,
          data.prezime,
          data.email,
          data.brojTelefona
        )
        .then((response) => {
          if (response.status === 201) {
            console.log(response);
            notifySuccest(response.data.message);
            setTimeout(() => {
              window.location.href = "/pocetna";
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 400) {
            notifyWarn(error.response.data.message);
          }
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
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const formValidation = (
    ime,
    prezime,
    email,
    korisnickoIme,
    lozinka,
    brojTelefona
  ) => {
    const validName = COHelpers.isStringNotEmpty(ime.current.value);
    const validPrezime = COHelpers.isStringNotEmpty(prezime.current.value);
    const validEmail = COHelpers.validEmail(email.current.value);
    const validKorisnickoIme = COHelpers.isStringNotEmpty(
      korisnickoIme.current.value
    );
    const validLozinka = COHelpers.passwordValidation(lozinka.current.value);
    const validPhone = COHelpers.isStringNotEmpty(brojTelefona.current.value);

    const isFormValid =
      validName &&
      validPrezime &&
      validEmail &&
      validKorisnickoIme &&
      validLozinka &&
      validPhone;
    return {
      isFormValid,
      validName,
      validPrezime,
      validEmail,
      validKorisnickoIme,
      validLozinka,
      validPhone,
    };
  };

  return {
    changeHandler,
    setData,
    registracija,
    formValidation,
  };
};

export default RegistrationLogic;
