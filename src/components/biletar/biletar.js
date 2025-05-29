import React, { useState, useEffect } from "react";
import LinijeApi from "../../api/linije.api";
import BiletarApi from "../../api/biletarApi";
import RezervacijaApi from "../../api/rezervacijaApi";
import "../NavBar/links/pocetna.css";
import helpers from "../../helpers/helpers";
import { Link } from "react-router-dom";
import "../NavBar/links/i18n"; // za prevodjenje
import "../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import { useMediaQuery } from "react-responsive"; // responsive
import apiUrl from "../../apiConfig";
import Autobus from "../rezervacije/sedista/autobus";
import { ToastContainer, toast } from "react-toastify";
import LanguageSwitcher from "../header/header";

const Biletar = () => {
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
  const [valueDate, setValueDate] = useState(
    localStorage.getItem("datumPolaska")
  );

  const [valueTime, setValueTime] = useState(
    localStorage.getItem("vremePolaska")
  );
  const [val1, setVal1] = useState(localStorage.getItem("pocetnaStanica"));
  const [val2, setVal2] = useState(localStorage.getItem("krajnjaStanica"));
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

  //? cuvanje podataka u localStorage
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
  }, [valueTime]);

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
    if (!valueDate) return;

    try {
      const { rezultat } = await BiletarApi().filterLinija(
        val1,
        val2,
        valueDate,
        valueTime
      );

      const currentDateTime = new Date();

      const filteredResults = rezultat.filter((linija) => {
        const polazakDateTime = new Date(
          `${linija.datumPolaska}T${linija.vremePolaska}`
        );
        return polazakDateTime >= currentDateTime;
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
  useEffect(() => {
    localStorage.getItem("datumPolaska")
      ? setValueDate(localStorage.getItem("datumPolaska"))
      : setValueDate(today);
    getStanice();
  }, []);

  //? useEffect za automatsko filtriranje kada se promeni vrednost
  useEffect(() => {
    filterLinija();
    changer();
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
    setShowClass(true);
  };

  const vremePuta = (linija) => {
    if (
      !linija ||
      !linija.datumPolaska ||
      !linija.vremePolaska ||
      !linija.datumDolaska ||
      !linija.vremeDolaska
    ) {
      console.error("Nedostaju podaci za liniju:", linija);
      return "Nepoznato vreme";
    }

    const datumPolaska = new Date(linija.datumPolaska);
    const vremePolaska = linija.vremePolaska.split(":");

    if (vremePolaska.length < 2) {
      console.error("Neispravan format vremena polaska:", linija.vremePolaska);
      return "Nepoznato vreme";
    }

    datumPolaska.setHours(vremePolaska[0]);
    datumPolaska.setMinutes(vremePolaska[1]);

    const datumDolaska = new Date(linija.datumDolaska);
    const vremeDolaska = linija.vremeDolaska.split(":");

    if (vremeDolaska.length < 2) {
      console.error("Neispravan format vremena dolaska:", linija.vremeDolaska);
      return "Nepoznato vreme";
    }

    datumDolaska.setHours(vremeDolaska[0]);
    datumDolaska.setMinutes(vremeDolaska[1]);

    const vremePuta = Math.abs(datumDolaska.getTime() - datumPolaska.getTime());

    const minuti = Math.floor((vremePuta % (1000 * 60 * 60)) / (1000 * 60));
    const sati = Math.floor(vremePuta / (1000 * 60 * 60));

    if (sati < 1) {
      return `${minuti} min`;
    } else {
      return `${sati}h : ${minuti}m`;
    }
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

  return (
    <>
      <div>
        <LanguageSwitcher lngs={lngs} i18n={i18n} />

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
                className="box-title"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
              >
                {stanice.map((linija) => (
                  <option key={linija} value={linija}>
                    {linija}
                  </option>
                ))}
              </select>
            </div>
            <div className="form">
              <button
                className="fa-solid fa-repeat buttonSwitch buttonCenter"
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
                  if (val1 !== linija) {
                    return (
                      <option key={linija} value={linija}>
                        {linija}
                      </option>
                    );
                  }
                  return null;
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
                  value={valueDate || today}
                  min={today}
                  onChange={(e) => setValueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="form hidden">
              <button
                className="fa-solid fa-repeat buttonSwitch buttonCenter"
                onClick={click}
              ></button>
            </div>
          </div>
        </div>
      </div>

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
              {filteredLinije.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "1.2rem",
                    color: "red",
                  }}
                >
                  <Trans>Nema pronađenih linija</Trans>
                </div>
              ) : (
                filteredLinije.map((linija) => {
                  return (
                    <li key={linija.id}>
                      <div className="travel">
                        <div className="operator">{linija.prevoznik}</div>
                        <div className="start">
                          <span className="start-time">
                            {linija.vremePolaska.substring(0, 5)}
                          </span>
                          <div className="start-destination">
                            {linija.pocetnaStanica}
                          </div>
                        </div>
                        <div className="travel-time">
                          <div className="time">{vremePuta(linija)}</div>
                          <div className="time-line"></div>
                          <div className="space">
                            <Trans i18nKey="description.part36">
                              Broj mesta:
                            </Trans>
                            {linija.brojSlobodnihMesta}
                          </div>
                        </div>
                        <div className="end">
                          <div className="end-destination">
                            {linija.krajnjaStanica}
                          </div>
                          <span className="end-time">
                            {linija.vremeDolaska.substring(0, 5)}
                          </span>
                        </div>
                        <div>
                          <Link
                            to={{
                              pathname: `${linija.id}/biletarRezervacija`,
                              state: {
                                id: linija.id,
                                vremePolaska: linija.vremePolaska,
                                pocetnaStanica: linija.pocetnaStanica,
                                pocetnaStanicaId: linija.pocetnaStanicaId,
                                krajnjaStanicaId: linija.krajnjaStanicaId,
                                brojSlobodnihMesta: linija.brojSlobodnihMesta,
                                krajnjaStanica: linija.krajnjaStanica,
                                vremeDolaska: linija.vremeDolaska,
                                datumPolaska: linija.datumPolaska,
                                datumDolaska: linija.datumDolaska,
                                oznakaBusa: linija.oznakaBusa,
                              },
                            }}
                          >
                            <button className="buttonSwitch1">
                              <Trans i18nKey="description.part35">
                                Rezerviši
                              </Trans>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </div>
          )}
          {!isDesktop && (
            <div className="scroll">
              {filteredLinije.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "1.2rem",
                    color: "red",
                  }}
                >
                  <Trans>Nema pronađenih linija</Trans>
                </div>
              ) : (
                filteredLinije.map((linija) => {
                  return (
                    <li key={linija.id}>
                      <div className="travel1">
                        <div
                          style={{
                            fontStyle: "inherit",
                            color: "darkblue",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {linija.prevoznik}
                        </div>
                        <div className="start">
                          <div className="start-destination">
                            {linija.pocetnaStanica}
                          </div>
                          <span className="start-time">
                            {linija.vremePolaska}
                          </span>
                        </div>
                        <div className="travel-time">
                          <div className="time">{vremePuta(linija)}</div>
                          <div className="time-line"></div>
                          <div className="space">
                            <Trans i18nKey="description.part36">
                              Broj mesta:
                            </Trans>
                            {linija.brojSlobodnihMesta}
                          </div>
                        </div>
                        <div className="end">
                          <div className="end-destination">
                            {linija.krajnjaStanica}
                          </div>
                          <span className="end-time">
                            {linija.vremeDolaska}
                          </span>
                        </div>
                        <div>
                          <Link
                            to={{
                              pathname: `${linija.id}/biletarRezervacija`,
                              state: {
                                id: linija.id,
                                vremePolaska: linija.vremePolaska,
                                pocetnaStanica: linija.pocetnaStanica,
                                pocetnaStanicaId: linija.pocetnaStanicaId,
                                krajnjaStanicaId: linija.krajnjaStanicaId,
                                brojSlobodnihMesta: linija.brojSlobodnihMesta,
                                krajnjaStanica: linija.krajnjaStanica,
                                vremeDolaska: linija.vremeDolaska,
                                datumPolaska: linija.datumPolaska,
                                datumDolaska: linija.datumDolaska,
                                oznakaBusa: linija.oznakaBusa,
                              },
                            }}
                          >
                            <button className="buttonSwitch1">
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
                })
              )}
            </div>
          )}
        </div>
      </ul>
      <ToastContainer />
    </>
  );
};

export default Biletar;
