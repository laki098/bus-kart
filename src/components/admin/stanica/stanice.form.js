import React, { useState, useEffect } from "react";
import StaniceLogic from "./stanice.logic";
import StaniceApi from "../../../api/stanice.api";

import "./stanica.css";

import "../../NavBar/links/i18n";
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";
import { ToastContainer } from "react-toastify";
import LanguageSwitcher from "../../header/header";

const StaniceForm = ({ mode, id }) => {
  const [stanice, setStanice] = useState({});
  const staniceLogic = StaniceLogic();

  const izmeniStanice = async () => {
    try {
      const response = await StaniceApi().filterStaniceId(id);
      const data = response.data;
      setStanice(data.stanica);
    } catch (error) {
      console.error("Greška prilikom izmene stanica:", error);
    }
  };

  useEffect(() => {
    if (mode === "edit") izmeniStanice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (mode === "add") {
      staniceLogic.upisStanice();
    } else {
      const fd = new FormData(e.target);
      staniceLogic.editStanice({
        id,
        naziv: fd.get("naziv"),
        adresa: fd.get("adresa"),
      });
    }
  };

  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  return (
    <div>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <div className="stationForm-card">
        <div className="stationForm-cardHeader">
          <span className="stationForm-title">
            {mode === "add" ? (
              <Trans i18nKey="description.part140">Nova stanica</Trans>
            ) : (
              <Trans i18nKey="description.part141">Izmena stanica</Trans>
            )}
          </span>
        </div>

        <div className="stationForm-cardBody">
          <form
            onSubmit={submitHandler}
            className="stationForm-form"
            noValidate
          >
            <div className="stationForm-field">
              <p className="stationForm-label">
                <Trans i18nKey="description.part142">Naziv</Trans>
              </p>
              <input
                key={stanice?.naziv || mode + "-naziv"}
                defaultValue={stanice?.naziv}
                type="text"
                name="naziv"
                className="stationForm-input"
                placeholder="Naziv stanice"
                required
                autoComplete="off"
                onChange={staniceLogic.changeHandler}
              />
            </div>

            <div className="stationForm-field">
              <p className="stationForm-label">
                <Trans i18nKey="description.part111">Adresa</Trans>
              </p>
              <input
                key={stanice?.adresa || mode + "-adresa"}
                defaultValue={stanice?.adresa}
                type="text"
                name="adresa"
                className="stationForm-input"
                placeholder="Adresa"
                required
                autoComplete="off"
                onChange={staniceLogic.changeHandler}
              />
            </div>

            <div className="stationForm-actions">
              <button type="submit" className="stationForm-button">
                {mode === "add" ? (
                  <Trans i18nKey="description.part128">Dodaj</Trans>
                ) : (
                  <Trans i18nKey="description.part133">Zameni</Trans>
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

export default StaniceForm;
