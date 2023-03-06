import { useState } from "react";
import LinijeApi from "../../api/linije.api";

const AdminLogic = () => {
  let [data, setData] = useState({});

  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const upisLinije = async () => {
    LinijeApi()
      .upisLinije(
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

  const editLinije = (data) => {
    LinijeApi()
      .editLinije(
        data.id,
        data.mestoPolaska,
        data.mestoDolaska,
        data.vremePolaska,
        data.vremeDolaska,
        data.prevoznik,
        data.datumPolaska,
        data.datumDolaska
      )
      .then((response) => {
        console.log(response);
        alert("Konacccno");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const brisanjeLinije = async (id) => {
    console.log("id", id);
    return await LinijeApi().brisanjeLinije(id);
    // .then((response) => {
    //   console.log(response);
    //   return response
    //   alert("Konacccno");
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };
  return { changeHandler, setData, upisLinije, brisanjeLinije, editLinije };
};

export default AdminLogic;
