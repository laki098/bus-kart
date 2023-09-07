import React, { useState, useEffect } from "react";
import AdminLogic from "./admin.logic";
import LinijeApi from "../../api/linije.api";

import "../login/loginStyle.css"; /* preuzimam stil od login/login.component.js */

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import helpers from "../../helpers/helpers";

const LineForm = ({ mode, id }) => {
  const [linija, setLinija] = useState({});
  const adminLogic = AdminLogic();
  const [stanice, setStanice] = useState([]);

  const [waypoints, setWaypoints] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [cene, setCene] = useState([]);
  const [autobusi, setAutobusi] = useState([]);

  const getAutobusi = async () => {
    const response = await fetch("http://localhost:5000/autobusi");
    const data = await response.json();
    const autobusi = data.autobusi.map((item) => {
      return { oznakaBusa: item.oznakaBusa };
    });
    setAutobusi(autobusi);
  };

  const getStanice = async () => {
    const response = await fetch("http://localhost:5000/stanica");
    const data = await response.json();
    const stanica = data.stanice.map((item) => {
      return { naziv: item.naziv };
    });
    const filterStanica = stanica
      .map((item) => item.naziv)
      .filter(helpers.filterUnique);
    setStanice(filterStanica);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
    setSelectedValues([...selectedValues, ""]);
    setCene([...cene, ""]);
  };

  const handleSelectChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
  };
  const handleCenaChange = (event, index) => {
    const newCene = [...cene];
    newCene[index] = event.target.value;
    setCene(newCene);
  };

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
    getStanice();
    getAutobusi();
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

  //prevodjenje start
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <div className="pozadina">
      <header>
        <div style={{ textAlign: "right", marginRight: "3rem" }}>
          {Object.keys(lngs).map((lng) => (
            <button
              key={lng}
              style={{
                fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
              }}
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
      </header>

      <div className="main">
        <div className=" sub-main">
          <form onSubmit={submitHandler}>
            {mode === "add" ? (
              <p className="naslov" style={{ fontSize: "1.5rem" }}>
                <Trans i18nKey="description.part130">Nova linija</Trans>
              </p>
            ) : (
              <h2>Edituj Liniju</h2>
            )}{" "}
            {/* bilo je h2 a ne <>  */}
            <br />
            <div className="labela">
              <label>
                <Trans i18nKey="description.part3">Mesto polaska</Trans>
              </label>
              <br />
              <input
                defaultValue={linija.mestoPolaska}
                type="text"
                placeholder="Mesto polaska"
                required
                name="mestoPolaska"
                className="name1 input-new"
                style={{ fontSize: "1rem", color: "darkblue" }}
                onChange={adminLogic.changeHandler}
              />
              <br />
              {waypoints.map((waypoint, index) => (
                <div key={index}>
                  <label>Usputna stanica {index + 1}</label>
                  <br />
                  <select
                    value={selectedValues[index]}
                    onChange={(event) => handleSelectChange(event, index)}
                  >
                    {stanice.map((stanica) => {
                      return (
                        <option key={stanica} value={stanica}>
                          {stanica}
                        </option>
                      );
                    })}
                  </select>
                  <label>Cena</label>

                  <input
                    type="number"
                    value={cene[index]}
                    onChange={(event) => handleCenaChange(event, index)}
                  />
                  <br />
                </div>
              ))}
              <button type="button" onClick={addWaypoint}>
                Dodaj usputnu stanicu
              </button>{" "}
              <br />
              <label>
                <Trans i18nKey="description.part5">Mesto dolaska</Trans>
              </label>
              <br />
              <input
                defaultValue={linija.mestoDolaska}
                type="text"
                name="mestoDolaska"
                placeholder="Mesto dolaska"
                className="name1 input-new"
                style={{ fontSize: "1rem", color: "darkblue" }}
                required
                onChange={adminLogic.changeHandler}
              />
              <br />
              <label>
                <Trans i18nKey="description.part7">Datum polaska</Trans>
              </label>
              <br />
              <input
                defaultValue={linija.datumPolaska}
                name="datumPolaska"
                type="date"
                className="name1 input-new"
                style={{ fontSize: "1rem" }}
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
              <label>
                <Trans i18nKey="description.part9">Datum dolaska</Trans>
              </label>
              <br />
              <input
                defaultValue={linija.datumDolaska}
                name="datumDolaska"
                type="date"
                className="name1 input-new"
                style={{ fontSize: "1rem" }}
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
              <label>
                <Trans i18nKey="description.part11">Vreme polaska</Trans>
              </label>
              <br />
              <input
                defaultValue={linija.vremePolaska}
                className="inputText name1 input-new"
                type="time"
                required
                label="Time"
                name="vremePolaska"
                style={{ fontSize: "1rem" }}
                onChange={adminLogic.changeHandler}
              ></input>
              <br />
              <label>
                <Trans i18nKey="description.part13">vreme dolaska</Trans>
              </label>
              <br />
              <input
                defaultValue={linija.vremeDolaska}
                className="inputText name1 input-new"
                type="time"
                required
                name="vremeDolaska"
                style={{ fontSize: "1rem" }}
                onChange={adminLogic.changeHandler}
              ></input>
              <br />
              <label>
                <Trans i18nKey="description.part131">Prevoznik</Trans>
              </label>
              <br />
              <select
                value={linija.prevoznik}
                name="prevoznik"
                className="name1 input-new"
                style={{ fontSize: "1rem" }}
                onChange={adminLogic.changeHandler}
              >
                <option disabled={false} value="">
                  --
                  <Trans i18nKey="description.part132">
                    Izaberite prevoznika
                  </Trans>
                  --
                </option>
                <option>Eurocompass</option>
              </select>
              <br />
              <label>Izaberite autobus</label>
              <br />
              <select>
                {autobusi.map((autobusi) => {
                  return (
                    <option
                      key={autobusi.oznakaBusa}
                      value={autobusi.oznakaBusa}
                    >
                      {autobusi.oznakaBusa}
                    </option>
                  );
                })}
              </select>
              <br />
              <br />
              <button type="submit" className="button">
                {mode === "add" ? (
                  <Trans i18nKey="description.part128">"Dodaj"</Trans>
                ) : (
                  "Sačuvaj"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LineForm;
