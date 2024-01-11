import React, { useState, useEffect } from "react";
import StaniceLogic from "./stanice.logic";
import StaniceApi from "../../../api/stanice.api";
import "./stanica.css";

import "../../NavBar/links/i18n";
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import { ToastContainer } from "react-toastify";

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
    if (mode == "edit") {
      izmeniStanice();
    }
  }, []);

  

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      staniceLogic.upisStanice();
    } else if (mode === "edit") {
      const formData = new FormData(event.target);
      const data = {
        id: id,
        naziv: formData.get("naziv"),
        adresa: formData.get("adresa"),
      };
      staniceLogic.editStanice(data);
    }
  };

  //prevodjenje
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

  return (
    <div>
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

      <form onSubmit={submitHandler} className="tabela-stanica">
        <div>
          <div className="naslovStanica">
            {mode === "add" ? (
              <p>
                <Trans i18nKey="description.part140">Nova stanica</Trans>
              </p>
            ) : (
              <p>
                <Trans i18nKey="description.part141">Izmena stanica</Trans>
              </p>
            )}
          </div>
          <div>
            <div>
              <label className="labela-stanica">
                <Trans i18nKey="description.part142">Naziv</Trans>
              </label>
            </div>
            {/* za input bilo je className="test"  */}
            <input
              defaultValue={stanice.naziv}
              type="text"
              name="naziv"
              className="input-stanica"
              onChange={staniceLogic.changeHandler}
            ></input>
          </div>
          <div className="red-1"></div>
          <div>
            <div>
              <label className="labela-stanica">
                <Trans i18nKey="description.part111">Adresa</Trans>
              </label>
            </div>
            <input
              defaultValue={stanice.adresa}
              type="text"
              name="adresa"
              className="input-stanica"
              onChange={staniceLogic.changeHandler}
            ></input>
          </div>
          <div>
            <div className="red-1"></div>
            <button  type="submit" className="buttonSwitch">
              {mode === "add" ? (
                <>
                  <Trans i18nKey="description.part128">Dodaj</Trans>
                </>
              ) : (
                <>
                  <Trans i18nKey="description.part133">Zameni</Trans>
                </>
              )}
            </button>
          </div>
          <div className="red-1"></div>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default StaniceForm;
