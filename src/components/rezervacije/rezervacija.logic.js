import { useState } from "react";
import COHelpers from "../../helpers/helpers";

const RezervacijaLogic = () => {
  let [data, setData] = useState({});
  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const formValidation = (ime, mesto, mestoD, datum, datumD, vreme, vremeD,  email, telefon) => {
    const validName = COHelpers.isStringNotEmpty(ime.current.value);
    const validMesto = COHelpers.isStringNotEmpty(mesto.current.value);
    const validMestoD = COHelpers.isStringNotEmpty(mestoD.current.value);
    const validDatum = COHelpers.isStringNotEmpty(datum.current.value);
    const validDatumD = COHelpers.isStringNotEmpty(datumD.current.value);
    const validVreme = COHelpers.isStringNotEmpty(vreme.current.value);
    const validVremeD = COHelpers.isStringNotEmpty(vremeD.current.value);
    const validEmail = COHelpers.isStringNotEmpty(email.current.value);
    const validTelefon = COHelpers.isStringNotEmpty(telefon.current.value);

    const isFormValid = validName && validMesto;
    return {
      isFormValid,
      validName,
      validMesto,
      validMestoD,
      validDatum,
      validDatumD,
      validVreme,
      validVremeD,
      validEmail,
      validTelefon,
    };
  };

  return {
    changeHandler,
    setData,
    formValidation,
  };
};

export default RezervacijaLogic;
