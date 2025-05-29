import React, { useState, useEffect } from "react";
import LinijeApi from "../../api/linije.api";
import BiletarApi from "../../api/biletarApi";
import RezervacijaApi from "../../api/rezervacijaApi";
import "../NavBar/links/pocetna.css";
import "./biletar.css";
import helpers from "../../helpers/helpers";
import { Link, useLocation } from "react-router-dom";
import "../NavBar/links/i18n"; // za prevodjenje
import "../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import { useMediaQuery } from "react-responsive"; // responsive
import apiUrl from "../../apiConfig";
import Autobus from "../rezervacije/sedista/autobus";
import { ToastContainer, toast } from "react-toastify";

import LanguageSwitcher from "../header/header";

const BiletarRezervacijaComponent = (state) => {
  console.log(state);
  // Prevođenje
  const lngs = {
    en: { nativeName: "En" },
    sr: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();

  // Responsive
  const isDesktop = useMediaQuery({ minWidth: 1092 });
  const isDesktopSmall = useMediaQuery({ minWidth: 920 });
  const isTablet = useMediaQuery({ minWidth: 600, maxWidth: 991 });
  const isSmallTablet = useMediaQuery({ minWidth: 481, maxWidth: 599 });
  const isMobile = useMediaQuery({ maxWidth: 480 });

  // State
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [valueDate, setValueDate] = useState([]);
  const [valueTime, setValueTime] = useState([]);
  const [val1, setVal1] = useState([]);
  const [val2, setVal2] = useState([]);
  const [stanice, setStanice] = useState([]);
  const [showClass, setShowClass] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [autobus, setAutobus] = useState([]);
  const [returnDate, setReturnDate] = useState(Date);
  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([]);
  const [checkedItemId, setCheckedItemId] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isConfirmationOpenC, setIsConfirmationOpenC] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null); // Dodajte stanje za pratnju izabranog sedišta
  const [imePrezime, setImePrezime] = useState("");
  const [email, setEmail] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [tipKarte, setTipKarte] = useState("");
  const [linijaidC, setLinijaidC] = useState();
  const [rezervacijaIdC, setRezervacijaIdC] = useState();
  const [PovratnaIdLinija, setPovratnaIdLinija] = useState();
  const [pomPolazak, setPomPolazak] = useState(""); // da rese ispad kad se promeni datum kod povratne karte
  const [pomDolazak, setPomDolazak] = useState("");
  const [filteredLinijePovratna, setFilteredLinijePovratna] = useState([]);
  const [pomDatDolazak, setPomDatDolazak] = useState("");
  const [pomDateRet, setPomDateRet] = useState("");

  const handleCheckboxChange = (id) => {
    setCheckedItemId(id);
  };

  //?ovo dole omogucava da imam citanje povratne linije
  const filterLinijaPovratna = async () => {
    if (!returnDate) return;
    const response = await LinijeApi().filterLinija(val2, val1, returnDate);
    const data = await response.json();
    setFilteredLinijePovratna(data.rezultat);
  };

  useEffect(() => {
    filterLinijaPovratna();
  }, [returnDate]);

  //? Izvlači cookie 'userData'
  const userDataCookie = helpers.getCookie("userData");

  /* //? cuvanje podataka u localStorage
  useEffect(() => {
    localStorage.setItem("pocetnaStanica", val1);
  }, [val1]);
  useEffect(() => {
    localStorage.setItem("krajnjaStanica", val2);
  }, [val2]);
  useEffect(() => {
    localStorage.setItem("datumPolaska", valueDate);
  }, [valueDate]);
  useEffect(() => {
    localStorage.setItem("vremePolaska", valueTime);
  }, [valueTime]); */

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

  // Funkcija za filtriranje linija
  const filterLinija = async () => {
    if (!state.state.datumPolaska) return;

    try {
      const { rezultat } = await BiletarApi().filterLinijaa(
        state.state.pocetnaStanica,
        state.state.krajnjaStanica,
        state.state.datumPolaska,
        state.state.vremePolaska
      );

      console.log(rezultat);

      const currentDateTime = new Date();

      // Filtriraj rezultate da uključuju samo linije koje su u budućnosti
      const filteredResults = rezultat.filter((linija) => {
        const polazakDateTime = new Date(
          `${linija.datumPolaska}T${linija.vremePolaska}`
        );
        return polazakDateTime > currentDateTime;
      });

      setFilteredLinije(filteredResults);

      if (filteredResults.length > 0) {
        // Pretpostavljam da uzimaš podatke iz prve linije u filteredResults
        const firstLine = filteredResults[0];

        // Pretpostavimo da iz firstLine uzimaš oznakuBusa
        const responseBus = await fetch(
          `${apiUrl}/autobusi/oznaka/${firstLine.oznakaBusa}`
        );
        const dataBus = await responseBus.json();
        setAutobus(dataBus.autobusi);
      }
    } catch (error) {
      console.error("Greška prilikom filtriranja linija:", error);
    }
  };

  //? Funkcija za dobijanje stanica
  const getStanice = async () => {
    const response = await fetch(`${apiUrl}/stanica`);
    const data = await response.json();

    const a1 = data.stanice.map((item) => {
      return { naziv: item.naziv, id: item.id };
    });

    const a2 = a1 //
      .map((item) => item.naziv)
      .filter(helpers.filterUnique);

    setStanice(a2);
    localStorage.getItem("pocetnaStanica")
      ? setVal1(localStorage.getItem("pocetnaStanica"))
      : setVal1(a2[0]);
    localStorage.getItem("krajnjaStanica")
      ? setVal2(localStorage.getItem("krajnjaStanica"))
      : setVal2(a2[1]);
  };

  //? useEffect za inicijalizaciju
  /* useEffect(() => {
    localStorage.getItem("datumPolaska")
      ? setValueDate(localStorage.getItem("datumPolaska"))
      : setValueDate(today);
    getStanice();
  }, []); */

  //? useEffect za automatsko filtriranje kada se promeni vrednost
  useEffect(() => {
    filterLinija();
  }, [val1, val2, valueDate, valueTime]);

  const click = () => {
    if (!stanice.includes(val2) || !stanice.includes(val1)) {
      return;
    }
    setVal1(val2);
    setVal2(val1);
  };

  const changer = () => {
    setShowClass(!showClass);
  };

  //?nova rezervacija
  const novaRezervacija = () => {
    BiletarApi()
      .rezervacijaBiletar(
        1,
        filteredLinije[0].pocetnaStanica,
        filteredLinije[0].krajnjaStanica,
        filteredLinije[0].datumPolaska,
        filteredLinije[0].datumDolaska,
        filteredLinije[0].vremePolaska,
        filteredLinije[0].vremeDolaska,
        filteredLinije[0].id,
        filteredLinije[0].pocetnaStanicaId,
        filteredLinije[0].krajnjaStanicaId,
        userDataCookie.idKorisnika,
        "",
        selectedSeat,
        tipKarte,

        email,
        imePrezime,
        brojTelefona
      )
      .then((response) => {
        if (tipKarte != "povratna") {
          notifySuccest();
          closeModal();
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
        notifyWarn();
      });
    if (tipKarte == "povratna") {
      BiletarApi()
        .rezervacijaBiletar(
          1,
          filteredLinije[0].krajnjaStanica,
          filteredLinije[0].pocetnaStanica,
          returnDate,
          pomDatDolazak,
          pomPolazak,
          pomDolazak,
          PovratnaIdLinija,
          filteredLinije[0].krajnjaStanicaId,
          filteredLinije[0].pocetnaStanicaId,
          userDataCookie.idKorisnika,
          "",
          selectedSeat,
          tipKarte,

          email,
          imePrezime,
          brojTelefona
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
    }
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

  // Formatiranje datuma
  const formatDate = (datum, vreme) => {
    const fullDate = new Date(`${datum}T${vreme}`); // Kombinovanje datuma i vremena u jedan Date objekat
    const day = fullDate.getDate(); // Dan
    const month = fullDate.getMonth() + 1; // Mesec (počinje od 0, pa dodajemo 1)
    const year = fullDate.getFullYear(); // Godina

    const hours = fullDate.getHours(); // Sati
    const minutes = fullDate.getMinutes(); // Minuti

    // Formatiran datum i vreme
    return `${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year}, ${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };

  return (
    <>
      <div class="trip-info">
        <div class="trip-details">
          <span class="station">
            Početna stanica: <strong>{state.state.pocetnaStanica}</strong>
          </span>
          <span class="station">
            Krajnja stanica: <strong>{state.state.krajnjaStanica}</strong>
          </span>
          <span class="time">
            Datum i vreme polaska:{" "}
            <strong>
              {formatDate(state.state.datumPolaska, state.state.vremePolaska)}
            </strong>
          </span>
        </div>
      </div>
      <div>
        <LanguageSwitcher lngs={lngs} i18n={i18n} />
      </div>

      {filteredLinije.length > 0 &&
        filteredLinije.map((linija) => (
          <Autobus
            key={linija.id}
            autobusData={autobus}
            linijaId={linija.id}
            pocetnaStanicaId={linija.pocetnaStanicaId}
            krajnjaStanicaId={linija.krajnjaStanicaId}
            updateTrenutnaRezervacija={(novaRezervacija) =>
              setTrenutnaRezervacija(novaRezervacija)
            }
            openModalC={openModalC}
            openModal={openModal}
          />
        ))}
      {/* {/* Modalni prozor */}
      {isConfirmationOpenC && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2> Otkazivanje karte za sediste: {selectedSeat}</h2>
            <div>
              <button type="potvrdi" onClick={() => {}}>
                Otkazivanje karte
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
            <h2> Nova Rezervacija za sediste: {selectedSeat}</h2>
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
                Email putnika:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Broj telefona putnika:
                <input
                  type="text"
                  value={brojTelefona}
                  onChange={(e) => setBrojTelefona(e.target.value)}
                />
              </label>
              <label>
                Tip karte:
                <select
                  className="option"
                  value={tipKarte}
                  onChange={(e) => setTipKarte(e.target.value)}
                >
                  <option className="option" value="" disabled defaultValue>
                    Izaberi tip karte
                  </option>
                  <option className="option" value="jednosmerna">
                    Jednosmerna
                  </option>
                  <option className="option" value="povratna">
                    Povratna
                  </option>
                </select>
              </label>

              {/* Ovde dolazimo iz fajla karta.js u slucaju da je karta povratna 
              i zelimo rezervaciju sedista ili promenu datuma    */}
              {tipKarte == "povratna" && (
                <div className="ograda1">
                  <div>
                    <label htmlFor="returnDate">
                      <Trans i18nKey="description.part70">
                        {" "}
                        Datum povratka{" "}
                      </Trans>
                    </label>
                    &emsp; &ensp;
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      min={filteredLinije[0].datumDolaska}
                      onChange={(e) => {
                        e.persist();

                        setTimeout(() => setReturnDate(e.target.value), 0);
                      }}
                      onClick={() => {
                        setPomPolazak("");
                        setPomDolazak("");

                        setPomDatDolazak("");
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "left", paddingLeft: "2rem" }}>
                    <label>
                      <Trans i18nKey="description.part11">
                        {" "}
                        Vreme polaska{" "}
                      </Trans>
                    </label>
                  </div>

                  <div className="teget">
                    {/* Ovde formira podatke za povratnu kartu  */}
                    {returnDate !== null ? (
                      <div>
                        {filteredLinijePovratna
                          //ovim prikazujemo sortiranu listu u rastucem nizu u odnosu na vreme polaska
                          .sort((a, b) => {
                            // Konvertujemo vreme polaska u Date objekte
                            const timeA = new Date(
                              "1970-01-01T" + a.vremePolaska
                            );
                            const timeB = new Date(
                              "1970-01-01T" + b.vremePolaska
                            );
                            // Poredimo Date objekte
                            return timeA - timeB;
                          })

                          .map((linija) => (
                            <div>
                              <li key={linija.id}>
                                <label>
                                  {linija.vremePolaska} ---
                                  {linija.vremeDolaska}---
                                </label>
                                <input
                                  type="checkbox"
                                  value={linija.id}
                                  checked={checkedItemId === linija.id}
                                  onChange={() =>
                                    handleCheckboxChange(linija.id)
                                  }
                                  onClick={() => {
                                    setPovratnaIdLinija(linija.id);
                                    setPomPolazak(linija.vremePolaska);
                                    setPomDolazak(linija.vremeDolaska);
                                    setPomDatDolazak(linija.datumDolaska);
                                    setPomDateRet("povratna"); // sluzi kod dela gde pozivamo upis u bazu podataka u karti
                                    // setDatumDolaskaOdlazne(linija.datumDolaska);
                                  }}
                                />
                              </li>
                            </div>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                    <hr />
                    <Trans i18nKey="description.part212">
                      Odabrali ste polazak - dolazak (h):{" "}
                    </Trans>
                    <hr />
                    {pomPolazak}---{pomDolazak}
                  </div>
                </div>
              )}
              <div className="red-1"></div>

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
      <ToastContainer />
    </>
  );
};

export default BiletarRezervacijaComponent;
