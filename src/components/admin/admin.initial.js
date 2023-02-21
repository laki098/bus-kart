import React, { useEffect, useState } from "react";
import LinijeApi from "../../api/linije.api";
import AdminLogic from "./admin.logic";
import { Link } from 'react-router-dom';
import "./admin.css";

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

  const [showClass, setShowClass] = useState(false);

  const changer = () => {
    setShowClass(!showClass);
  };

  const clickButton = (event) => {
    filterLinija();
    changer();
  }

  return (
    <div>
      <div className="home">
      <div className="prvi">
      <label>Mesto polaska:</label>
      <select
        className="position"
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
      </div>
      <div className="prvi">
      <label>Mesto Dolaska:</label>
      <select
        className="position"
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
      </div>
      <div className="prvi">
      <label>Datum polaska</label>
      <input
        type="date"
        className="position"
        value={valueDate}
        onChange={(e) => setValueDate(e.target.value)}
      />
      </div>
      <button className="button-admin" onClick={clickButton}>Red voznje</button>
      <Link to ='/admin.component'><button className="button-admin">Dododavanje linije </button></Link>
      </div>
      <div>
        <ul>
        <div className={`home1 .home1 ${showClass ? "show" : ""}`}>
          <style>{`
            .home1 {
              display: none;
            }
            .show {
              display: block;
            }
          `}</style>
            {filteredLinije.map(linija => {
                return <li key={linija.id}>
                    <div className="home-show">
                    vreme polaska: {linija.vremePolaska},
              vreme dolaska: {linija.vremeDolaska},
              prevoznik: {linija.prevoznik},
              mesto polaska: {linija.mestoPolaska},
              mesto dolaska: {linija.mestoDolaska}
              <button >zameni</button>
              <button onClick={() => adminLogic.brisanjeLinije(linija.id)}>obrisi</button>
              
              
                </li>
            })}
            </div>
        </ul>
      </div>
      
    </div>
  );
};

export default AdminInitial;
