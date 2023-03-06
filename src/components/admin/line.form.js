import React, { useState, useEffect } from "react";
import AdminLogic from "./admin.logic";
import LinijeApi from "../../api/linije.api";

const LineForm = ({ mode, id }) => {
  const [linija, setLinija] = useState({});
  const adminLogic = AdminLogic();

  const izmeniLiniju = async () => {
    const response = await LinijeApi().filterLinijaID(id); // Filter linije za bas taj id koji cemo da menjamo
    // if (response.error) {
    //   setError(response.error);
    //   return;
    // }
    const data = await response.data; // kako bi dobili vrednosti koje cemo koristiti za popuvanjavanje input polja
    let polazak = data.datumPolaska.split(",");
    let dolazak = data.datumDolaska.split(",");
    const linija = {
      ...data,
      datumPolaska: new Date(+polazak[0], +polazak[1] - 1, +polazak[2] + 1)
        .toISOString()
        .substr(0, 10),
      datumDolaska: new Date(+dolazak[0], +dolazak[1] - 1, +dolazak[2] + 1) //+ prebacuje u int iz stringa
        .toISOString()
        .substr(0, 10),
    };
    setLinija(linija);
  };

  useEffect(() => {
    if (mode === "edit") {
      izmeniLiniju();
    }
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      adminLogic.upisLinije();
    } else if (mode === "edit") {
      const formData = new FormData(event.target); //pravi objekat koji sadrzi sva imena inputa(zato sto submit ima sve vrednosti)
      const data = {
        id: id,
        mestoPolaska: formData.get("mestoPolaska"),
        mestoDolaska: formData.get("mestoDolaska"),
        vremePolaska: formData.get("vremePolaska"),
        vremeDolaska: formData.get("vremeDolaska"),
        prevoznik: formData.get("prevoznik"),
        datumPolaska: formData.get("datumPolaska"),
        datumDolaska: formData.get("datumDolaska"),
      };

      adminLogic.editLinije(data);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      {mode === "add" ? <h2>Nova linija</h2> : <h2>Edituj Liniju</h2>}

      <label>Mesto polaska</label>
      <br />
      <input
        defaultValue={linija.mestoPolaska}
        type="text"
        placeholder="Mesto polaska"
        required
        name="mestoPolaska"
        onChange={adminLogic.changeHandler}
      />
      <br />
      <label>Mesto dolaska</label>
      <br />
      <input
        defaultValue={linija.mestoDolaska}
        type="text"
        name="mestoDolaska"
        placeholder="Mesto dolaska"
        required
        onChange={adminLogic.changeHandler}
      />
      <br />

      <label>Datum polaska</label>
      <br />
      <input
        defaultValue={linija.datumPolaska}
        name="datumPolaska"
        type="date"
        onChange={adminLogic.changeHandler}
      />
      <br />
      {/* <DatePicker className="inputText"
                 selected={startDate}
                  value={startDate}
                  required
                  scrollableMonthYearDropdownv 
                  placeholderText="Datum dolaska"
                   onChange={(date) => 
                    setStartDate(date)
                            } />   */}
      <label>Datum dolaska</label>
      <br />
      <input
        defaultValue={linija.datumDolaska}
        name="datumDolaska"
        type="date"
        onChange={adminLogic.changeHandler}
      />
      <br />
      {/* <DatePicker className="inputText"
                 selected={endDate}
                  value={endDate}
                  required
                  scrollableMonthYearDropdownv 
                  placeholderText="Datum dolaska"
                   onChange={(date) =>   
                            setEndDate(date)} /> */}
      <label>Vreme polaska</label>
      <br />
      <input
        defaultValue={linija.vremePolaska}
        className="inputText"
        type="time"
        required
        label="Time"
        name="vremePolaska"
        onChange={adminLogic.changeHandler}
      ></input>
      <br />
      <label>Vreme dolaska</label>
      <br />
      <input
        defaultValue={linija.vremeDolaska}
        className="inputText"
        type="time"
        required
        name="vremeDolaska"
        onChange={adminLogic.changeHandler}
      ></input>
      <br />
      <label>Prevoznik</label>
      <br />
      <select
        value={linija.prevoznik}
        name="prevoznik"
        onChange={adminLogic.changeHandler}
      >
        <option disabled={false} value="">
          --Izaberi prevoznika--
        </option>
        <option>Eurocompass</option>
      </select>
      <br />

      <button type="submit">{mode === "add" ? "Dodaj" : "Sacuvaj"}</button>
    </form>
  );
};

export default LineForm;
