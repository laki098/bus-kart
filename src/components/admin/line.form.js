import React, { useState, useEffect } from "react";
import AdminLogic from "./admin.logic";
import LinijeApi from "../../api/linije.api";

import "../login/loginStyle.css"; /* preuzimam stil od login/login.component.js */

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import helpers from "../../helpers/helpers";

const LineForm = ({ mode, id, state }) => {
  const [linija, setLinija] = useState({});
  const adminLogic = AdminLogic();
  const [stanice, setStanice] = useState([]);

  

  const [waypoints, setWaypoints] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [cene, setCene] = useState([]);
  const [autobusi, setAutobusi] = useState([]);
  const [vozac, setVozac] = useState([]);
  const [stjuardesa,setStjuardesa] = useState([]);

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
  

  const getKorisnici = async () => {    // izdvaja sve korisnike i ovde se radi filter za rolu koja nama treba 
    const response = await fetch("http://localhost:5000/korisnik");
    const data = await response.json();
    const korisnici = data.korisnici;
  
    const vozaci = korisnici.filter((korisnik) => korisnik.role === "vozac");
    const stjuardesa = korisnici.filter((korisnik) => korisnik.role === "stjuardesa");
  
    setVozac(vozaci);
    setStjuardesa(stjuardesa);
  };
  console.log(vozac)
  
  
  
  

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
    setSelectedValues([...selectedValues, ""]);
    setCene([...cene, ""]);
  };

  const duploDugmeMedjustanica = () => {
    addWaypoint();
    adminLogic.dodajMedjustanicu();
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
  
  /* const izmeniLiniju = async () => {
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
  }; */

  useEffect(() => {
    getStanice();
    getAutobusi();
    getKorisnici()
    if (mode === "edit") {
      /* izmeniLiniju(); */
    }
  }, []);

  const medjustanice = []

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      adminLogic.upisLinije();
    } else if (mode === "edit") {
      const formData = new FormData(event.target); //pravi objekat koji sadrzi sva imena inputa(zato sto submit ima sve vrednosti)
      const data = {
        pocetnaStanica: formData.get("pocetnaStanica"),
        medjustanice: medjustanice,
        krajnjaStanica: formData.get("krajnjaStanica"),
        vremePolaska: formData.get("vremePolaska"),
        vremeDolaska: formData.get("vremeDolaska"),
        datumPolaska: formData.get("datumPolaska"),
        datumDolaska: formData.get("datumDolaska"),
        oznakaBusa: formData.get("oznakaBusa"),
        vozac:formData.get("vozac"),
        stjuardesa:formData.get("stjuardesa")

      };

      adminLogic.editLinije(data, id);
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
    <div >                              {/* className="pozadina"        */}
      <header>
        <div className="jezici">
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

      {/*<div className="red-1"></div>    */}
      <div >                                         {/* className="main"          */}
        <div className="tabela-stanica">             {/*  className=" sub-main"    */}
          <form onSubmit={submitHandler}>
            {mode === "add" ? (
              <div>
                <p className="naslovStanica" >        {/* style={{ fontSize: "1.5rem" }} */}
                  <Trans i18nKey="description.part130">Nova linija</Trans>
                </p>
                <div >
                  <div><label className="labela-stanica">
                    <Trans i18nKey="description.part3">Mesto polaska</Trans>
                  </label></div>
                  
                  {/* className="name1 input-new"
                    style={{ fontSize: "1rem", color: "darkblue" }}  */}
                  <div><input
                    defaultValue={linija.pocetnaStanica}
                    type="text"
                    placeholder="Mesto polaska"
                    required
                    name="pocetnaStanica"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  /></div>
                  <div className="red-05"></div>
                  <div >       {/* className="ograda-medjustanice" */}
                  {waypoints.map((waypoint, index) => (
                    <div key={index}>
                      <div className="red-1">
                      <div className="red-05"><hr/></div>
                        <label className="labela-stanica">
                        <strong>Usputna stanica {index + 1}</strong>
                      </label></div>
                      
                      <select
                        name="stanica"
                        /* value={medjustanica.stanica} */
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      >
                        {stanice.map((stanica) => {
                          return (
                            <option key={stanica} value={stanica}>
                              {stanica}
                            </option>
                          );
                        })}
                      </select>
                      <label className="labela-stanica">Cena</label>

                      <div className="red-05"><label className="labela-stanica">
                        <Trans i18nKey="description.part150">{/* bilo je vreme polaska  */}
                          Vreme odlaska (polaska)
                        </Trans>
                      </label></div>
                      {/* className="inputText name1 input-new"
                       style={{ fontSize: "1rem" }}   */}
                      <input
                        /* defaultValue={linija.vremePolaska} */
                        className="input-stanica"
                        type="time"
                        required
                        label="Time"
                        name="vremePolaskaM"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      ></input>
                      <div className="red-05"><label className="labela-stanica">
                        <Trans i18nKey="description.part13">
                          Vreme dolaska
                        </Trans>
                      </label></div>

                      <input
                        /* defaultValue={linija.vremePolaska} */
                        className="input-stanica"
                        type="time"
                        required
                        label="Time"
                        name="vremeDolaskaM"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      ></input>
                      <div className="red-05"><label className="labela-stanica">
                        <Trans i18nKey="description.part7">Datum polaska</Trans>
                      </label></div>

                      <input
                        /*  defaultValue={linija.datumPolaska} */
                        name="datumPolaskaM"
                        type="date"
                        className="input-stanica"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />
                      <div className="red-05"><label className="labela-stanica">
                        <Trans i18nKey="description.part9">Datum dolaska</Trans>
                      </label></div>

                      <input
                        /*  defaultValue={linija.datumPolaska} */
                        name="datumDolaskaM"
                        type="date"
                        className="input-stanica"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />
                    </div>
                    
                  ))}
                  </div>
                  <div className="red-05">
                  <button type="button" className="buttonSwitch korekcijaDugmeta" 
                  onClick={duploDugmeMedjustanica}>
                  <Trans i18nKey="description.part151">Dodaj usputnu stanicu  </Trans>
                  </button>
                  </div>
                  {/*<br />*/}
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                  </label></div>

                  <input
                    defaultValue={linija.krajnjaStanica}
                    type="text"
                    name="krajnjaStanica"
                    placeholder="Mesto dolaska"
                    className="input-stanica"
                    required
                    onChange={adminLogic.changeHandler}
                  />
                  {/*<br />*/}
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part7">Datum polaska</Trans>
                  </label></div>

                  <input
                    defaultValue={linija.datumPolaska}
                    name="datumPolaska"
                    type="date"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  />
                  {/*<br />*/}
                  {/* <DatePicker className="inputText"
                 selected={startDate}
                  value={startDate}
                  required
                  scrollableMonthYearDropdownv 
                  placeholderText="Datum dolaska"
                   onChange={(date) => 
                    setStartDate(date)
                            } />   */}
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part9">Datum dolaska</Trans>
                  </label></div>

                  <input
                    defaultValue={linija.datumDolaska}
                    name="datumDolaska"
                    type="date"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  />
                  {/*<br />*/}
                  {/* <DatePicker className="inputText"
                 selected={endDate}
                  value={endDate}
                  required
                  scrollableMonthYearDropdownv 
                  placeholderText="Datum dolaska"
                   onChange={(date) =>   
                            setEndDate(date)} /> */}
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part11">Vreme polaska</Trans>
                  </label></div>

                  {/* className="inputText name1 input-new"
                      style={{ fontSize: "1rem" }} */}
                  <input
                    defaultValue={linija.vremePolaska}
                    className="input-stanica-vreme"
                    type="time"
                    required
                    label="Time"
                    name="vremePolaska"
                    onChange={adminLogic.changeHandler}
                  ></input>

                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                  </label></div>

                  {/* bila je klasa u inputu inputText name1 input-new
                  style={{ fontSize: "1rem" }} */}

                  <input
                    defaultValue={linija.vremeDolaska}
                    className="input-stanica-vreme"
                    type="time"
                    required
                    name="vremeDolaska"
                    onChange={adminLogic.changeHandler}
                  ></input>

                  {/* <label>
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
              <br /> */}
                  <div className="red-05"><label className="labela-stanica">Izaberite autobus</label></div>
                  
                  <select
                    value={linija.oznakaBusa}
                    name="oznakaBusa"
                    className="odaberiBus"
                    onChange={adminLogic.changeHandler}
                  >
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
                  <div className="red-1"></div>
                  <div className="red-1"></div>
                  <button type="submit" className="button">
                    <Trans i18nKey="description.part128">"Dodaj"</Trans>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2>Edituj Liniju</h2>
                <div className="labela">
                  <label>
                    <Trans i18nKey="description.part3">Mesto polaska</Trans>
                  </label>
                  <br />
                  <input
                    defaultValue={state.pocetnaStanica}
                    type="text"
                    placeholder="Mesto polaska"
                    required
                    name="pocetnaStanica"
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
                        name="stanica"
                        /* value={medjustanica.stanica} */
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
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

                      <label>
                        <Trans i18nKey="description.part11">
                          Vreme polaska
                        </Trans>
                      </label>
                      <br />
                      <input
                        /* defaultValue={linija.vremePolaska} */
                        className="inputText name1 input-new"
                        type="time"
                        required
                        label="Time"
                        name="vremePolaskaM"
                        style={{ fontSize: "1rem" }}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      ></input>
                      <label>
                        <Trans i18nKey="description.part11">
                          Vreme dolaska
                        </Trans>
                      </label>
                      <br />
                      <input
                        /* defaultValue={linija.vremePolaska} */
                        className="inputText name1 input-new"
                        type="time"
                        required
                        label="Time"
                        name="vremeDolaskaM"
                        style={{ fontSize: "1rem" }}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      ></input>
                      <label>
                        <Trans i18nKey="description.part7">Datum polaska</Trans>
                      </label>
                      <br />
                      <input
                        /*  defaultValue={linija.datumPolaska} */
                        name="datumPolaskaM"
                        type="date"
                        className="name1 input-new"
                        style={{ fontSize: "1rem" }}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />
                      <label>
                        <Trans i18nKey="description.part7">Datum dolaska</Trans>
                      </label>
                      <br />
                      <input
                        /*  defaultValue={linija.datumPolaska} */
                        name="datumDolaskaM"
                        type="date"
                        className="name1 input-new"
                        style={{ fontSize: "1rem" }}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />
                    </div>
                  ))}
                  <button type="button" onClick={duploDugmeMedjustanica}>
                    Dodaj usputnu stanicu
                  </button>{" "}
                  <br />
                  <label>
                    <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                  </label>
                  <br />
                  <input
                    defaultValue={state.krajnjaStanica}
                    type="text"
                    name="krajnjaStanica"
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
                    defaultValue={state.datumPolaska}
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
                    defaultValue={state.datumDolaska}
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
                    defaultValue={state.vremePolaska}
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
                    defaultValue={state.vremeDolaska}
                    className="inputText name1 input-new"
                    type="time"
                    required
                    name="vremeDolaska"
                    style={{ fontSize: "1rem" }}
                    onChange={adminLogic.changeHandler}
                  ></input>
                  <br />
                  {/* <label>
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
              <br /> */}
                  <div className="red-05"><label className="labela-stanica">Izaberite autobus</label></div>
                  
                  <select
                    value={state.oznakaBusa}
                    name="oznakaBusa"
                    onChange={adminLogic.changeHandler}
                  >
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
                  <div>
                  <label>Izaberite vozaca</label>
                  <select value={adminLogic.selectedVozac} name="vozac" onChange={adminLogic.changeHandler}>
                    {vozac.map((korisnik) => (
                      <option key={korisnik.idKorisnik} value={korisnik.idKorisnik}>
                      {korisnik.ime} {korisnik.prezime}
                   </option>
                     ))}
                  </select>
                  </div>
                  <div>
                  <label>Izaberite stjuardesa</label>
                  <select value={adminLogic.selectedStjuardesa} name="stjuardesa" onChange={adminLogic.changeHandler}>
                    {stjuardesa.map((korisnik) => (
                        <option key={korisnik.idKorisnik} value={korisnik.idKorisnik}>
                         {korisnik.ime} {korisnik.prezime}
                   </option>
                     ))}
                    </select>
                  </div>
                  <button type="submit" className="buttonSwitch">   {/* bilo je button    */}
                    {mode === "add" ? (
                      <Trans i18nKey="description.part128">"Dodaj"</Trans>
                    ) : (
                      <Trans i18nKey="description.part129">"Sačuvaj"</Trans>
                    )}
                  </button>
                </div>
              </div>
            )}{" "}
            {/* bilo je h2 a ne <>  */}
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LineForm;
