import { useState } from "react";
import StaniceApi from "./stanice.initial";

const StaniceLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  console.log(data);

  const upisStanice = async () => {
    StaniceApi()
      .upisStanice(data.naziv, data.adresa)
      .then((response) => {
        alert("Konacno");
      })
      .catch((error) => {
        console.log(error, "--------------------------------");
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      });
  };

  const editStanice = (data) => {
    StaniceApi()
      .editStanice(data.naziv, data.adresa)
      .then((response) => {
        alert("Konacno");
      })
      .catch((error) => {
        console.log(error);
        console.log(
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        );
      });
  };

  return { changeHandler, setData, upisStanice, editStanice };
};

export default StaniceLogic;
