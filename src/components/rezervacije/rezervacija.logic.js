import { useState } from "react";
import COHelpers from "../../helpers/helpers";

const RezervacijaLogic = () => {
  let [data, setData] = useState({});
  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const formValidation = (ime, mesto, vreme, datum, email, telefon) => {
    const validName = COHelpers.isStringNotEmpty(ime.current.value);
    const validMesto = COHelpers.isStringNotEmpty(mesto.current.value);

    const isFormValid = validName && validMesto;
    return {
      isFormValid,
      validName,
      validMesto,
    };
  };

  return {
    changeHandler,
    setData,
    formValidation,
  };
};

export default RezervacijaLogic;
