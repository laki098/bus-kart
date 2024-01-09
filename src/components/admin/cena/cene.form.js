import React, { useState, useEffect } from "react";
import CeneLogic from "./cene.logic";
import CeneApi from "../../../api/cene.api";
import "./cene.css";
import { ToastContainer } from "react-toastify";
import helpers from "../../../helpers/helpers";
import apiUrl from "../../../apiConfig";

import "../../NavBar/links/i18n"; // za prevodjenje
import "../../../components/rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

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
  }, []);

  const [stanice, setStanice] = useState([]);

  const getStanice = async () => {
    const response = await fetch(`${apiUrl}/stanica`);
    const data = await response.json();

    const a1 = data.stanice.map((item) => {
      return { naziv: item.naziv, id: item.id };
    });

    const a2 = a1 //
      .map((item) => item.naziv) //Uradjen filter da se u selektu ne ponavljaju linije
      .filter(helpers.filterUnique);

    setStanice(a2);
  };
  console.log(stanice);

  useEffect(() => {
    getStanice(); //?Prilikom ucitavanja stranice da pozove funkciju get stanice
  }, []);

  const back = () => {
    setTimeout(() => {
      window.location.href = "/cene.initial";
    }, 2000);
  };

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

  //prevodjenje
    const lngs = {
      en: { nativeName: "Engleski" },
      de: { nativeName: "Srpski" },
    };
    const { t, i18n } = useTranslation();
  // prevodjenje

  return (
    <>
      <header>
        <div className="jezici ">
          {Object.keys(lngs).map((lng) => (
            
            <button
              key={lng}
              style={{fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",}}
             
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lngs[lng].nativeName}
            </button>
            
          ))}
        </div>
      </header>

      <div className="red-1"></div>
      <form onSubmit={submitHandler} className="cene-form admin-initial-polje-izmena"> 
                                {/* dodala zbog senke admin-initial-polje-izmena   */}
        <div>
          <div className="naslov-cene">
            {mode === "add" ? 
            <><Trans i18nKey="description.part196">Nova cena</Trans></>
             : 
            <><Trans i18nKey="description.part197">Izmeni cenu</Trans></>
            }
          </div>
          <div>
            <div>
              <label className="cene-labela">
                <Trans i18nKey="description.part31">Početna Stanica</Trans>
              </label>
            </div>
            <select
              name="pocetnaStanica"
              className="input-cene"
              defaultValue={mode === "add" ? "" : cene.pocetnaStanica}
              onChange={ceneLogic.changeHandler}
            >
              <option disabled={!mode === "add"}>{mode === "add" ? 
                <Trans i18nKey="description.part202">Izaberi stanicu</Trans>
                : 
                cene.pocetnaStanica}
              </option>
              {stanice.map((stanica) => {
                if (stanica !== cene.pocetnaStanica) {
                  return (
                    <option key={stanica} value={stanica}>
                      {stanica}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div>
            <div>
              <label className="cene-labela">
                <Trans i18nKey="description.part198">Krajnja stanica</Trans>
              </label>
            </div>
            <select
              name="krajnjaStanicaR"
              className="input-cene"
              defaultValue={mode === "add" ? "" : cene.krajnjaStanicaR}
              onChange={ceneLogic.changeHandler}
            >
              <option disabled={!mode === "add"}>{mode === "add" ? 
               <Trans i18nKey="description.part202">Izaberi stanicu</Trans>
                : 
               cene.krajnjaStanicaR}
              </option>
              {stanice.map((stanica) => {
                if (stanica !== cene.krajnjaStanicaR) {
                  return (
                    <option key={stanica} value={stanica}>
                      {stanica}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div>
            <div>
              {" "}
              <label className="cene-labela">
                <Trans i18nKey="description.part169">Cena</Trans>
              </label>
            </div>
            <input
              defaultValue={cene.cenaKarte}
              type="number"
              name="cenaKarte"
              className="input-cene"
              onChange={ceneLogic.changeHandler}
            />
          </div>
          <div className="red-1"></div>
          <div>
            <button onClick={back} type="submit" className="buttonSwitch">
              {mode === "add" ? 
                <><Trans i18nKey="description.part128">Dodaj </Trans></>
               : 
                <><Trans i18nKey="description.part133">Zameni </Trans></>
              }
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default CeneForm;
