import React, { useState } from "react";
import DatePicker from "react-datepicker";
import AdminLogic from "./admin.logic";

const AdminComponent = () => {
  /* const [startDate, setStartDate] = useState(new Date()); */
  const [endDate, setEndDate] = useState(new Date());
  const adminLogic = AdminLogic();

  return (
    <div>
      <h2>Nova linija</h2>
      
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

        <button onClick={adminLogic.upisLinije}>Dodaj</button>
        
    </div>
  );
};

export default AdminComponent;
