import React, { useState, useEffect, useRef } from "react";
import AdminLogic from "./admin.logic";
import LinijeApi from "../../api/linije.api";
import apiUrl from "../../apiConfig";

import "../login/loginStyle.css";
import "./lineForm.css"; // ⬅️ novi prefiksovani stil (ili dodaj u postojeći CSS)

import { useTranslation, Trans } from "react-i18next";
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import helpers from "../../helpers/helpers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageSwitcher from "../header/header";

const LineForm = ({ mode, id, state }) => {
  const [linija, setLinija] = useState([]);
  const adminLogic = AdminLogic();
  const [stanice, setStanice] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [autobusi, setAutobusi] = useState([]);
  const [vozac, setVozac] = useState([]);
  const [stjuardesa, setStjuardesa] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [selectedStations, setSelectedStations] = useState({
    pocetnaStanica: "",
    krajnjaStanica: "",
    medjustanice: [],
  });

  const [selected, setSelected] = useState([]);

  const getSelectedStations = () => {
    const { pocetnaStanica, krajnjaStanica, medjustanice } = selectedStations;
    return [pocetnaStanica, ...medjustanice, krajnjaStanica];
  };

  const vremePolaskaRef = useRef(null);
  const vremeDolaskaRef = useRef(null);
  const vremePolaskaMRef = useRef(null);
  const vremeDolaskaMRef = useRef(null);
  const datumPolaskaRef = useRef(null);
  const datumDolaskaRef = useRef(null);
  const datumPolaskaMRef = useRef(null);
  const datumDolaskaMRef = useRef(null);

  const getAutobusi = async () => {
    const response = await fetch(`${apiUrl}/autobusi`);
    const data = await response.json();
    const autobusi = data.autobusi.map((item) => ({
      oznakaBusa: item.oznakaBusa,
    }));
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
    const stanica = data.stanice.map((item) => ({ naziv: item.naziv }));
    const filterStanica = stanica
      .map((item) => item.naziv)
      .filter(helpers.filterUnique);
    setStanice(filterStanica);
  };

  const getKorisnici = async () => {
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
    setSelectedStations((prev) => ({
      ...prev,
      medjustanice: [...prev.medjustanice, ""],
    }));
    const updatedSelected = getSelectedStations();
    setSelected(updatedSelected);
  };
  const duploDugmeMedjustanica = () => {
    addWaypoint();
    adminLogic.dodajMedjustanicu();
  };

  const removeWaypoint = (index) => {
    const updatedWaypoints = [...waypoints];
    const updatedSelectedValues = [...selectedValues];
    updatedWaypoints.splice(index, 1);
    updatedSelectedValues.splice(index, 1);
    setWaypoints(updatedWaypoints);
    setSelectedValues(updatedSelectedValues);
    adminLogic.ukloniMedjustanicu(index);
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
        kola: formData.get("kola"),
      };
      adminLogic.editLinije(data, id);
    }
  };

  const handleWaypointChange = (e, index) => {
    const { value } = e.target;
    setSelectedStations((prev) => ({
      ...prev,
      medjustanice: prev.medjustanice.map((item, idx) =>
        idx === index ? value : item
      ),
    }));
  };

  const handleStartEndChange = (e) => {
    const { name, value } = e.target;
    setSelectedStations((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeVreme = () => {
    const vremePolaskaValue = vremePolaskaRef.current.value;
    const vremeDolaskaValue = vremeDolaskaRef.current.value;
    const vremePolaskaMValue = vremePolaskaMRef.current.value;
    const vremeDolaskaMValue = vremeDolaskaMRef.current.value;
    const datumPolaskaValue = datumPolaskaRef.current.value;
    const datumDolaskaValue = datumDolaskaRef.current.value;
    const datumPolaskaMValue = datumPolaskaMRef.current.value;
    const datumDolaskaMValue = datumDolaskaMRef.current.value;

    const datumPolaska = new Date(datumPolaskaValue);
    const datumDolaska = new Date(datumDolaskaValue);
    const datumPolaskaM = new Date(datumPolaskaMValue);
    const datumDolaskaM = new Date(datumDolaskaMValue);

    if (datumDolaskaM > datumPolaska) {
      if (vremeDolaskaMValue && vremeDolaskaMValue < vremePolaskaMValue) {
        notifyWarn(
          "Vreme dolaska medjustanice mora biti veće od vremena polaska!"
        );
        vremeDolaskaMRef.current.value = "";
        return;
      } else if (vremeDolaskaMValue && vremeDolaskaMValue > vremeDolaskaValue) {
        notifyWarn(
          "Vreme dolaska medjustanice ne može biti veće od krajnjeg vremena!"
        );
        vremeDolaskaMRef.current.value = "";
        return;
      } else if (vremePolaskaMValue > vremeDolaskaValue) {
        notifyWarn(
          "Početno vreme medjustanice ne može biti veće od krajnjeg vremena!"
        );
        vremePolaskaMRef.current.value = "";
        return;
      }
      return;
    }

    if (vremeDolaskaValue < vremeDolaskaMValue) {
      notifyWarn(
        "Vreme medjustanice nije u opsegu vremena polaska i dolaska.Izaberite ispravno vreme!!!"
      );
      vremeDolaskaMRef.current.value = "";
    }

    if (vremePolaskaValue > vremePolaskaMValue) {
      notifyWarn(
        "Vreme medjustanice nije u opsegu vremena polaska i dolaska.Izaberite ispravno vreme!!!"
      );
      vremePolaskaMRef.current.value = "";
    }

    if (vremeDolaskaMValue && vremeDolaskaMValue < vremePolaskaMValue) {
      notifyWarn("Vreme  dolaska medjustanice  mora biti vece od polaska!!!");
      vremeDolaskaMRef.current.value = "";
    }
  };

  const notifyWarn = (message) => {
    toast.warn(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  return (
    <div>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <div className="lineForm-card">
        <form onSubmit={submitHandler} className="lineForm-form">
          {mode === "add" ? (
            <div>
              <p className="lineForm-title">
                <Trans i18nKey="description.part130">Nova linija</Trans>
              </p>

              <div>
                <div>
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part3">Mesto polaska</Trans>
                  </label>
                </div>
                <div>
                  <select
                    name="pocetnaStanica"
                    className="lineForm-select"
                    onChange={(e) => {
                      adminLogic.changeHandler(e);
                      handleStartEndChange(e);
                    }}
                  >
                    <option
                      className="lineForm-option"
                      value=""
                      disabled
                      selected
                      required
                    >
                      Izaberite stanicu
                    </option>
                    {stanice.map((stanica) => (
                      <option
                        className="lineForm-option"
                        key={stanica}
                        value={stanica}
                        disabled={selected.includes(stanica)}
                      >
                        {stanica}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part7">Datum polaska</Trans>
                  </label>
                </div>
                <input
                  ref={datumPolaskaRef}
                  name="datumPolaska"
                  type="date"
                  required
                  className="lineForm-input"
                  min={today}
                  onChange={adminLogic.handlerDatumPolaska}
                />

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part11">Vreme polaska</Trans>
                  </label>
                </div>
                <input
                  ref={vremePolaskaRef}
                  className="lineForm-input lineForm-input--time"
                  type="time"
                  required
                  name="vremePolaska"
                  onChange={adminLogic.changeHandler}
                />

                <div className="lineForm-gapSm"></div>

                {/* MEĐUSTANICE */}
                <div className="lineForm-waypoints">
                  {waypoints.map((waypoint, index) => (
                    <div key={index}>
                      <div className="lineForm-gapLg">
                        <div className="lineForm-gapSm">
                          <hr />
                        </div>
                        <label className="lineForm-label">
                          <strong>
                            <Trans i18nKey="description.part165">
                              Usputna stanica
                            </Trans>
                            &nbsp;
                            {index + 1}
                          </strong>
                        </label>
                      </div>

                      <select
                        name="stanica"
                        className="lineForm-select"
                        onChange={(e) => {
                          adminLogic.handlerMedjustanice(e, index);
                          handleWaypointChange(e, index);
                        }}
                      >
                        <option
                          className="lineForm-option"
                          value=""
                          disabled
                          selected
                        >
                          Izaberite medjustanica
                        </option>
                        {stanice.map((stanica) => (
                          <option
                            className="lineForm-option"
                            key={stanica}
                            value={stanica}
                            disabled={selected.includes(stanica)}
                          >
                            {stanica}
                          </option>
                        ))}
                      </select>

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <Trans i18nKey="description.part7">
                            Datum polaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        ref={datumPolaskaMRef}
                        name="datumPolaskaM"
                        type="date"
                        className="lineForm-input"
                        min={today}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <Trans i18nKey="description.part9">
                            Datum dolaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        ref={datumDolaskaMRef}
                        name="datumDolaskaM"
                        type="date"
                        className="lineForm-input"
                        min={today}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <Trans i18nKey="description.part13">
                            Vreme dolaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        ref={vremePolaskaMRef}
                        className="lineForm-input"
                        type="time"
                        required
                        label="Time"
                        name="vremeDolaskaM"
                        onChange={(e) => {
                          adminLogic.handlerMedjustanice(e, index);
                          handleChangeVreme();
                        }}
                      />

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <Trans i18nKey="description.part150">
                            Vreme odlaska (polaska)
                          </Trans>
                        </label>
                      </div>
                      <input
                        ref={vremeDolaskaMRef}
                        className="lineForm-input"
                        type="time"
                        required
                        label="Time"
                        name="vremePolaskaM"
                        onChange={(e) => {
                          adminLogic.handlerMedjustanice(e, index);
                          handleChangeVreme();
                        }}
                      />

                      <div>
                        <button
                          type="button"
                          className="lineForm-button lineForm-button--danger"
                          onClick={() => removeWaypoint(index)}
                        >
                          <Trans i18nKey="description.part221">
                            Ukloni međustanicu
                          </Trans>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lineForm-gapSm">
                  <button
                    type="button"
                    className="lineForm-button lineForm-button--secondary"
                    onClick={duploDugmeMedjustanica}
                  >
                    <Trans i18nKey="description.part151">
                      Dodaj usputnu stanicu
                    </Trans>
                  </button>
                </div>

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part9">Datum dolaska</Trans>
                  </label>
                </div>
                <input
                  ref={datumDolaskaRef}
                  name="datumDolaska"
                  type="date"
                  required
                  className="lineForm-input"
                  min={today}
                  onChange={adminLogic.handlerDatumDolaska}
                />

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                  </label>
                </div>
                <input
                  ref={vremeDolaskaRef}
                  className="lineForm-input lineForm-input--time"
                  type="time"
                  required
                  name="vremeDolaska"
                  onChange={adminLogic.changeHandler}
                />

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                  </label>
                </div>
                <select
                  name="krajnjaStanica"
                  className="lineForm-select"
                  required
                  onChange={(e) => {
                    adminLogic.changeHandler(e);
                    handleStartEndChange(e);
                  }}
                >
                  <option
                    className="lineForm-option"
                    value=""
                    disabled
                    selected
                  >
                    Izaberite stanicu
                  </option>
                  {stanice.map((stanica) => (
                    <option
                      className="lineForm-option"
                      key={stanica}
                      value={stanica}
                      disabled={selected.includes(stanica)}
                    >
                      {stanica}
                    </option>
                  ))}
                </select>

                <div className="lineForm-row">
                  <select
                    className="lineForm-select"
                    type="text"
                    name="kola"
                    onChange={adminLogic.changeHandler}
                  >
                    <option disabled={false} value="">
                      <Trans>Izaberite kola </Trans>
                    </option>
                    <option>
                      <Trans>Kola 1</Trans>
                    </option>
                    <option>
                      <Trans>Kola 2</Trans>
                    </option>
                    <option>
                      <Trans>Kola 3</Trans>
                    </option>
                    <option>
                      <Trans>Kola 4</Trans>
                    </option>
                  </select>
                </div>

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">Izaberite autobus</label>
                </div>
                <select
                  name="oznakaBusa"
                  required
                  className="lineForm-select lineForm-select--bus"
                  onChange={adminLogic.changeHandler}
                >
                  <option
                    className="lineForm-option"
                    value=""
                    disabled
                    selected
                  >
                    Izaberite autobus
                  </option>
                  {autobusi.map((autobusi) => (
                    <option
                      className="lineForm-option"
                      key={autobusi.oznakaBusa}
                      value={autobusi.oznakaBusa}
                    >
                      {autobusi.oznakaBusa}
                    </option>
                  ))}
                </select>

                <div className="lineForm-gapLg"></div>
                <button
                  type="submit"
                  className="lineForm-button lineForm-button--primary"
                >
                  <Trans i18nKey="description.part128">Dodaj</Trans>
                </button>
                <ToastContainer />
              </div>
            </div>
          ) : (
            <div>
              <div className="lineForm-title">
                <Trans i18nKey="description.part164">Edituj Liniju</Trans>
              </div>

              <div>
                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part3">Mesto polaska</Trans>
                  </label>
                </div>
                <select
                  name="pocetnaStanica"
                  className="lineForm-select"
                  onChange={adminLogic.changeHandler}
                >
                  <option className="lineForm-option">
                    {linija.pocetnaStanica?.naziv}
                  </option>
                  {stanice.map((stanica) => {
                    if (stanica !== linija.pocetnaStanica?.naziv) {
                      return (
                        <option
                          className="lineForm-option"
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

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part7">Datum polaska</Trans>
                  </label>
                </div>
                <input
                  defaultValue={state.datumPolaska}
                  name="datumPolaska"
                  type="date"
                  min={today}
                  className="lineForm-input"
                  onChange={adminLogic.changeHandler}
                />

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part11">Vreme polaska</Trans>
                  </label>
                </div>
                <input
                  defaultValue={linija.vremePolaska}
                  className="lineForm-input"
                  type="time"
                  required
                  name="vremePolaska"
                  onChange={adminLogic.changeHandler}
                />

                <div>
                  {linija.Stanicas?.map((stanicas, index) => (
                    <div key={index}>
                      <div className="lineForm-gapSm">
                        <hr />
                      </div>
                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <strong>
                            <Trans i18nKey="description.part165">
                              Usputna stanica
                            </Trans>{" "}
                            {index + 1}
                          </strong>
                        </label>
                      </div>
                      <select
                        name="stanica"
                        className="lineForm-select lineForm-select--edit"
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

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">Datum dolaska</label>
                      </div>
                      <input
                        defaultValue={stanicas.Medjustanica.datumDolaskaM}
                        name="datumDolaskaM"
                        type="date"
                        className="lineForm-input"
                        min={today}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <Trans i18nKey="description.part13">
                            Vreme dolaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        defaultValue={stanicas.Medjustanica.vremeDolaskaM}
                        className="lineForm-input"
                        type="time"
                        required
                        label="Time"
                        name="vremeDolaskaM"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <Trans i18nKey="description.part7">
                            Datum polaska
                          </Trans>
                        </label>
                      </div>
                      <input
                        defaultValue={stanicas.Medjustanica.datumPolaskaM}
                        name="datumPolaskaM"
                        type="date"
                        className="lineForm-input"
                        min={today}
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />

                      <div className="lineForm-gapSm">
                        <label className="lineForm-label">
                          <Trans i18nKey="description.part150">
                            Vreme odlaska (polaska)
                          </Trans>
                        </label>
                      </div>
                      <input
                        defaultValue={stanicas.Medjustanica.vremePolaskaM}
                        className="lineForm-input"
                        type="time"
                        required
                        label="Time"
                        name="vremePolaskaM"
                        onChange={(e) =>
                          adminLogic.handlerMedjustanice(e, index)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="lineForm-gapLg"></div>

                {waypoints.map((waypoint, index) => (
                  <div key={linija.Stanicas.length + index}>
                    <div className="lineForm-gapSm">
                      <hr />
                    </div>
                    <div className="lineForm-gapSm">
                      <label className="lineForm-label">
                        <strong>
                          <Trans i18nKey="description.part165">
                            Usputna stanica
                          </Trans>
                          {linija.Stanicas.length + index + 1}
                        </strong>
                      </label>
                    </div>
                    <select
                      name="stanica"
                      className="lineForm-select lineForm-select--edit"
                      onChange={(e) =>
                        adminLogic.handlerMedjustanice(
                          e,
                          linija.Stanicas.length + index
                        )
                      }
                    >
                      <option disabled selected>
                        Izaberite medjustanicu
                      </option>
                      {stanice.map((stanica) => (
                        <option key={stanica} value={stanica}>
                          {stanica}
                        </option>
                      ))}
                    </select>

                    <div className="lineForm-gapSm">
                      <label className="lineForm-label">
                        <Trans i18nKey="description.part9">Datum dolaska</Trans>
                      </label>
                    </div>
                    <input
                      name="datumDolaskaM"
                      type="date"
                      className="lineForm-input"
                      min={today}
                      onChange={(e) =>
                        adminLogic.handlerMedjustanice(
                          e,
                          linija.Stanicas.length + index
                        )
                      }
                    />

                    <div className="lineForm-gapSm">
                      <label className="lineForm-label">
                        <Trans i18nKey="description.part13">
                          Vreme dolaska
                        </Trans>
                      </label>
                    </div>
                    <input
                      className="lineForm-input"
                      type="time"
                      required
                      label="Time"
                      name="vremeDolaskaM"
                      onChange={(e) =>
                        adminLogic.handlerMedjustanice(
                          e,
                          linija.Stanicas.length + index
                        )
                      }
                    />

                    <div className="lineForm-gapSm">
                      <label className="lineForm-label">
                        <Trans i18nKey="description.part7">Datum polaska</Trans>
                      </label>
                    </div>
                    <input
                      name="datumPolaskaM"
                      type="date"
                      className="lineForm-input"
                      min={today}
                      onChange={(e) =>
                        adminLogic.handlerMedjustanice(
                          e,
                          linija.Stanicas.length + index
                        )
                      }
                    />

                    <div className="lineForm-gapSm">
                      <label className="lineForm-label">
                        <Trans i18nKey="description.part150">
                          Vreme odlaska (polaska)
                        </Trans>
                      </label>
                    </div>
                    <input
                      className="lineForm-input"
                      type="time"
                      required
                      label="Time"
                      name="vremePolaskaM"
                      onChange={(e) =>
                        adminLogic.handlerMedjustanice(
                          e,
                          linija.Stanicas.length + index
                        )
                      }
                    />

                    <div>
                      <button
                        type="button"
                        className="lineForm-button lineForm-button--danger"
                        onClick={() => removeWaypoint(index)}
                      >
                        <Trans i18nKey="description.part221">
                          Ukloni međustanicu
                        </Trans>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="lineForm-gapLg">
                  <button
                    type="button"
                    className="lineForm-button lineForm-button--secondary"
                    onClick={duploDugmeMedjustanica}
                  >
                    <Trans i18nKey="description.part151">
                      Dodaj usputnu stanicu
                    </Trans>
                  </button>
                </div>

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part9">Datum dolaska</Trans>
                  </label>
                </div>
                <input
                  defaultValue={state.datumDolaska}
                  name="datumDolaska"
                  type="date"
                  min={today}
                  className="lineForm-input"
                  onChange={adminLogic.changeHandler}
                />

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                  </label>
                </div>
                <input
                  defaultValue={linija.vremeDolaska}
                  className="lineForm-input"
                  type="time"
                  required
                  name="vremeDolaska"
                  onChange={adminLogic.changeHandler}
                />

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                  </label>
                </div>
                <select
                  name="krajnjaStanica"
                  className="lineForm-select"
                  onChange={adminLogic.changeHandler}
                >
                  <option className="lineForm-option">
                    {linija.krajnjaStanica?.naziv}
                  </option>
                  {stanice.map((stanica) => {
                    if (stanica !== linija.krajnjaStanica?.naziv) {
                      return (
                        <option
                          className="lineForm-option"
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

                <div className="lineForm-gapSm">
                  <label className="lineForm-label">
                    <Trans i18nKey="description.part166">
                      Izaberite autobus
                    </Trans>
                  </label>
                </div>
                <select
                  defaultValue={state.oznakaBusa}
                  name="oznakaBusa"
                  onChange={adminLogic.changeHandler}
                  className="lineForm-select lineForm-select--bus"
                >
                  <option className="lineForm-option">
                    {state.oznakaBusa}
                  </option>
                  {autobusi.map((autobus) => {
                    if (autobus.oznakaBusa !== state.oznakaBusa) {
                      return (
                        <option
                          className="lineForm-option"
                          key={autobus.oznakaBusa}
                          value={autobus.oznakaBusa}
                        >
                          {autobus.oznakaBusa}
                        </option>
                      );
                    }
                    return null;
                  })}
                </select>

                <div className="lineForm-gapLg"></div>

                <div className="lineForm-twocol">
                  <div className="lineForm-colLeft">
                    <div className="lineForm-gapSm">
                      <label className="lineForm-label">
                        <Trans i18nKey="description.part168">
                          Izaberite vozača
                        </Trans>
                      </label>
                    </div>
                    <div className="lineForm-gapSm">
                      <label className="lineForm-label">
                        <Trans i18nKey="description.part167">
                          Izaberite broj kola
                        </Trans>
                      </label>
                    </div>
                  </div>

                  <div className="lineForm-colRight">
                    <div className="lineForm-gapSm">
                      <select
                        value={adminLogic.selectedVozac}
                        name="vozac"
                        onChange={adminLogic.changeHandler}
                        className="lineForm-select"
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

                    <div className="lineForm-gapSm">
                      <select
                        value={adminLogic.selectedStjuardesa}
                        name="stjuardesa"
                        onChange={adminLogic.changeHandler}
                        className="lineForm-select"
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

                <div className="lineForm-row">
                  <select
                    defaultValue={state.kola}
                    className="lineForm-select"
                    type="text"
                    name="kola"
                    onChange={adminLogic.changeHandler}
                  >
                    <option disabled={true} value="">
                      <Trans>Izaberite kola </Trans>
                    </option>
                    <option value="Kola 1">
                      <Trans>Kola 1</Trans>
                    </option>
                    <option value="Kola 2">
                      <Trans>Kola 2</Trans>
                    </option>
                    <option value="Kola 3">
                      <Trans>Kola 3</Trans>
                    </option>
                    <option value="Kola 4">
                      <Trans>Kola 4</Trans>
                    </option>
                  </select>
                </div>

                <div className="lineForm-gapLg">
                  <button
                    type="submit"
                    className="lineForm-button lineForm-button--primary"
                  >
                    {mode === "add" ? (
                      <Trans i18nKey="description.part128">Dodaj</Trans>
                    ) : (
                      <Trans i18nKey="description.part129">Sačuvaj</Trans>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LineForm;
