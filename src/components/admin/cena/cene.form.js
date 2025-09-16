import React, { useState, useEffect } from "react";
import CeneLogic from "./cene.logic";
import CeneApi from "../../../api/cene.api";
import "./cene.css";
import { ToastContainer } from "react-toastify";
import helpers from "../../../helpers/helpers";
import apiUrl from "../../../apiConfig";

import "../../NavBar/links/i18n";
import "../../../components/rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";

import LanguageSwitcher from "../../header/header";
import "../ListBus.css";

const CeneForm = ({ mode, id }) => {
  const [cene, setCene] = useState({});
  const ceneLogic = CeneLogic();

  const izmeniCene = async () => {
    try {
      const response = await CeneApi().filterCeneId(id);
      const data = response.data;
      setCene(data.cena);
    } catch (error) {
      console.error("Greška prilikom izmene cena:", error);
    }
  };

  useEffect(() => {
    if (mode == "edit") {
      izmeniCene();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const [stanice, setStanice] = useState([]);

  const getStanice = async () => {
    const response = await fetch(`${apiUrl}/stanica`);
    const data = await response.json();

    const a1 = data.stanice.map((item) => {
      return { naziv: item.naziv, id: item.id };
    });

    const a2 = a1.map((item) => item.naziv).filter(helpers.filterUnique);

    setStanice(a2);
  };

  useEffect(() => {
    getStanice();
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      ceneLogic.upisCene();
    } else if (mode === "edit") {
      const formData = new FormData(event.target);
      const data = {
        id: id,
        pocetnaStanica: formData.get("pocetnaStanica"),
        krajnjaStanicaR: formData.get("krajnjaStanicaR"),
        cenaKarte: formData.get("cenaKarte"),
      };
      ceneLogic.editCene(data);
    }
  };

  // prevodjenje
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  return (
    <>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <div className="priceForm-card">
        <div className="priceForm-cardHeader">
          <span className="priceForm-title">
            {mode === "add" ? (
              <Trans i18nKey="description.part196">Nova cena</Trans>
            ) : (
              <Trans i18nKey="description.part197">Izmeni cenu</Trans>
            )}
          </span>
        </div>

        <div className="priceForm-cardBody">
          <form onSubmit={submitHandler} className="priceForm-form" noValidate>
            {/* Početna stanica */}
            <div className="priceForm-field">
              <p className="priceForm-label">
                <Trans i18nKey="description.part31">Početna stanica</Trans>
              </p>
              <select
                name="pocetnaStanica"
                className="priceForm-select"
                defaultValue={mode === "add" ? "" : cene.pocetnaStanica}
                onChange={ceneLogic.changeHandler}
              >
                <option disabled={!mode === "add"}>
                  {mode === "add" ? (
                    <Trans i18nKey="description.part202">Izaberi stanicu</Trans>
                  ) : (
                    cene.pocetnaStanica
                  )}
                </option>
                {stanice.map((stanica) => {
                  if (stanica !== cene.pocetnaStanica) {
                    return (
                      <option key={stanica} value={stanica}>
                        {stanica}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>

            {/* Krajnja stanica */}
            <div className="priceForm-field">
              <p className="priceForm-label">
                <Trans i18nKey="description.part198">Krajnja stanica</Trans>
              </p>
              <select
                name="krajnjaStanicaR"
                className="priceForm-select"
                defaultValue={mode === "add" ? "" : cene.krajnjaStanicaR}
                onChange={ceneLogic.changeHandler}
              >
                <option disabled={!mode === "add"}>
                  {mode === "add" ? (
                    <Trans i18nKey="description.part202">Izaberi stanicu</Trans>
                  ) : (
                    cene.krajnjaStanicaR
                  )}
                </option>
                {stanice.map((stanica) => {
                  if (stanica !== cene.krajnjaStanicaR) {
                    return (
                      <option key={stanica} value={stanica}>
                        {stanica}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>

            {/* Cena */}
            <div className="priceForm-field">
              <p className="priceForm-label">
                <Trans i18nKey="description.part169">Cena</Trans>
              </p>
              <input
                defaultValue={cene.cenaKarte}
                type="number"
                name="cenaKarte"
                className="priceForm-input"
                placeholder="0"
                onChange={ceneLogic.changeHandler}
              />
            </div>

            <div className="priceForm-actions">
              <button type="submit" className="priceForm-button">
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
    </>
  );
};

export default CeneForm;
