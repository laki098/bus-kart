import React, { useEffect, useState } from "react";
import LinijeApi from "../../api/linije.api";
import AdminLogic from "./admin.logic";
import { Link } from 'react-router-dom';

const AdminInitial = () => {
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [val1, setVal1] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [val2, setVal2] = useState("");
  const [linije, setLinije] = useState([]);

  const filterLinija = async () => {
    if (!valueDate) return;

    const response = await LinijeApi().filterLinija(val1, val2, valueDate);
    const data = await response.json();
    setFilteredLinije(data);
  };
  const getLinije = async () => {
    const response = await fetch("http://localhost:5000/linije/linija");
    const data = await response.json();
    setLinije(data);
    setVal1(data[0].mestoPolaska);
    setVal2(data[0].mestoDolaska);
  };

  useEffect(() => {
    getLinije();
  }, []);

  const adminLogic = AdminLogic()

  return (
    <div>
      <p>Mesto polaska:</p>
      <select
        className=""
        value={val1}
        onChange={(e) => setVal1(e.target.value)}
      >
        {linije.map((linija) => {
          return (
            <option key={linija.id} value={linija.mestoPolaska}>
              {linija.mestoPolaska}
            </option>
          );
        })}
      </select>
      <p>Mesto Dolaska:</p>
      <select
        className=""
        value={val2}
        onChange={(e) => setVal2(e.target.value)}
      >
        {linije.map((linija) => {
          return (
            <option key={linija.id} value={linija.mestoDolaska}>
              {linija.mestoDolaska}
            </option>
          );
        })}
      </select>
      <label>Datum polaska</label>
      <input
        type="date"
        value={valueDate}
        onChange={(e) => setValueDate(e.target.value)}
      />
      <button onClick={filterLinija}>Red voznje</button>
      <button><Link to ='/admin.component'>Dodaj</Link></button>
      
      <div>
        <ul>
            {filteredLinije.map(linija => {
                return <li key={linija.id}>
                    vreme polaska: {linija.vremePolaska},
              vreme dolaska: {linija.vremeDolaska},
              prevoznik: {linija.prevoznik},
              mesto polaska: {linija.mestoPolaska},
              mesto dolaska: {linija.mestoDolaska}
              <button><Link to = '/admin.change.line'>zameni</Link></button>
              <button onClick={() => adminLogic.brisanjeLinije(linija.id)}>obrisi</button>
              
              
                </li>
            })}
        </ul>
      </div>
      
    </div>
  );
};

export default AdminInitial;
