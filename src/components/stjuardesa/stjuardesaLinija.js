import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import { useLocation } from "react-router-dom";
import Autobus from "../rezervacije/sedista/autobus";
import AdminLogic from "../admin/admin.logic";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import StjuardesaApi from "../../api/stjuardesaApi.js";

const StjuardesaLinija = ({}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [autobus, setAutobus] = useState([]);
  const [linija, setLinija] = useState([]);
  const [pocetnaStanica, setPocetnaStanica] = useState([]);
  const [krajnjaStanica, setKrajnjaStanica] = useState([]);

  //? dobavljanje liniju koja se koristi direktno ovde
  const dobavljanjeLinije = async () => {
    const response = await fetch(
      `http://localhost:5000/stjuardesa/filterLinija/${linijaId}`
    );
    const data = await response.json();
    setPocetnaStanica(data.izvlacenjeLinija.pocetnaStanica.naziv);
    setLinija(data.izvlacenjeLinija);
    setKrajnjaStanica(data.izvlacenjeLinija.krajnjaStanica.naziv);
  };

  //?primanje podataka sa stjuardese za baš odredjenu liniju
  const location = useLocation();
  const state = location.state;

  const linijaId = location.state.linija.id;

  //? dobavljanje autobusa koji je postavljen na toj liniji. kako bi prikayali sedista stjuardesi
  const dobavljanjeBrojaMesta = async () => {
    const response = await fetch(
      `http://localhost:5000/autobusi/oznaka/${state.linija.oznakaBusa}`
    );
    const data = await response.json();
    setAutobus(data.autobusi);
  };

  useEffect(() => {
    dobavljanjeLinije();
    dobavljanjeBrojaMesta();
  }, []);

  //?kada kliknemo dugme da otvori skenerQrCode
  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  //?kada skeniramo qrCode da se kamera sama zatvori
  const handleQRScanSuccess = (message) => {
    console.log("Uspešno skeniranje:", message);
    setShowQRScanner(false);
  };

  const stjuardesaApi = StjuardesaApi();

  //?promena vremena na medjustanici pocetak ili kraj rute
  const handelePromenaVremena = async (
    linijaId,
    redosled,
    promeniPocetakRute,
    promeniKrajRute
  ) => {
    const response = await stjuardesaApi.promenaVremena(
      linijaId,
      redosled,
      promeniPocetakRute,
      promeniKrajRute
    );
  };

  //?promena vremena na liniji pocetak ili kraj rute
  const handelePromenaVremenaLinija = async (
    linijaId,
    promeniPocetakRute,
    promeniKrajRute
  ) => {
    const response = await stjuardesaApi.promenaVremenaLinija(
      linijaId,
      promeniPocetakRute,
      promeniKrajRute
    );
  };

  //prevodjenje start
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <>
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
        <div className="labela-stanica labela-stanica-naslov red-1">
          <Trans i18nKey="description.part194"> Informacije o ruti </Trans>
        </div>
        <div className="stampajLiniju">
          <div className="rowTabela sirina-39">
            <div className="admin-jedan-red ">
              <div className="polje-stanica sirina-info-10">
                <Trans i18nKey="description.part31"> Početna stanica </Trans>
              </div>{" "}
              {/*  Polazna tačka    */}
              <div className="info-stanica sirina-info-10">
                {" "}
                {state.linija.pocetnaStanica.naziv}
              </div>
              <div className="polje-stanica sirina-info-8">
                <button
                  onClick={() => {
                    handelePromenaVremenaLinija(state.linija.id, true, false);
                  }}
                  className="buttonSwitch"
                >
                  <Trans i18nKey="description.part193"> Krenuli </Trans>
                </button>
              </div>
            </div>
            <div className="admin-jedan-red ">
              <div className="polje-stanica sirina-info-10">
                <Trans i18nKey="description.part32"> Dolazna stanica </Trans>{" "}
                {/*  Krajnja tačka   */}
              </div>
              <div className="info-stanica sirina-info-10">
                {" "}
                {state.linija.krajnjaStanica.naziv}
              </div>
              <div className="polje-stanica sirina-info-8">
                <button
                  onClick={() => {
                    handelePromenaVremenaLinija(state.linija.id, false, true);
                  }}
                  className="buttonSwitch"
                >
                  <Trans i18nKey="description.part192"> Stigli </Trans>
                </button>
              </div>
            </div>
            <div className="admin-jedan-red ">
              <div className="polje-stanica sirina-info-10">
                <Trans i18nKey="description.part191"> Međustanice </Trans>
              </div>
              <ul>
                {linija?.Stanicas?.map((stanica) => (
                  <div key={stanica.id}>
                    <div className="stampajLiniju">
                      <li className="info-stanica sirina-info-10">
                        {stanica.naziv}
                      </li>
                      <div className="polje-stanica sirina-info-8">
                        <button
                          onClick={() => {
                            handelePromenaVremena(
                              state.linija.id,
                              stanica.Medjustanica.redosled,
                              true,
                              false
                            );
                            setPocetnaStanica(stanica.naziv);
                          }}
                          className="buttonSwitch"
                        >
                          <Trans i18nKey="description.part193"> Krenuli </Trans>
                        </button>
                      </div>
                      <div className="polje-stanica sirina-info-8">
                        <button
                          onClick={() => {
                            handelePromenaVremena(
                              state.linija.id,
                              stanica.Medjustanica.redosled,
                              false,
                              true
                            );
                          }}
                          className="buttonSwitch"
                        >
                          <Trans i18nKey="description.part192"> Stigli </Trans>
                          
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p>Ruta:</p>
        <div>{pocetnaStanica} -</div> <div>{krajnjaStanica}</div>
      </div>

      <Autobus autobusData={autobus} />
      <div className="red-1"></div>
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          idLinije={state.linija.id}
        />
      )}

      {!showQRScanner && (
        <button onClick={handleQRScan} className="buttonSwitch">
          <p className="admin-dugme-slova">Skeniraj QR kod </p>
        </button>
      )}
    </>
  );
};

export default StjuardesaLinija;
