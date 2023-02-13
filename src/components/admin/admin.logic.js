import { useState } from "react";
import LinijeApi from "../../api/linije.api";

const AdminLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const upisLinije = () => {
    LinijeApi().upisLinije(
      data.mestoPolaska,
      data.mestoDolaska,
      data.datumPolaska,
      data.datumDolaska,
      data.vremePolaska,
      data.vremeDolaska,
      data.prevoznik
    )
      .then((response) => {
        console.log(response);
        alert("Konacccno");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const brisanjeLinije = (id) => {
    console.log(id)
    LinijeApi().brisanjeLinije(
      id
      
    )
    .then((response) => {
      console.log(response);
      alert("Konacccno");
    })
    .catch((error) => {
      console.log(error);
    });
  }
  return { changeHandler, setData, upisLinije,brisanjeLinije };
};

export default AdminLogic;
