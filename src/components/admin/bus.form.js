import React, { useState, useEffect } from "react";
import BusLogic from "./bus.logic";
import BusApi from "../../api/bus.api";

const BusForm = ({ mode, id }) => {
  const [bus, setBus] = useState({});
  const busLogic = BusLogic();

  const izmeinAutobus = async () => {
    const response = await BusApi().filterBusId(id);
    const data = await response.data;

    setBus(data);
  };

  console.log(bus);
  useEffect(() => {
    if (mode == "edit") {
      izmeinAutobus();
    }
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      busLogic.upisBus();
    } else if (mode === "edit") {
      const formData = new FormData(event.target);
      const data = {
        id: id,
        tablica: formData.get("tablica"),
        brojMesta: formData.get("brojMesta"),
      };

      busLogic.editBus(data);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      {mode === "add" ? <h2>Novi Bus</h2> : <h2>Edituj Bus</h2>}

      <label>Tablica</label>
      <br />
      <input
        /* defaultValue={bus.tablica} */
        type="text"
        placeholder="tablica"
        required
        name="tablica"
        onChange={busLogic.changeHandler}
      />
      <br />
      <label>Broj mesta</label>
      <br />
      <input
        /* defaultValue={bus.mestoDolaska} */
        type="text"
        name="brojMesta"
        placeholder="Broj mesta"
        required
        onChange={busLogic.changeHandler}
      />
      <br />

      <button type="submit">{mode === "add" ? "Dodaj" : "Sacuvaj"}</button>
    </form>
  );
};

export default BusForm;
