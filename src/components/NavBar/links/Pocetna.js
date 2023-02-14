import React, { useState, useEffect } from "react";
import LinijeApi from "../../../api/linije.api";
import "./pocetna.css";
import helpers from "../../../helpers/helpers";

const Pocetna = () => {
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [valueDate, setValueDate] = useState("");
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [polasci, setPolasci] = useState([]);
  const [dolasci, setDolasci] = useState([]);
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
    const mestaPolaska = data
      .map((item) => item.mestoPolaska)
      .filter(helpers.filterUnique);
    const mestaDolaska = data
      .map((item) => item.mestoDolaska)
      .filter(helpers.filterUnique);

    setLinije(data);
    setPolasci(mestaPolaska);
    setDolasci(mestaDolaska);
    setVal1(data[0].mestoPolaska);
    setVal2(data[0].mestoDolaska);
  };

  useEffect(() => {
    getLinije();
  }, []);

  const click = () => {
    //ovde mozes upit da napravis da li se val 1 sadrzi u dolasci
    // i da li se val 2 sadrzi u polasci
    // primer polasci.includes(val2)

    if (!polasci.includes(val2) || !dolasci.includes(val1)) {
      return;
    }
    setVal1(val2);
    setVal2(val1);
  };

  const [showClass, setShowClass] = useState(false);

  const changer = () => {
    setShowClass(!showClass);
  };

  const clickBait = (event) => {
    filterLinija();
    changer();
  };


  let showDate = new Date();
  let displayTodaysDate = showDate.getDate() + '/' + (showDate.getMonth() + 1) + '/' + showDate.getFullYear;

  return (
    <div>
      <div className="home-page">
        <h2 className="h2-card">
          <i className="fa fa-bus"></i>
          <span className="span">Pronadjite liniju</span>
        </h2>
        <div className="travel-look">
          <div className="form">
            <label>Polazna stanica</label>
            <select
              className=" box-title"
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
            >
              {polasci.map((linija) => {
                return (
                  <option key={linija} value={linija}>
                    {linija}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form">
            <button
              className="fa-solid fa-repeat buttonSwitch "
              onClick={click}
            ></button>
          </div>
          <div className="form">
            <label>Dolazna stanica</label>
            <select
              className="box-title"
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
            >
              {dolasci.map((linija) => {
                return (
                  <option key={linija} value={linija}>
                    {linija}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form">
            <label>Datum polaska</label>
            <div className="input-date">
              <input
                type="date"
                className="dates"
                value={valueDate}
                onChange={(e) => setValueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-button">
            <button onClick={clickBait} className="buttonSwitch">
              Red voznje
            </button>
          </div>
        </div>
      </div>

      <ul>
        <div className={`home-page1 .home-page1 ${showClass ? "show" : ""}`}>
          <style>{`
            .home-page1 {
              display: none;
            }
            .show {
              display: block;
            }
          `}</style>
          <h2 className="card-header">
            <i className="fa-solid fa-bus"></i>
            <span className="span">Red voznje</span>
          </h2>
          {filteredLinije.map((linija) => {
            return (
              <li key={linija.id}>
                <div className="travel">
                  prevoznik: {linija.prevoznik},vreme polaska:{" "}
                  {linija.vremePolaska}, vreme dolaska: {linija.vremeDolaska},
                  mesto polaska: {linija.mestoPolaska}, mesto dolaska:{" "}
                  {linija.mestoDolaska}
                  <button className="buttonSwitch1">Rezervisi</button>
                </div>
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default Pocetna;
