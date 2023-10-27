import React, { useState, useEffect } from "react";
import AdminLogic from "./admin.logic";
import LinijeApi from "../../api/linije.api";

import "../login/loginStyle.css"; /* preuzimam stil od login/login.component.js */

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import helpers from "../../helpers/helpers";


import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
    setTimeout(() => {
      window.location.href = "/admin.initial";
    }, 2000);

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

  const sacuvaniPodaci = () => {
    toast('Uspešno ste sačuvali podatke', {
      position: toast.POSITION.BOTTOM_CENTER,
      className: 'toast-message'
  });
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
        <div className="tabela-stanica prosiri-tabela-stanica">             {/*  className=" sub-main"    */}
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
                      <label className="labela-stanica">
                      <Trans i18nKey="description.part169">Cena</Trans></label>

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
                    <option value="">Izaberite autobus</option>
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
                  <button type="submit" className="button"
                  onClick={sacuvaniPodaci}>
                    <Trans i18nKey="description.part128">"Dodaj"</Trans>
                  </button>
                  <ToastContainer/>
                </div>
              </div>
            ) : (
              <div >
                <div className="naslovStanica">
                <Trans i18nKey="description.part164">Edituj Liniju  </Trans>
                </div>
                <div >
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part3">Mesto polaska</Trans>
                  </label></div>
                  
                  {/*   name1 input-new   style={{ fontSize: "1rem", color: "darkblue" }} */}
                  <input
                    defaultValue={state.pocetnaStanica}
                    type="text"
                    placeholder="Mesto polaska"
                    required
                    name="pocetnaStanica"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  />
                  <div className="red-1"></div>
                  {waypoints.map((waypoint, index) => (
                    <div key={index}>
                      <div className="red-05"><hr/></div>
                      <div className="red-05">
                        <label className="labela-stanica"><strong>
                        <Trans i18nKey="description.part165">  Usputna stanica </Trans>{index + 1}
                      </strong></label></div>
                      
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
                      &emsp;&emsp;
                      <label className="labela-stanica">
                      <Trans i18nKey="description.part169">Cena</Trans></label>

                      <div className="red-05"><label className="labela-stanica">
                        <Trans i18nKey="description.part150">
                          Vreme odlaska (polaska)
                        </Trans>
                      </label></div>

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
                      
                      {/* className="inputText name1 input-new"  style={{ fontSize: "1rem" }}  */}
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
                        <Trans i18nKey="description.part7">Datum dolaska</Trans>
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
                  <div className="red-1">
                  <button type="button" className="buttonSwitch korekcijaDugmeta" onClick={duploDugmeMedjustanica}>
                  <Trans i18nKey="description.part151">Dodaj usputnu stanicu  </Trans>
                  </button>
                  </div>
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                  </label></div>
                  
                  <input
                    defaultValue={state.krajnjaStanica}
                    type="text"
                    name="krajnjaStanica"
                    placeholder="Mesto dolaska"
                    className="input-stanica"
                    required
                    onChange={adminLogic.changeHandler}
                  />
                  
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part7">Datum polaska</Trans>
                  </label></div>
                  
                  <input
                    defaultValue={state.datumPolaska}
                    name="datumPolaska"
                    type="date"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  />
                  
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
                    defaultValue={state.datumDolaska}
                    name="datumDolaska"
                    type="date"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  />
                  
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
                  
                  <input
                    defaultValue={state.vremePolaska}
                    className="input-stanica"
                    type="time"
                    required
                    label="Time"
                    name="vremePolaska"
                    onChange={adminLogic.changeHandler}
                  ></input>
                  
                  <div className="red-05"><label className="labela-stanica">
                    <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                  </label></div>
                  
                  <input
                    defaultValue={state.vremeDolaska}
                    className="input-stanica"
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
                  <div className="red-05"><label className="labela-stanica">
                  <Trans i18nKey="description.part166">Izaberite autobus  </Trans>
                  </label></div>
                  
                  <select
                    value={state.oznakaBusa}
                    defaultValue={state.oznakaBusa}
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
                  <div className="red-1"></div>
                  {/* ------------------------------    */}
                  <div>
                    <div className="pisi-levo">
                    <div className="red-05">
                      <label className="labela-stanica">
                      <Trans i18nKey="description.part168">Izaberite vozača </Trans>
                      </label>
                    </div>
                    <div className="red-05">
                      <label className="labela-stanica">
                      <Trans i18nKey="description.part167">Izaberite stjuardesu </Trans>
                      </label>
                    </div>
                    </div>

                    <div className="pisi-desno">
                      <div className="red-05">
                        <select value={adminLogic.selectedVozac} name="vozac" onChange={adminLogic.changeHandler}>
                        {vozac.map((korisnik) => (
                          <option key={korisnik.idKorisnik} value={korisnik.idKorisnik}>
                          {korisnik.ime} {korisnik.prezime}
                        </option>
                        ))}
                        </select>
                      </div>

                      <div className="red-05">
                        <select value={adminLogic.selectedStjuardesa} name="stjuardesa" onChange={adminLogic.changeHandler}>
                          {stjuardesa.map((korisnik) => (
                          <option key={korisnik.idKorisnik} value={korisnik.idKorisnik}>
                          {korisnik.ime} {korisnik.prezime}
                          </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* ------------------------------   
                  <div>
                  <div className="red-05">
                    <label className="labela-stanica">
                    <Trans i18nKey="description.part168">Izaberite vozača </Trans>
                    </label>
                    &emsp;&ensp;&emsp;

                    <select value={adminLogic.selectedVozac} name="vozac" onChange={adminLogic.changeHandler}>
                      {vozac.map((korisnik) => (
                        <option key={korisnik.idKorisnik} value={korisnik.idKorisnik}>
                        {korisnik.ime} {korisnik.prezime}
                    </option>
                    ))}
                    </select>
                  </div>
                  </div>

                  <div>
                  <div className="red-05">
                    <label className="labela-stanica">
                    <Trans i18nKey="description.part167">Izaberite stjuardesu </Trans>
                    </label>
                    &emsp;
                    <select value={adminLogic.selectedStjuardesa} name="stjuardesa" onChange={adminLogic.changeHandler}>
                      {stjuardesa.map((korisnik) => (
                        <option key={korisnik.idKorisnik} value={korisnik.idKorisnik}>
                         {korisnik.ime} {korisnik.prezime}
                    </option>
                    ))}
                    </select>
                  </div>
                  </div>

                     -------------------------------       */}
                  <div className="red-1">
                  <button type="submit" className="buttonSwitch"
                    onClick={sacuvaniPodaci}>   {/* bilo je button    */}
                    {mode === "add" ? (
                      <Trans i18nKey="description.part128">"Dodaj"</Trans>
                    ) : (
                      <Trans i18nKey="description.part129">"Sačuvaj"</Trans>
                    )}
                  </button>
                  <ToastContainer />
                  </div>
                </div>
              </div>
            )}{" "}
            {/* bilo je h2 a ne <>  */}
            
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default LineForm;
