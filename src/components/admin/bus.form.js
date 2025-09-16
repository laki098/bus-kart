import React, { useState, useEffect } from "react";
import BusLogic from "./bus.logic";
import BusApi from "../../api/bus.api";

import "./busForm.css";
import { useTranslation, Trans } from "react-i18next";
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import { ToastContainer } from "react-toastify";
import LanguageSwitcher from "../header/header";

const BusForm = ({ mode, idAutobusa }) => {
  const [bus, setBus] = useState({});
  const busLogic = BusLogic();

  const izmeinAutobus = async () => {
    const response = await BusApi().filterBusId(idAutobusa);
    const data = await response.data;
    setBus(data.autobusi);
  };

  useEffect(() => {
    if (mode === "edit") izmeinAutobus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, idAutobusa]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (mode === "add") {
      busLogic.upisBus();
    } else {
      const fd = new FormData(e.target);
      busLogic.editBus({
        idAutobusa,
        oznakaBusa: fd.get("oznakaBusa"),
        tablice: fd.get("tablice"),
        brojSedista: fd.get("brojSedista"),
      });
    }
  };

  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  return (
    <div>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <div className="busForm-card">
        <div className="busForm-cardHeader">
          <span className="busForm-title">
            {mode === "add" ? (
              <Trans i18nKey="description.part127">Dodajte autobus</Trans>
            ) : (
              <Trans i18nKey="description.part143">Edituj autobus</Trans>
            )}
          </span>
        </div>

        <div className="busForm-cardBody">
          <form onSubmit={submitHandler} className="busForm-form" noValidate>
            <div className="busForm-field">
              <p className="busForm-label">
                <Trans i18nKey="description.part144">Oznaka autobusa</Trans>
              </p>
              <input
                key={bus?.oznakaBusa || mode + "-ozn"}
                defaultValue={bus?.oznakaBusa}
                type="text"
                name="oznakaBusa"
                className="busForm-input"
                placeholder="Oznaka autobusa"
                required
                autoComplete="off"
                onChange={busLogic.changeHandler}
              />
            </div>

            <div className="busForm-field">
              <p className="busForm-label">
                <Trans i18nKey="description.part126">Registarska tablica</Trans>
              </p>
              <input
                key={bus?.tablice || mode + "-tab"}
                defaultValue={bus?.tablice}
                type="text"
                name="tablice"
                className="busForm-input"
                placeholder="Registarske tablice"
                required
                autoComplete="off"
                onChange={busLogic.changeHandler}
              />
            </div>

            <div className="busForm-field">
              <p className="busForm-label">
                <Trans i18nKey="description.part36">Broj mesta</Trans>
              </p>
              <input
                key={bus?.brojSedista || mode + "-br"}
                defaultValue={bus?.brojSedista}
                type="number"
                name="brojSedista"
                className="busForm-input"
                placeholder="Broj mesta"
                min={1}
                step={1}
                required
                onChange={busLogic.changeHandler}
              />
            </div>

            <div className="busForm-actions">
              <button type="submit" className="busForm-button">
                {mode === "add" ? (
                  <Trans i18nKey="description.part128">Dodaj</Trans>
                ) : (
                  <Trans i18nKey="description.part129">Sačuvaj</Trans>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default BusForm;
