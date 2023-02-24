import React, { useState } from "react";
import DatePicker from "react-datepicker";
import AdminLogic from "./admin.logic";

const LineForm = ({ mode, id }) => {
  const adminLogic = AdminLogic();
  const [endDate, setEndDate] = useState(new Date());

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
        className="inputText"
        type="time"
        required
        name="vremeDolaska"
        onChange={adminLogic.changeHandler}
      ></input>
      <br />
      <label>Prevoznik</label>
      <br />
      <select name="prevoznik" onChange={adminLogic.changeHandler}>
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
