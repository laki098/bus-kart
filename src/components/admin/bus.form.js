import React, { useState, useEffect } from "react";
import BusLogic from "./bus.logic";
import BusApi from "../../api/bus.api";

import "../login/loginStyle.css"; /* koristim stil kao ize dela za logovanje */
//import "../NavBar/links/pocetna.css";

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
    window.history.back();
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
    <div className="pozadina">
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
      <div className="main">
        <div className="sub-main">
          <form onSubmit={submitHandler}>
            <div>
              <br />
              {mode === "add" ? (
                <p className="naslov">
                  <Trans i18nKey="description.part127">Dodajte autobus</Trans>
                </p>
              ) : (
                <p className="naslov"><Trans i18nKey="description.part143">Edituj autobus</Trans></p>
              )}
              <br />
              <label>
              <Trans i18nKey="description.part144">Oznaka autobusa</Trans>
              </label>
              <br />
              <input
                defaultValue={bus.oznakaBusa}
                type="text"
                placeholder="Oznaka autobusa"
                required
                name="oznakaBusa"
                className="input-new"
                onChange={busLogic.changeHandler}
              />
              <br />
              <br />
              <label>
                <Trans i18nKey="description.part126">Registarska tablica</Trans>
              </label>
              <br />

              <input
                defaultValue={bus.tablice}
                type="text"
                placeholder="Registarska tablice"
                required
                name="tablice"
                className="input-new"
                onChange={busLogic.changeHandler}
              />
              <br />
              <br />
              <label>
                <Trans i18nKey="description.part36">Broj mesta</Trans>
              </label>
              <br />
              <input
                defaultValue={bus.brojSedista}
                type="number"
                name="brojSedista"
                className="input-new"
                placeholder="Broj mesta"
                required
                onChange={busLogic.changeHandler}
              />
              <br />
              <br />
              <br />

              <button
                onClick={back}
                type="submit"
                className="button"
                style={{ height: "2rem" }}
              >
                {mode === "add" ? (
                  <Trans i18nKey="description.part128">"Dodaj"</Trans>
                ) : (
                  <Trans i18nKey="description.part129">"Sačuvaj"</Trans>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusForm;
