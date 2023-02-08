import React, { useState } from "react";
import DatePicker from "react-datepicker";
import AdminLogic from "./admin.logic";

const AdminComponent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  /* const [startTime, setStartTime] = useState('') */
  const adminLogic = AdminLogic()

  return (
    <div>
      <h2>Nova linija</h2>
      <form>
        <label>Mesto polaska</label>
        <br />
        <input
          name="mestoPolaska"
          type="text"
          placeholder="Mesto polaska"
          required
          onChange={adminLogic.changeHandler}
        />
        <br />
        <label>Mesto dolaska</label>
        <br />
        <input
          name="mestoDolaska"
          type="text"
          placeholder="Mesto dolaska"
          required
          onChange={adminLogic.changeHandler}
        />
        <br />

        <label>Datum polaska</label>
        <DatePicker
          className="inputText"
          value={startDate}
          name="datumPolaska"
          showYearDropdown
          required
          placeholderText="Datum polaska"
          scrollableMonthYearDropdownv
          onChange={(date) => setStartDate(date)}
        />
        <label>Datum dolaska</label>
        <DatePicker
          className="inputText"
          value={endDate}
          name="datumDolaska"
          showYearDropdown/* 
          placeholderText="Datum dolaska" */
          required
          scrollableMonthYearDropdownv
           onChange1={(date) => setEndDate(date)}
        />
        <br />
        <label>Vreme polaska</label>
        <br />
        <input className="inputText"  name="vremePolaska" type="time" required label="Time"></input>
        <br />
        <label>Vreme dolaska</label>
        <br />
        <input className="inputText" name="vremeDolaska" type="time" required></input>
        <br />
        <label>Prevoznik</label>
        <br />
        <select>
          <option name="prevoznik" value="">Eurocompass</option>
        </select>
        <br />

        <button>Dodaj</button>
      </form>
    </div>
  );
};

export default AdminComponent;
