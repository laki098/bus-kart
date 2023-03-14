import { useState } from "react";
import BusApi from "../../api/bus.api";


const BusLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const upisBus = async () => {
    BusApi()
      .upisBus(data.tablica, data.brojMesta)
      .then((response) => {
        console.log(response);
        alert("Konacccno");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editBus = (data) => {
    BusApi()
      .editBus(data.id, data.tablica, data.brojMesta)
      .then((response) => {
        console.log(response);
        alert("Konacccno");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { changeHandler, setData, upisBus, editBus };
};

export default BusLogic;
