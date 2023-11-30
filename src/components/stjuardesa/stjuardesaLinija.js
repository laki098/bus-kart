import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import { useLocation, useHistory } from "react-router-dom";
import Autobus from "../rezervacije/sedista/autobus";
import RezervacijaApi from "../../api/rezervacijaApi";
import LinijeApi from "../../api/linije.api.js";

import { ToastContainer, toast } from "react-toastify";
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
  const [okidanje, setOkidanje] = useState([]);
  const [filteredLinije, setFilteredLinije] = useState([]);

  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([]);

  console.log(trenutnaRezervacija);

  //? Pristupite celom query string-u
  const queryString = window.location.search;

  //? Kreirajte objekat sa vrednostima iz query string-a
  const queryParams = new URLSearchParams(queryString);

  //? Izvucite vrednost pocetnaStanicaId
  const linijaId = queryParams.get("linijaId");

  //? Izvucite vrednost pocetnaStanicaId
  const pocetnaStanicaId = queryParams.get("pocetnaStanicaId");

  //? Izvucite vrednost krajnjaStanicaId
  const krajnjaStanicaId = queryParams.get("krajnjaStanicaId");

  const location = useLocation();
  const history = useHistory();

  //? Dodeljivanje novog url
  const dodeljivanjeUrl = (stanica) => {
    const novaPocetnaStanicaId = stanica.id;

    //? Kreirajte objekat sa vrednostima iz trenutnog query string-a
    const queryParams = new URLSearchParams(location.search);

    //? Postavite novu vrednost za pocetnaStanicaId
    queryParams.set("pocetnaStanicaId", novaPocetnaStanicaId);

    //? Kreirajte novi URL sa ažuriranim query string-om
    const noviURL = `${location.pathname}?${queryParams.toString()}`;

    //? Postavite novi URL kako biste promenili adresu stranice
    history.push(noviURL);
  };
  //? Dodeljivanje novog url
  const dodeljivanjeUrlDo = (stanica) => {
    const novaKrajnjaStanicaId = stanica.id;

    //? Kreirajte objekat sa vrednostima iz trenutnog query string-a
    const queryParams = new URLSearchParams(location.search);

    //? Postavite novu vrednost za pocetnaStanicaId
    queryParams.set("krajnjaStanicaId", novaKrajnjaStanicaId);

    //? Kreirajte novi URL sa ažuriranim query string-om
    const noviURL = `${location.pathname}?${queryParams.toString()}`;

    //? Postavite novi URL kako biste promenili adresu stranice
    history.push(noviURL);
  };

  //? dobavljanje liniju koja se koristi direktno ovde
  const dobavljanjeLinije = async () => {
    const response = await fetch(
      `http://localhost:5000/stjuardesa/filterLinija/${linijaId}`
    );
    const data = await response.json();
    /* setPocetnaStanica(data.izvlacenjeLinija.pocetnaStanica); */
    setLinija(data.izvlacenjeLinija);
    setKrajnjaStanica(data.izvlacenjeLinija.krajnjaStanica);

    const responseBus = await fetch(
      `http://localhost:5000/autobusi/oznaka/${data.izvlacenjeLinija.oznakaBusa}`
    );
    const dataBus = await responseBus.json();
    setAutobus(dataBus.autobusi);
  };

  //? dobavljanje autobusa koji je postavljen na toj liniji. kako bi prikayali sedista stjuardesi
  const dobavljanjeBrojaMesta = async () => {
    const responsePocetnaStanica = await fetch(
      `http://localhost:5000/stanica/${pocetnaStanicaId}`
    );
    const dataPocetnaStanica = await responsePocetnaStanica.json();
    setPocetnaStanica(dataPocetnaStanica.stanica);
  };

  useEffect(() => {
    dobavljanjeBrojaMesta();
  }, [okidanje]);

  //?filtriram linuju za bas odredjena mesta
  const filterLinija = async () => {
    if (!linija.datumPolaska) return;
    if (!pocetnaStanica.naziv) return;
    if (!krajnjaStanica.naziv) return;
    if (!linija.id) return;
    const response = await LinijeApi().filterLinijaId(
      pocetnaStanica.naziv,
      krajnjaStanica.naziv,
      linija.datumPolaska,
      linija.id
    );

    const data = await response.json();

    setFilteredLinije(data.rezultat);
  };

  const filterMedju = filteredLinije[0];
  console.log(trenutnaRezervacija);

  //?novo cekiranje
  const novaRezervacija = () => {
    RezervacijaApi()
      .rezervacija(
        1,
        filterMedju.pocetnaStanica,
        filterMedju.krajnjaStanica,
        filterMedju.datumPolaska,
        filterMedju.datumDolaska,
        filterMedju.vremePolaska,
        filterMedju.vremeDolaska,
        filterMedju.id,
        filterMedju.pocetnaStanicaId,
        filterMedju.krajnjaStanicaId,
        3,
        "kafa",
        trenutnaRezervacija
      )
      .then((response) => {
        console.log(response);
        console.log("-------------------------------------------------");
        notifySuccest();
      })
      .catch((error) => {
        console.log(error);
        notifyWarn();
      });
  };
  const notifySuccest = () => {
    toast.success("Uspešno ste rezervisali kartu", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const notifyWarn = () => {
    toast.warn("Nisu uneti svi podaci", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  useEffect(() => {
    dobavljanjeLinije();
  }, []);
  useEffect(() => {
    filterLinija();
  }, [pocetnaStanica, krajnjaStanica, linija]);

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
                {linija.pocetnaStanica?.naziv}
              </div>
              <div className="polje-stanica sirina-info-8">
                <button
                  onClick={() => {
                    handelePromenaVremenaLinija(linija.id, true, false);
                    setPocetnaStanica(linija.pocetnaStanica);
                    dodeljivanjeUrl(linija.pocetnaStanica);
                    setOkidanje(linija.pocetnaStanica);
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
                {linija.krajnjaStanica?.naziv}
              </div>
              <div className="polje-stanica sirina-info-8">
                <button
                  onClick={() => {
                    handelePromenaVremenaLinija(linija.id, false, true);
                  }}
                  className="buttonSwitch"
                >
                  <Trans i18nKey="description.part192"> Stigli </Trans>
                </button>
                <button
                  onClick={() => {
                    setKrajnjaStanica(linija.krajnjaStanica);
                    dodeljivanjeUrlDo(linija.krajnjaStanica);
                    setOkidanje(linija.krajnjaStanica);
                  }}
                  className="buttonSwitch"
                >
                  <Trans /* i18nKey="description.part192" */> Dovde </Trans>
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
                              linija.id,
                              stanica.Medjustanica.redosled,
                              true,
                              false
                            );
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
                              linija.id,
                              stanica.Medjustanica.redosled,
                              false,
                              true
                            );
                            setPocetnaStanica(stanica);
                            dodeljivanjeUrl(stanica);
                            setOkidanje(stanica);
                          }}
                          className="buttonSwitch"
                        >
                          <Trans i18nKey="description.part192"> Stigli </Trans>
                        </button>
                        <button
                          onClick={() => {
                            setKrajnjaStanica(stanica);
                            dodeljivanjeUrlDo(stanica);
                            setOkidanje(stanica);
                          }}
                          className="buttonSwitch"
                        >
                          <Trans /* i18nKey="description.part192" */>
                            {" "}
                            Dovde{" "}
                          </Trans>
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
        <div>{pocetnaStanica?.naziv} -</div> <div>{krajnjaStanica?.naziv}</div>
      </div>

      <Autobus
        autobusData={autobus}
        linijaId={linija.id}
        pocetnaStanicaId={pocetnaStanica.id}
        krajnjaStanicaId={krajnjaStanica.id}
        updateTrenutnaRezervacija={(novaRezervacija) =>
          setTrenutnaRezervacija(novaRezervacija)
        }
      />
      <button onClick={novaRezervacija} className="buttonSwitch">
        Potvrdi izbor
      </button>

      <div className="red-1"></div>
      {showQRScanner && (
        <QRScanner onScanSuccess={handleQRScanSuccess} idLinije={linija.id} />
      )}

      {!showQRScanner && (
        <button onClick={handleQRScan} className="buttonSwitch">
          <p className="admin-dugme-slova">Skeniraj QR kod </p>
        </button>
      )}
      <ToastContainer />
    </>
  );
};

export default StjuardesaLinija;
