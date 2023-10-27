import { useState } from "react";
import StaniceApi from "../../../api/stanice.api";

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
        alert("Konacno");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editStanice = (data) => {
    StaniceApi()
      .editStanice(data.id, data.naziv, data.adresa)
      .then((response) => {
        alert("Konacno");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { changeHandler, setData, upisStanice, editStanice };
};

export default StaniceLogic;
