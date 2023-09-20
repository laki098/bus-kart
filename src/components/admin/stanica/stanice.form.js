import React, { useState, useEffect } from "react";
import StaniceLogic from "./stanice.logic";
import StaniceApi from "../../../api/stanice.api";

const StaniceForm = ({ mode, id }) => {
  const [stanice, setStanice] = useState({});
  const staniceLogic = StaniceLogic();

  const izmeniStanice = async () => {
    try {
      const response = await StaniceApi().filterStaniceId(id);
      const data = response.data;

      setStanice(data.stanica);
    } catch (error) {
      console.error("Greška prilikom izmene stanica:", error);
    }
  };

  useEffect(() => {
    if (mode == "edit") {
      izmeniStanice();
    }
  }, []);

  const back = () => {
    window.history.back();
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      staniceLogic.upisStanice();
    } else if (mode === "edit") {
      const formData = new FormData(event.target);
      const data = {
        id,
        naziv: formData.get("naziv"),
        adresa: formData.get("adresa"),
      };

      staniceLogic.editStanice(data);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        {mode === "add" ? <p>Nova stanica</p> : <p>Izmena Stanica</p>}
        <label>Naziv</label>
        <input
          defaultValue={stanice.naziv}
          type="text"
          name="naziv"
          onChange={staniceLogic.changeHandler}
        ></input>
        <label>Adresa</label>
        <input
          defaultValue={stanice.adresa}
          type="text"
          name="adresa"
          onChange={staniceLogic.changeHandler}
        ></input>
        <button type="submit">
          {mode === "add" ? <>Dodaj</> : <>Izmeni</>}
        </button>
      </div>
    </form>
  );
};

export default StaniceForm;
