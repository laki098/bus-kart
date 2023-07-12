import React, { useState, useEffect } from "react";
import BusLogic from "./bus.logic";
import BusApi from "../../api/bus.api";

import "../login/loginStyle.css";               /* koristim stil kao ize dela za logovanje */
//import "../NavBar/links/pocetna.css";


import { useTranslation, Trans } from 'react-i18next';    //prevodjenje
import '../NavBar/links/i18n';
import '../../components/NavBar/links/i18n';

const BusForm = ({ mode, id }) => {
  const [bus, setBus] = useState({});
  const busLogic = BusLogic();

  const izmeinAutobus = async () => {
    const response = await BusApi().filterBusId(id);
    const data = await response.data;

    setBus(data);
  };

  console.log(bus);
  useEffect(() => {
    if (mode == "edit") {
      izmeinAutobus();
    }
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      busLogic.upisBus();
    } else if (mode === "edit") {
      const formData = new FormData(event.target);
      const data = {
        id: id,
        tablica: formData.get("tablica"),
        brojMesta: formData.get("brojMesta"),
      };

      busLogic.editBus(data);
    }
  };

  //prevodjenje start
  const lngs = {
    en: { nativeName: 'Engleski' }, 
    de: { nativeName: 'Srpski' }
    };
    const { t, i18n } = useTranslation();
    // prevodjenje end

  return (
    <div className="pozadina">
        <header>
        <div style={{textAlign:"right", marginRight:"3rem"}}>
          {Object.keys(lngs).map((lng) => (
            <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
        </header> 
    <div className="main">
    <div className="sub-main">
    <form onSubmit={submitHandler} >
    <div >

      <br/>
      {mode === "add" ? <p className="naslov"><Trans i18nKey="description.part127">Dodajte autobus</Trans></p> : <p className="naslov">Edituj autobus</p>}
      <br/>
      <label><Trans i18nKey="description.part126">Registarska tablica</Trans></label>
      <br />
      <input
        /* defaultValue={bus.tablica} */
        type="text"
        placeholder="Registarska tablica"
        required
        name="tablica"
        className="input-new"
        onChange={busLogic.changeHandler}
      />
      <br /><br/>
      <label><Trans i18nKey="description.part36">Broj mesta</Trans></label>
      <br />
      <input
        /* defaultValue={bus.mestoDolaska} */
        type="text"
        name="brojMesta"
        className="input-new"
        placeholder="Broj mesta"
        required
        onChange={busLogic.changeHandler}
      />
      <br /><br/><br/>

      <button type="submit" className="button" style={{height: "2rem"}}>{mode === "add" ? <Trans i18nKey="description.part128">"Dodaj"</Trans> : <Trans i18nKey="description.part129">"Sačuvaj"</Trans>}</button>
      
    
    </div>  
    </form>
    </div></div></div>
    
  );
};

export default BusForm;
