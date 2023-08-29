import { useState } from "react";
import BusApi from "../../api/bus.api";

const BusLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  console.log(data);

  const upisBus = async () => {
    BusApi()
      .upisBus(data.oznakaBusa, data.tablice, data.brojSedista)
      .then((response) => {
        alert("Konacccno");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editBus = (data) => {
    BusApi()
      .editBus(data.idAutobusa, data.oznakaBusa, data.tablice, data.brojSedista)
      .then((response) => {
        alert("Konacccno");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { changeHandler, setData, upisBus, editBus };
};

export default BusLogic;
