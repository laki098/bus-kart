import React, { useState, useEffect } from "react";
import AdminLogic from "./admin.logic";
import LinijeApi from "../../api/linije.api";
import apiUrl from "../../apiConfig";

import "../login/loginStyle.css"; /* preuzimam stil od login/login.component.js */

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import helpers from "../../helpers/helpers";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LineForm = ({ mode, id, state }) => {
  const [linija, setLinija] = useState([]);
  const adminLogic = AdminLogic();
  const [stanice, setStanice] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [cene, setCene] = useState([]);
  const [autobusi, setAutobusi] = useState([]);
  const [vozac, setVozac] = useState([]);
  const [stjuardesa, setStjuardesa] = useState([]);
  const [najveciRedosled, setNajveciRedosled] = useState(0);
  const today = new Date().toISOString().split("T")[0];

  const getAutobusi = async () => {
    const response = await fetch(`${apiUrl}/autobusi`);
    const data = await response.json();
    const autobusi = data.autobusi.map((item) => {
      return { oznakaBusa: item.oznakaBusa };
    });
    setAutobusi(autobusi);
  };

  const getLinija = async () => {
    const response = await fetch(`${apiUrl}/linija/${id}`);
    const data = await response.json();
    setLinija(data.linija);
  };

  const getStanice = async () => {
    const response = await fetch(`${apiUrl}/stanica`);
    const data = await response.json();
    const stanica = data.stanice.map((item) => {
      return { naziv: item.naziv };
    });
    const filterStanica = stanica
      .map((item) => item.naziv)
      .filter(helpers.filterUnique);
    setStanice(filterStanica);
  };

  const getKorisnici = async () => {
    //? izdvaja sve korisnike i ovde se radi filter za rolu koja nama treba
    const response = await fetch(`${apiUrl}/korisnik`);
    const data = await response.json();
    const korisnici = data.korisnici;

    const vozaci = korisnici.filter((korisnik) => korisnik.role === "vozac");
    const stjuardesa = korisnici.filter(
      (korisnik) => korisnik.role === "stjuardesa"
    );

    setVozac(vozaci);
    setStjuardesa(stjuardesa);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
    setSelectedValues([...selectedValues, ""]);
    setCene([...cene, ""]);
  };

  const duploDugmeMedjustanica = () => {
    addWaypoint();
    adminLogic.dodajMedjustanicu();
    dobaviNajveciRedosled();
  };

  const removeWaypoint = (index) => {
    const updatedWaypoints = [...waypoints];
    const updatedSelectedValues = [...selectedValues];
    const updatedCene = [...cene];

    updatedWaypoints.splice(index, 1);
    updatedSelectedValues.splice(index, 1);
    updatedCene.splice(index, 1);

    setWaypoints(updatedWaypoints);
    setSelectedValues(updatedSelectedValues);
    setCene(updatedCene);

    //? Pozovite funkciju za uklanjanje medjustanica iz admin logike
    adminLogic.ukloniMedjustanicu(index);
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

  useEffect(() => {
    getLinija();
    getStanice();
    getAutobusi();
    getKorisnici();

    if (mode === "edit") {
      /* izmeniLiniju(); */
    }
  }, []);

  const medjustanice = [];
  const datumPolaska = [];
  const datumDolaska = [];

  const submitHandler = (event) => {
    event.preventDefault();

    if (mode === "add") {
      adminLogic.upisLinije();
    } else if (mode === "edit") {
      const formData = new FormData(event.target);
      const data = {
        pocetnaStanica: formData.get("pocetnaStanica"),
        medjustanice: medjustanice,
        krajnjaStanica: formData.get("krajnjaStanica"),
        vremePolaska: formData.get("vremePolaska"),
        vremeDolaska: formData.get("vremeDolaska"),
        datumPolaska: formData.get("datumPolaska"),
        datumDolaska: formData.get("datumDolaska"),
        oznakaBusa: formData.get("oznakaBusa"),
        vozac: formData.get("vozac"),
        stjuardesa: formData.get("stjuardesa"),
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

  const dobaviNajveciRedosled = () => {
    const medjustanice = linija.Stanicas;
    let redosled = medjustanice[0].Medjustanica.redosled;
    medjustanice.forEach((stanica) => {
      if (stanica.Medjustanica.redosled > redosled) {
        redosled = stanica.Medjustanica.redosled;
      }
    });
    setNajveciRedosled(redosled);
  };

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

      <div>
        <div className="tabela-stanica prosiri-tabela-stanica">
          <form onSubmit={submitHandler}>
            {mode === "add" ? (
              <div>
                <p className="naslovStanica">
                  <Trans i18nKey="description.part130">Nova linija</Trans>
                </p>
                <div>
                  <div>
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part3">Mesto polaska</Trans>
                    </label>
                  </div>
                  <div>
                    <select
                      name="pocetnaStanica"
                      className="input-stanica"
                      onChange={adminLogic.changeHandler}
                    >
                      <option
                        className="medjustanica"
                        value=""
                        disabled
                        selected
                        required
                      >
                        Izaberite stanicu
                      </option>
                      {stanice.map((stanica) => {
                        return (
                          <option
                            className="medjustanica"
                            key={stanica}
                            value={stanica}
                          >
                            {stanica}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part7">Datum polaska</Trans>
                    </label>
                  </div>

                  <input
                    /*  defaultValue={linija.datumPolaska} */
                    name="datumPolaska"
                    type="date"
                    required
                    className="input-stanica"
                    min={today}
                    onChange={adminLogic.handlerDatumPolaska}
                  />

                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part9">Datum dolaska</Trans>
                    </label>
                  </div>

                  <input
                    /*  defaultValue={linija.datumDolaska} */
                    name="datumDolaska"
                    type="date"
                    required
                    className="input-stanica"
                    min={today}
                    onChange={adminLogic.handlerDatumDolaska}
                  />

                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part11">Vreme polaska</Trans>
                    </label>
                  </div>
                  <input
                    /*  defaultValue={linija.vremePolaska} */
                    className="input-stanica-vreme"
                    type="time"
                    required
                    name="vremePolaska"
                    onChange={adminLogic.changeHandler}
                  ></input>
                  <div className="red-05"></div>
                  <div>
                    {" "}
                    {/* className="ograda-medjustanice" */}
                    {waypoints.map((waypoint, index) => (
                      <div key={index}>
                        <div className="red-1">
                          <div className="red-05">
                            <hr />
                          </div>
                          <label className="labela-stanica">
                            <strong>Usputna stanica {index + 1}</strong>
                          </label>
                        </div>

                        <select
                          name="stanica"
                          className="input-stanica"
                          /* value={medjustanica.stanica} */
                          onChange={(e) =>
                            adminLogic.handlerMedjustanice(e, index)
                          }
                        >
                          <option
                            className="medjustanica"
                            value=""
                            disabled
                            selected
                          >
                            Izaberite medjustanica
                          </option>
                          {stanice.map((stanica) => {
                            return (
                              <option
                                className="medjustanica"
                                key={stanica}
                                value={stanica}
                              >
                                {stanica}
                              </option>
                            );
                          })}
                        </select>
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part13">
                              Vreme dolaska
                            </Trans>
                          </label>
                        </div>

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
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part150">
                              {/* bilo je vreme polaska  */}
                              Vreme odlaska (polaska)
                            </Trans>
                          </label>
                        </div>
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
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part7">
                              Datum polaska
                            </Trans>
                          </label>
                        </div>

                        <input
                          /*  defaultValue={linija.datumPolaska} */
                          name="datumPolaskaM"
                          type="date"
                          className="input-stanica"
                          min={today}
                          onChange={(e) =>
                            adminLogic.handlerMedjustanice(e, index)
                          }
                        />
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part9">
                              Datum dolaska
                            </Trans>
                          </label>
                        </div>

                        <input
                          /*  defaultValue={linija.datumPolaska} */
                          name="datumDolaskaM"
                          type="date"
                          className="input-stanica"
                          min={today}
                          onChange={(e) =>
                            adminLogic.handlerMedjustanice(e, index)
                          }
                        />
                        <div>
                          <button
                            type="button"
                            className="buttonSwitch korekcijaDugmeta1"
                            onClick={() => removeWaypoint(index)}
                          >
                            Ukloni medjustanicu
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="red-05">
                    <button
                      type="button"
                      className="buttonSwitch korekcijaDugmeta"
                      onClick={() => duploDugmeMedjustanica()}
                    >
                      <Trans i18nKey="description.part151">
                        Dodaj usputnu stanicu{" "}
                      </Trans>
                    </button>
                  </div>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                    </label>
                  </div>

                  {/* bila je klasa u inputu inputText name1 input-new
                  style={{ fontSize: "1rem" }} */}

                  <input
                    /*  defaultValue={linija.vremeDolaska} */
                    className="input-stanica-vreme"
                    type="time"
                    required
                    name="vremeDolaska"
                    onChange={adminLogic.changeHandler}
                  ></input>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                    </label>
                  </div>

                  <select
                    name="krajnjaStanica"
                    className="input-stanica"
                    required
                    onChange={adminLogic.changeHandler}
                  >
                    <option className="medjustanica" value="" disabled selected>
                      Izaberite stanicu
                    </option>
                    {stanice.map((stanica) => {
                      return (
                        <option
                          className="medjustanica"
                          key={stanica}
                          value={stanica}
                        >
                          {stanica}
                        </option>
                      );
                    })}
                  </select>
                  <div className="red-05">
                    <label className="labela-stanica">Izaberite autobus</label>
                  </div>
                  <select
                    /*  value={linija.oznakaBusa} */
                    name="oznakaBusa"
                    required
                    className="odaberiBus"
                    onChange={adminLogic.changeHandler}
                  >
                    <option className="medjustanica" value="" disabled selected>
                      Izaberite autobus
                    </option>
                    {autobusi.map((autobusi) => {
                      return (
                        <option
                          className="medjustanica"
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
                  <ToastContainer />
                </div>
              </div>
            ) : (
              <div>
                <div className="naslovStanica">
                  <Trans i18nKey="description.part164">Edituj Liniju </Trans>
                </div>
                <div>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part3">Mesto polaska</Trans>
                    </label>
                  </div>

                  <select
                    name="pocetnaStanica"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  >
                    <option className="medjustanica">
                      {linija.pocetnaStanica?.naziv}
                    </option>
                    {stanice.map((stanica) => {
                      if (stanica !== linija.pocetnaStanica?.naziv) {
                        return (
                          <option
                            className="medjustanica"
                            key={stanica}
                            value={stanica}
                          >
                            {stanica}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part7">Datum polaska</Trans>
                    </label>
                  </div>

                  <input
                    defaultValue={state.datumPolaska}
                    name="datumPolaska"
                    type="date"
                    min={today}
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  />

                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part9">Datum dolaska</Trans>
                    </label>
                  </div>

                  <input
                    defaultValue={state.datumDolaska}
                    name="datumDolaska"
                    type="date"
                    min={today}
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  />

                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part11">Vreme polaska</Trans>
                    </label>
                  </div>

                  <input
                    defaultValue={state.vremePolaska}
                    className="input-stanica"
                    type="time"
                    required
                    name="vremePolaska"
                    onChange={adminLogic.changeHandler}
                  ></input>
                  <div>
                    {linija.Stanicas?.map((stanicas, index) => (
                      <div key={index}>
                        <div className="red-05">
                          <hr />
                        </div>
                        <div className="red-05">
                          <label className="labela-stanica">
                            <strong>
                              <Trans i18nKey="description.part165">
                                {" "}
                                Usputna stanica{" "}
                              </Trans>
                              {index + 1}
                            </strong>
                          </label>
                        </div>
                        <select
                          name="stanica"
                          className="edit-medjustanica"
                          onChange={(e) =>
                            adminLogic.handlerMedjustanice(e, index)
                          }
                          defaultValue={stanicas.naziv}
                        >
                          {stanice.map((stanica) => (
                            <option
                              key={stanica}
                              value={stanica}
                              selected={stanicas.naziv === stanica}
                            >
                              {stanica}
                            </option>
                          ))}
                        </select>
                        &emsp;&emsp;
                        {/* <label className="labela-stanica">
                       
                      </label> */}
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part13">
                              Vreme dolaska
                            </Trans>
                          </label>
                        </div>
                        <input
                          defaultValue={stanicas.Medjustanica.vremeDolaskaM}
                          className="input-stanica"
                          type="time"
                          required
                          label="Time"
                          name="vremeDolaskaM"
                          onChange={(e) =>
                            adminLogic.handlerMedjustanice(e, index)
                          }
                        ></input>
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part150">
                              Vreme odlaska (polaska)
                            </Trans>
                          </label>
                        </div>
                        <input
                          defaultValue={stanicas.Medjustanica.vremePolaskaM}
                          className="input-stanica"
                          type="time"
                          required
                          label="Time"
                          name="vremePolaskaM"
                          onChange={(e) =>
                            adminLogic.handlerMedjustanice(e, index)
                          }
                        ></input>
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part7">
                              Datum polaska
                            </Trans>
                          </label>
                        </div>
                        <input
                          defaultValue={stanicas.Medjustanica.datumPolaskaM}
                          name="datumPolaskaM"
                          type="date"
                          className="input-stanica"
                          onChange={(e) =>
                            adminLogic.handlerMedjustanice(e, index)
                          }
                        />
                        <div className="red-05">
                          <label className="labela-stanica">
                            <Trans i18nKey="description.part7">
                              Datum dolaska
                            </Trans>
                          </label>
                        </div>
                        <input
                          defaultValue={stanicas.Medjustanica.datumDolaskaM}
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
                  <div className="red-1"></div>
                  {waypoints.map((waypoint, index) => (
                    <div key={najveciRedosled + 1}>
                      <div className="red-05">
                        <hr />
                      </div>
                      <div className="red-05">
                        <label className="labela-stanica">
                          <strong>
                            <Trans i18nKey="description.part165">
                              {" "}
                              Usputna stanica{" "}
                            </Trans>
                            {najveciRedosled + 1}
                          </strong>
                        </label>
                      </div>
                      <select
                        name="stanica"
                        className="edit-medjustanica"
                        /* value={medjustanica.stanica} */
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, najveciRedosled)
                        }
                      >
                        <option disabled selected>
                          Izaberite medjustanicu
                        </option>
                        {stanice.map((stanica) => {
                          return (
                            <option key={stanica} value={stanica}>
                              {stanica}
                            </option>
                          );
                        })}
                      </select>
                      &emsp;&emsp;
                      {/* <label className="labela-stanica">
                       
                      </label> */}
                      <div className="red-05">
                        <label className="labela-stanica">
                          <Trans i18nKey="description.part150">
                            Vreme odlaska (polaska)
                          </Trans>
                        </label>
                      </div>
                      <input
                        /* defaultValue={linija.vremePolaska} */
                        className="input-stanica"
                        type="time"
                        required
                        label="Time"
                        name="vremePolaskaM"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, najveciRedosled)
                        }
                      ></input>
                      <div className="red-05">
                        <label className="labela-stanica">
                          <Trans i18nKey="description.part13">
                            Vreme dolaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        /* defaultValue={linija.vremePolaska} */
                        className="input-stanica"
                        type="time"
                        required
                        label="Time"
                        name="vremeDolaskaM"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, najveciRedosled)
                        }
                      ></input>
                      <div className="red-05">
                        <label className="labela-stanica">
                          <Trans i18nKey="description.part7">
                            Datum polaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        /*  defaultValue={linija.datumPolaska} */
                        name="datumPolaskaM"
                        type="date"
                        className="input-stanica"
                        min={today}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, najveciRedosled)
                        }
                      />
                      <div className="red-05">
                        <label className="labela-stanica">
                          <Trans i18nKey="description.part7">
                            Datum dolaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        /*  defaultValue={linija.datumPolaska} */
                        name="datumDolaskaM"
                        type="date"
                        className="input-stanica"
                        min={today}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, najveciRedosled)
                        }
                      />
                      <div>
                        <button
                          type="button"
                          className="buttonSwitch korekcijaDugmeta2"
                          onClick={() => removeWaypoint(index)}
                        >
                          Ukloni medjustanicu
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="red-1">
                    <button
                      type="button"
                      className="buttonSwitch korekcijaDugmeta"
                      onClick={duploDugmeMedjustanica}
                    >
                      <Trans i18nKey="description.part151">
                        Dodaj usputnu stanicu{" "}
                      </Trans>
                    </button>
                  </div>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                    </label>
                  </div>

                  <input
                    defaultValue={state.vremeDolaska}
                    className="input-stanica"
                    type="time"
                    required
                    name="vremeDolaska"
                    onChange={adminLogic.changeHandler}
                  ></input>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                    </label>
                  </div>

                  <select
                    name="krajnjaStanica"
                    className="input-stanica"
                    onChange={adminLogic.changeHandler}
                  >
                    <option className="medjustanica">
                      {linija.krajnjaStanica?.naziv}
                    </option>
                    {stanice.map((stanica) => {
                      if (stanica !== linija.krajnjaStanica?.naziv) {
                        return (
                          <option
                            className="medjustanica"
                            key={stanica}
                            value={stanica}
                          >
                            {stanica}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                  <div className="red-05">
                    <label className="labela-stanica">
                      <Trans i18nKey="description.part166">
                        Izaberite autobus{" "}
                      </Trans>
                    </label>
                  </div>

                  <select
                    defaultValue={state.oznakaBusa}
                    name="oznakaBusa"
                    onChange={adminLogic.changeHandler}
                  >
                    <option className="medjustanica">{state.oznakaBusa}</option>
                    {autobusi.map((autobus) => {
                      // Izuzmi trenutnu vrednost iz liste opcija
                      if (autobus.oznakaBusa !== state.oznakaBusa) {
                        return (
                          <option
                            className="medjustanica"
                            key={autobus.oznakaBusa}
                            value={autobus.oznakaBusa}
                          >
                            {autobus.oznakaBusa}
                          </option>
                        );
                      }
                      return null; // Preskoči trenutnu vrednost
                    })}
                  </select>
                  <div className="red-1"></div>
                  {/* ------------------------------    */}
                  <div>
                    <div className="pisi-levo">
                      <div className="red-05">
                        <label className="labela-stanica">
                          <Trans i18nKey="description.part168">
                            Izaberite vozača{" "}
                          </Trans>
                        </label>
                      </div>
                      <div className="red-05">
                        <label className="labela-stanica">
                          <Trans i18nKey="description.part167">
                            Izaberite stjuardesu{" "}
                          </Trans>
                        </label>
                      </div>
                    </div>

                    <div className="pisi-desno">
                      <div className="red-05">
                        <select
                          value={adminLogic.selectedVozac}
                          name="vozac"
                          onChange={adminLogic.changeHandler}
                        >
                          {vozac.map((korisnik) => (
                            <option
                              key={korisnik.idKorisnik}
                              value={korisnik.idKorisnik}
                            >
                              {korisnik.ime} {korisnik.prezime}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="red-05">
                        <select
                          value={adminLogic.selectedStjuardesa}
                          name="stjuardesa"
                          onChange={adminLogic.changeHandler}
                        >
                          {stjuardesa.map((korisnik) => (
                            <option
                              key={korisnik.idKorisnik}
                              value={korisnik.idKorisnik}
                            >
                              {korisnik.ime} {korisnik.prezime}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="red-1">
                    <button type="submit" className="buttonSwitch">
                      {" "}
                      {/* bilo je button    */}
                      {mode === "add" ? (
                        <Trans i18nKey="description.part128">"Dodaj"</Trans>
                      ) : (
                        <Trans i18nKey="description.part129">"Sačuvaj"</Trans>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}{" "}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LineForm;
