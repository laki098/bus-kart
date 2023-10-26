import React, { useState, useEffect } from "react";
import BusLogic from "./bus.logic";
import BusApi from "../../api/bus.api";

import "../login/loginStyle.css"; /* koristim stil kao ize dela za logovanje */
//import "../NavBar/links/pocetna.css";
import "./stanica/stanica.css";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";

const BusForm = ({ mode, idAutobusa }) => {
  const [bus, setBus] = useState({});
  const busLogic = BusLogic();
  const izmeinAutobus = async () => {
    const response = await BusApi().filterBusId(idAutobusa);
    const data = await response.data;

    setBus(data.autobusi);
  };

  useEffect(() => {
    if (mode == "edit") {
      izmeinAutobus();
    }
  }, []);

  const back = () => {
    setTimeout(() => {
      window.location.href = "/bus.initial";
    }, 2000);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      busLogic.upisBus();
    } else if (mode === "edit") {
      const formData = new FormData(event.target);
      const data = {
        idAutobusa: idAutobusa,
        oznakaBusa: formData.get("oznakaBusa"),
        tablice: formData.get("tablice"),
        brojSedista: formData.get("brojSedista"),
      };

      busLogic.editBus(data);
    }
  };

  //prevodjenje start
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  console.log(bus);
  return (
    <div>        {/* className="pozadina"  */}
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

      <div className="red-1"></div>
      <div className="red-1"></div>
      <div className="red-1"></div>

      <div >                                    {/*  className="main"   */}
        <div className="tabela-stanica prosiri-tabela-stanica">        {/* sub-main */}
          <form onSubmit={submitHandler}>
            <div>
            
              {mode === "add" ? (
                <p className="naslovStanica">          {/* naslov    */}
                  <Trans i18nKey="description.part127">Dodajte autobus</Trans>
                </p>
              ) : (
                <p className="naslovStanica"><Trans i18nKey="description.part143">Edituj autobus</Trans></p>
              )}
              <div className="red-1"></div>
              <div><label className="labela-stanica">
              <Trans i18nKey="description.part144">Oznaka autobusa</Trans>
              </label></div>
              
              {/* biolo je input-new  pa onda input-new-bus*/}
              <input
                defaultValue={bus.oznakaBusa}
                type="text"
                placeholder="Oznaka autobusa"
                required
                name="oznakaBusa"
                className="input-stanica"
                onChange={busLogic.changeHandler}
              />
              <div className="red-1"></div>
              <div><label className="labela-stanica">
                <Trans i18nKey="description.part126">Registarska tablica</Trans>
              </label></div>
              
                  {/*  className="input-new" */}
              <input
                defaultValue={bus.tablice}
                type="text"
                placeholder="Registarska tablice"
                required
                name="tablice"
                className="input-stanica"
                onChange={busLogic.changeHandler}
              />
              <div className="red-1"></div>
              <div><label className="labela-stanica">
                <Trans i18nKey="description.part36">Broj mesta</Trans>
              </label></div>
              
              <input
                defaultValue={bus.brojSedista}
                type="number"
                name="brojSedista"
                className="input-stanica"
                placeholder="Broj mesta"
                required
                onChange={busLogic.changeHandler}
              />
              <div className="red-1"></div>
                {/* bilo je className="button"   style={{ height: "2rem" }}*/}
              <button
                onClick={back}
                type="submit"
                className="buttonSwitch"
              >
                {mode === "add" ? (
                  <Trans i18nKey="description.part128">"Dodaj"</Trans>
                ) : (
                  <Trans i18nKey="description.part129">"Sačuvaj"</Trans>
                )}
              </button>
              <div className="red-1"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusForm;
