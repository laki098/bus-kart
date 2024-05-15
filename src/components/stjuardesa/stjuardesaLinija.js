import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import { useLocation, useHistory } from "react-router-dom";
import Autobus from "../rezervacije/sedista/autobus";
import RezervacijaApi from "../../api/rezervacijaApi";
import LinijeApi from "../../api/linije.api.js";
import "./stjuard.css";

import { ToastContainer, toast } from "react-toastify";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import StjuardesaApi from "../../api/stjuardesaApi.js";
import apiUrl from "../../apiConfig.js";
import { getValueRange } from "react-calendar/dist/cjs/shared/dates.js";
import KartaApi from "../../api/karta.api.js";

const StjuardesaLinija = ({}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [autobus, setAutobus] = useState([]);
  const [linija, setLinija] = useState([]);
  const [pocetnaStanica, setPocetnaStanica] = useState([]);
  const [krajnjaStanica, setKrajnjaStanica] = useState([]);
  const [okidanje, setOkidanje] = useState([]);
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [mStanica, setMStanica] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isConfirmationOpenC, setIsConfirmationOpenC] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null); // Dodajte stanje za pratnju izabranog sedišta
  const [imePrezime, setImePrezime] = useState("");
  const [osvezenje, setOsvezenje] = useState("");
  const [linijaidC, setLinijaidC] = useState();
  const [rezervacijaIdC, setRezervacijaIdC] = useState();

  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([]);

  //? Funkcija za otvaranje modalnog prozora
  const openModal = (seat) => {
    setSelectedSeat(seat);
    setIsConfirmationOpen(true);
  };

  //? Funkcija za zatvaranje modalnog prozora
  const closeModal = () => {
    setIsConfirmationOpen(false);
  };

  //? Funkcija za otvaranje modalnog prozora
  const openModalC = (seat, rezervacijaId, linijaId) => {
    setLinijaidC(linijaId);
    setRezervacijaIdC(rezervacijaId);
    setSelectedSeat(seat);
    setIsConfirmationOpenC(true);
  };

  //? Funkcija za zatvaranje modalnog prozora
  const closeModalC = () => {
    setIsConfirmationOpenC(false);
  };

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
      `${apiUrl}/stjuardesa/filterLinija/${linijaId}`
    );
    const data = await response.json();
    /* setPocetnaStanica(data.izvlacenjeLinija.pocetnaStanica); */
    setLinija(data.izvlacenjeLinija);
    setKrajnjaStanica(data.izvlacenjeLinija.krajnjaStanica);
    setLinija(data.izvlacenjeLinija);
    // Izdvajanje i sortiranje medjustanica
    const medjustanice = data.izvlacenjeLinija.Stanicas.map((stanica) => {
      return {
        ...stanica,
        redosled: stanica.Medjustanica.redosled, // Dodavanje redosleda iz medjustanice
      };
    });

    medjustanice.sort((a, b) => a.redosled - b.redosled); // Sortiranje po redosledu

    setMStanica(medjustanice);

    const responseBus = await fetch(
      `${apiUrl}/autobusi/oznaka/${data.izvlacenjeLinija.oznakaBusa}`
    );
    const dataBus = await responseBus.json();
    setAutobus(dataBus.autobusi);
  };

  //? dobavljanje autobusa koji je postavljen na toj liniji. kako bi prikayali sedista stjuardesi
  const dobavljanjeBrojaMesta = async () => {
    const responsePocetnaStanica = await fetch(
      `${apiUrl}/stanica/${pocetnaStanicaId}`
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

  const kartaApi = KartaApi();

  //?cekiranje kada ima kartu
  const cekiranjeKarte = () => {
    kartaApi
      .cekiranjeKarte(rezervacijaIdC, linijaidC, linija.id)
      .then((response) => {
        console.log(response);
        notifySuccest();
        closeModalC();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        notifyWarn();
      });
  };

  const filterMedju = filteredLinije[0];
  //?novo cekiranje kada nema kartu
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
        osvezenje,
        selectedSeat
      )
      .then((response) => {
        console.log("---------1----------------------------------------");
        console.log(response);
        notifySuccest();
        closeModal();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        notifyWarn();
      });
  };
  const notifySuccest = () => {
    toast.success(
      <Trans i18nKey="description.part216">
        {" "}
        Uspešno ste rezervisali kartu{" "}
      </Trans>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };
  const notifyWarn = () => {
    toast.warn(
      <Trans i18nKey="description.part217"> Nisu uneti svi podaci </Trans>,
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
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
    en: { nativeName: "En" },
    sr: { nativeName: "Sr" },
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
              className="jezici-dugme-promena"
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
          <div className="rowTabela sirina-45">
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
              <div className="polje-stanica sirina-info-14">
                <button
                  onClick={() => {
                    handelePromenaVremenaLinija(linija.id, false, true);
                  }}
                  className="buttonSwitch"
                >
                  <Trans i18nKey="description.part192"> Stigli </Trans>
                </button>
                &emsp;
                <button
                  onClick={() => {
                    setKrajnjaStanica(linija.krajnjaStanica);
                    dodeljivanjeUrlDo(linija.krajnjaStanica);
                    setOkidanje(linija.krajnjaStanica);
                  }}
                  className="buttonSwitch"
                >
                  <Trans i18nKey="description.part218"> Izlazi </Trans>{" "}
                  {/* Dovde   */}
                </button>
              </div>
            </div>
            <div className="admin-jedan-red ">
              <div className="polje-stanica-1 sirina-info-10">
                <Trans i18nKey="description.part191"> Međustanice </Trans>
              </div>
              <ul>
                {mStanica?.map((stanica) => (
                  <div key={stanica.id}>
                    <div className="stampajLiniju">
                      <li className="info-stanica sirina-info-10">
                        {stanica.naziv}
                      </li>
                      <div className="polje-stanica-1 sirina-info-8">
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
                      <div className="polje-stanica sirina-info-14">
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
                        &emsp;
                        <button
                          onClick={() => {
                            setKrajnjaStanica(stanica);
                            dodeljivanjeUrlDo(stanica);
                            setOkidanje(stanica);
                          }}
                          className="buttonSwitch"
                        >
                          <Trans i18nKey="description.part218"> Izlazi </Trans>{" "}
                          {/* Dovde   */}
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

      <div className="red-1"></div>
      <div className="labela">
        <Trans i18nKey="description.part219"> Ruta </Trans>:{" "}
        {pocetnaStanica?.naziv} - {krajnjaStanica?.naziv}
      </div>
      <div className="labela">
        <Trans /* i18nKey="description.part219" */> Datum polaska rute </Trans>:{" "}
        {linija?.datumPolaska}
      </div>
      <div className="labela">
        <Trans /* i18nKey="description.part219" */> Vreme polaska rute </Trans>:{" "}
        {linija?.vremePolaska}
      </div>

      <Autobus
        autobusData={autobus}
        linijaId={linija.id}
        pocetnaStanicaId={pocetnaStanica.id}
        krajnjaStanicaId={krajnjaStanica.id}
        updateTrenutnaRezervacija={(novaRezervacija) =>
          setTrenutnaRezervacija(novaRezervacija)
        }
        openModalC={openModalC}
        openModal={openModal} // Prosleđivanje funkcije za otvaranje moda kao prop
      />
      {/* Modalni prozor */}
      {isConfirmationOpenC && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2> Čekiranje za sedište {selectedSeat}</h2>
            <div>
              <button type="potvrdi" onClick={cekiranjeKarte}>
                Čekiranje karte
              </button>
              <button type="odustani" onClick={closeModalC}>
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modalni prozor */}
      {isConfirmationOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2> Čekiranje za sedište {selectedSeat}</h2>
            <div>
              <label>
                Ime i prezime putnika:
                <input
                  type="text"
                  value={imePrezime}
                  onChange={(e) => setImePrezime(e.target.value)}
                />
              </label>
              <label>
                Osveženje:
                <select
                  className="option"
                  value={osvezenje}
                  onChange={(e) => setOsvezenje(e.target.value)}
                >
                  <option className="option" value="" disabled defaultValue>
                    Izaberi Osveženje
                  </option>
                  <option className="option" value="kafa">
                    Kafa
                  </option>
                  <option className="option" value="caj">
                    Čaj
                  </option>
                  <option className="option" value="sok">
                    Sok
                  </option>
                </select>
              </label>
              <button type="potvrdi" onClick={novaRezervacija}>
                Potvrdi
              </button>
              <button type="odustani" onClick={closeModal}>
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="red-1"></div>
      <button onClick={novaRezervacija} className="buttonSwitch">
        <Trans i18nKey="description.part121"> Potvrdite </Trans>
      </button>

      <div className="red-1"></div>
      {showQRScanner && (
        <QRScanner onScanSuccess={handleQRScanSuccess} idLinije={linija.id} />
      )}

      <div className="red-1"></div>
      {!showQRScanner && (
        <button onClick={handleQRScan} className="buttonSwitch">
          <p className="admin-dugme-slova">
            <Trans i18nKey="description.part220"> Skeniraj QR kod </Trans>
          </p>
        </button>
      )}
      <ToastContainer />
    </>
  );
};

export default StjuardesaLinija;
