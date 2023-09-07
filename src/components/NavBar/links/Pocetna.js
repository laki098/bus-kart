import React, { useState, useEffect } from "react";
import LinijeApi from "../../../api/linije.api";
import "./pocetna.css";
import helpers from "../../../helpers/helpers";
import { Link } from "react-router-dom";
import bus1 from "../../images/bus1.jpg";
import bus2 from "../../images/bus2.jpg";

import "./i18n"; // za prevodjenje
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

import { useMediaQuery } from "react-responsive"; // responsive
import MediaQuery from "react-responsive";

const Pocetna = () => {
  //prevodjenje
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

  const isDesktop = useMediaQuery({ minWidth: 1092 }); //za responsive bilo 992,   1092
  const isDesktopSmall = useMediaQuery({ minWidth: 920 });
  const isTablet = useMediaQuery({ minWidth: 600, maxWidth: 991 });
  const isSmallTablet = useMediaQuery({ minWidth: 481, maxWidth: 599 });
  const isMobile = useMediaQuery({ maxWidth: 480 });

  const [filteredLinije, setFilteredLinije] = useState([]);
  const [valueDate, setValueDate] = useState("");
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [stanice, setStanice] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bus1, bus2];
  const [showClass, setShowClass] = useState(false);

  const filterLinija = async () => {
    if (!valueDate) return;
    const response = await LinijeApi().filterLinija(val1, val2, valueDate);

    const data = await response.json();
    setFilteredLinije(data.rezultat);
  };

  const getStanice = async () => {
    const response = await fetch("http://localhost:5000/stanica");
    const data = await response.json();

    const a1 = data.stanice.map((item) => {
      return { naziv: item.naziv, id: item.id };
    });

    const a2 = a1 //
      .map((item) => item.naziv) //Uradjen filter da se u selektu ne ponavljaju linije
      .filter(helpers.filterUnique);

    setStanice(a2);
    setVal1(a2[0]);
    setVal2(a2[1]);
  };

  useEffect(() => {
    getStanice(); //?Prilikom ucitavanja stranice da pozove funkciju get stanice
  }, []);

  const click = () => {
    if (!stanice.includes(val2) || !stanice.includes(val1)) {
      //?provera da li stanice sadrze tu vrednost
      //?zamena mesta polja mesto dolaska i mesto polaska
      return;
    }
    setVal1(val2);
    setVal2(val1);
  };

  const changer = () => {
    setShowClass(!showClass);
  };

  const clickBait = (event) => {
    filterLinija();
    changer();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Promijeni slajd na sledeći
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000); // Promjena slike svakih 5 sekundi

    return () => {
      clearInterval(interval); // Očisti interval kad se komponenta unmountuje
    };
  }, []);

  let showDate = new Date();
  let displayTodaysDate =
    showDate.getDate() +
    "/" +
    (showDate.getMonth() + 1) +
    "/" +
    showDate.getFullYear;

  const vremePuta = (linija) => {
    const datumPolaska = new Date(linija.datumPolaska);
    const vremePolaska = linija.vremePolaska.split(":");

    datumPolaska.setHours(vremePolaska[0]);
    datumPolaska.setMinutes(vremePolaska[1]);

    const datumDolaska = new Date(linija.datumDolaska);
    const vremeDolaska = linija.vremeDolaska.split(":");
    datumDolaska.setHours(vremeDolaska[0]);
    datumDolaska.setMinutes(vremeDolaska[1]);

    const vremePuta = Math.abs(datumDolaska.getTime() - datumPolaska.getTime());

    const minuti = Math.floor((vremePuta % (1000 * 60 * 60)) / (1000 * 60));
    const sati = Math.floor(vremePuta / (1000 * 60 * 60));

    if (sati < 1) {
      return `${minuti} min`;
    } else {
      const sati1 = `${sati}h`;
      const min = `${minuti}m`;
      return [sati1, min].join(" : ");
    }
  };

  return (
    <div>
      <header>
        <div style={{ textAlign: "right", marginRight: "3rem" }}>
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

      {isDesktop && (
        <div className="home-page">
          <h2 className="h2-card">
            <i className="fa fa-bus"></i>
            <span className="span">
              <Trans i18nKey="description.part30"> Pronađite liniju </Trans>
            </span>
          </h2>
          <div className="travel-look">
            <div className="form">
              <label className="labela">
                <Trans i18nKey="description.part31"> Polazna stanica </Trans>
              </label>
              <select
                className=" box-title"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
              >
                {stanice.map((linija) => {
                  return (
                    <option key={linija} value={linija}>
                      {linija}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form">
              <button
                className="fa-solid fa-repeat buttonSwitch "
                onClick={click}
              ></button>
            </div>
            <div className="form">
              <label className="labela">
                <Trans i18nKey="description.part32"> Dolazna stanica </Trans>
              </label>
              <select
                className="box-title"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
              >
                {stanice.map((linija) => {
                  if (val1 != linija) {
                    return (
                      <option key={linija} value={linija}>
                        {linija}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className="form">
              <label className="labela">
                <Trans i18nKey="description.part33"> Datum polaska </Trans>
              </label>
              <div className="input-date">
                <input
                  type="date"
                  className="dates"
                  value={valueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setValueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="form-button">
              <button onClick={clickBait} className="buttonSwitch">
                <Trans i18nKey="description.part34"> Red vožnje </Trans>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isDesktop && (
        <div className="home-page">
          <h2 className="h2-card">
            <i className="fa fa-bus"></i>
            <span className="span">
              <Trans i18nKey="description.part30"> Pronađite liniju </Trans>
            </span>
          </h2>
          <div>
            <div className="form">
              <label className="labela">
                <Trans i18nKey="description.part31"> Polazna stanica </Trans>
              </label>
              <select
                className=" box-title1"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
              >
                {stanice.map((linija) => {
                  return (
                    <option key={linija} value={linija}>
                      {linija}
                    </option>
                  );
                })}
              </select>
            </div>
            <br />
            <div className="form">
              <button
                className="fa-solid fa-repeat buttonSwitch "
                onClick={click}
              ></button>
            </div>
            <br />
            <div className="form">
              <label className="labela">
                <Trans i18nKey="description.part32"> Dolazna stanica </Trans>
              </label>
              <select
                className="box-title1"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
              >
                {stanice.map((linija) => {
                  if (val1 != linija) {
                    return (
                      <option key={linija} value={linija}>
                        {linija}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <br />
            <div className="form">
              <label className="labela">
                <Trans i18nKey="description.part33"> Datum polaska </Trans>
              </label>
              <div className="input-date">
                <input
                  type="date"
                  /*className="dates"   */
                  className="box-title1"
                  value={valueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setValueDate(e.target.value)}
                />
              </div>
            </div>
            <br />
            <div
              className="form-button"
              style={{ justifyContent: "center", fontWeight: "bolder" }}
            >
              <button onClick={clickBait} className="buttonSwitch">
                <Trans i18nKey="description.part34"> Red vožnje </Trans>
              </button>
            </div>
          </div>
        </div>
      )}

      <ul>
        <div className={`home-page1 .home-page1 ${showClass ? "show" : ""}`}>
          {" "}
          {/*kada se pretisne dugme otvorit se nov div sa ispisanim podacima*/}
          <style>{`
            .home-page1 {
              display: none;
            }
            .show {
              display: block;
            }
          `}</style>
          <h2 className="card-header">
            <i className="fa-solid fa-bus"></i>
            <span className="span">
              <Trans i18nKey="description.part34"> Red vožnje </Trans>
            </span>
          </h2>
          {isDesktop && (
            <div className="scroll">
              {filteredLinije.map((linija) => {
                return (
                  <li key={linija.id}>
                    <div className="travel">
                      <div className="operator"> {linija.prevoznik}</div>
                      <div className="start">
                        <span className="start-time">
                          {" "}
                          {linija.vremePolaska}
                        </span>
                        <div className="start-destination">
                          {" "}
                          {linija.pocetnaStanica}{" "}
                        </div>
                      </div>

                      <div className="travel-time">
                        <div className="time">
                          {/* {linija.vremeDolaska - linija.vremePolaska} */}
                          {vremePuta(linija)}
                        </div>
                        <div className="time-line"></div>
                        <div className="space">
                          <Trans i18nKey="description.part36">
                            Broj mesta:
                          </Trans>
                          :{linija.brojSlobodnihMesta}
                        </div>
                      </div>

                      <div className="end">
                        <div className="end-destination">
                          {" "}
                          {linija.krajnjaStanica}
                        </div>
                        <span className="end-time"> {linija.vremeDolaska}</span>
                      </div>
                      <div>
                        <Link to={`${linija.id}/rezervacijakarte`}>
                          <button
                            className="buttonSwitch1"
                            style={{ fontSize: "1rem" }}
                          >
                            <Trans i18nKey="description.part35">
                              {" "}
                              Rezerviši{" "}
                            </Trans>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </div>
          )}
          {!isDesktop && (
            <div className="scroll">
              {filteredLinije.map((linija) => {
                return (
                  <li key={linija.id}>
                    <div className="travel1">
                      {" "}
                      {/* izbrisala klasu travel*/}
                      <br />
                      <div
                        style={{
                          fontStyle: "inherit",
                          color: "darkblue",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {" "}
                        {linija.prevoznik}
                      </div>{" "}
                      {/*className="operator"*/}
                      <div className="start">
                        <div className="start-destination">
                          {" "}
                          {linija.pocetnaStanica}{" "}
                        </div>
                        <span className="start-time">
                          {" "}
                          {linija.vremePolaska}
                        </span>
                      </div>
                      <div className="travel-time">
                        <div className="time">
                          {/* {linija.vremeDolaska - linija.vremePolaska} */}
                          {vremePuta(linija)}
                        </div>
                        <div className="time-line"></div>
                        <div className="space">
                          <Trans i18nKey="description.part36">Broj mesta</Trans>
                          :{linija.brojSlobodnihMesta}
                        </div>
                      </div>
                      <div className="end">
                        <div className="end-destination">
                          {" "}
                          {linija.krajnjaStanica}
                        </div>
                        <span className="end-time"> {linija.vremeDolaska}</span>
                      </div>
                      <div>
                        <Link to={`${linija.id}/rezervacijakarte`}>
                          <button
                            className="buttonSwitch1"
                            style={{ marginLeft: "-1rem" }}
                          >
                            <Trans i18nKey="description.part35">
                              Rezerviši
                            </Trans>
                          </button>
                        </Link>
                      </div>
                      <br />
                      <br />
                    </div>
                    <br />
                    <br />
                  </li>
                );
              })}
            </div>
          )}
        </div>
      </ul>
      <div className="bus-container">
        <img
          src={slides[currentSlide]}
          alt="Slideshow"
          className="bus-image"
          style={{ height: "auto", opacity: "130%" }}
        />
      </div>
    </div>
  );
};

export default Pocetna;
