import { useRef, useState, useEffect } from "react";
import RezervacijaLogic from "./rezervacija.logic";
import classes from "../registration/registration.module.css";
import LinijeApi from "../../api/linije.api";
import cookies from "js-cookie";
import Slider from "../NavBar/links/slider/slider";
import apiUrl from "../../apiConfig";

import Qrcode from "./QrCode";
import "../rezervacije/index1.css";
import "./sedista/sedista.css";
import S2 from "../rezervacije/proba/s2";
import MAN from "./proba/man";
import VH from "./proba/vh";
import MB1 from "./proba/mb1";
import MB3 from "./proba/mb3";
import MB4 from "./proba/mb4";
import VL from "./proba/vl";
import S1 from "./proba/s1";
import RezervacijaApi from "../../api/rezervacijaApi";
import { ToastContainer, toast } from "react-toastify";
import "./i18n"; // za prevodjenje
import "./i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import { isVisible } from "@testing-library/user-event/dist/utils";

//import { PotvrdaContext } from '../NavBar/links/korisnik/karta';    // da onemoguci promenu tipa karte jer je ovo povratna karta

const RezervacijaComponent = ({ id, state }) => {
  // const [filteredLinije, setFilteredLinije] = useState([]);
  const [linija, setLinija] = useState({});
  const [brojSedista, setBrojSedista] = useState();

  // zbog povratne karte
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [returnDate, setReturnDate] = useState(Date);
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [checked, setChecked] = useState(false);
  const [PovratnaIdLinija, setPovratnaIdLinija] = useState();
  const [ceneFilter, setCeneFilter] = useState();
  const [tipKarte, setTipKarte] = useState("");

  const [izmeniPovratak, setIzmeniPovratak] = useState(false);
  const [email, setEmail] = useState();
  //const [clickedDugme, setClickedDugme] = useState(false);

  // const { potvrdaP } = useContext(PotvrdaContext);   //karta je povratna samo sediste odaberite i pice
  //console.log('Vrednost potvrdaP u RezervacijaKarte:', potvrdaP);

  //const { potvrdaP } = useContext(PotvrdaContext);
  {
    /*
  useEffect(() => {
    if (potvrdaP !== undefined) {
      console.log("RezervacijaComponent.js - potvrdaP:", potvrdaP);
    }else{
      console.log('potvradaP se jos nije postavila');
    }
  }, [potvrdaP]);
*/
  }

  //  console.log('Da li je povratna linija state.povrtana: ' +state.povratna);
  //  console.log('Da li je povratna linija state.povratnaPrikaz: ' +state.povratnaPrikaz);

  //? izvlacenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};

  if (userData != undefined) {
    userPars = JSON.parse(userData);
    if (!email) {
      setEmail(userPars.email);
    }
  }

  const cene = async () => {
    const response = await fetch(`${apiUrl}/cena/filterCena`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pocetnaStanica: state.pocetnaStanica,
        krajnjaStanicaR: state.krajnjaStanica,
        tipKarte: tipKarte,
      }),
    });
    const data = await response.json();
    setCeneFilter(data.cenaPovratne);
  };

  useEffect(() => {
    cene();
  }, [tipKarte]);
  {
    /*
  const filterLinija = async () => {
    if (!valueDate) return;
    const response = await LinijeApi().filterLinija(val1, val2, returnDate);

    const data = await response.json();

    console.log(data.rezultat);
    setFilteredLinije(data.rezultat);
  };
*/
  }

  const novaRezervacija = () => {
    RezervacijaApi()
      .rezervacija(
        1,
        state.pocetnaStanica,
        state.krajnjaStanica,
        state.datumPolaska,
        state.datumDolaska,
        state.vremePolaska,
        state.vremeDolaska,
        state.id,
        state.pocetnaStanicaId,
        state.krajnjaStanicaId,
        userPars.idKorisnika,

        osvezenje,
        parseInt(selectedSeats),
        tipKarte,
        email
      )
      .then((response) => {
        console.log(response);
        notifySuccest();
      })
      .catch((error) => {
        console.log(error);
        notifyWarn();
      });
  };

  const notifySuccest = () => {
    toast.success("UspeÅ¡no ste rezervisali kartu", {
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

  const rezervacija = async () => {
    const response = await LinijeApi().filterLinijaID(id);
    const data = await response.data.linija; // kako bi dobili vrednosti koje cemo koristiti za popuvanjavanje input polja
    /* let polazak = data.datumPolaska.split(",");
    let dolazak = data.datumDolaska.split(",");
    const linija = {
      ...data,
      datumPolaska: new Date(+polazak[0], +polazak[1] - 1, +polazak[2] + 1)
        .toISOString()
        .substr(0, 10),
      datumDolaska: new Date(+dolazak[0], +dolazak[1] - 1, +dolazak[2] + 1) //+ prebacuje u int iz stringa
        .toISOString()
        .substr(0, 10),
    }; */

    setLinija(data);
  };

  useEffect(() => {
    if (id) {
      rezervacija();
    }
  }, []);

  const [osvezenje, setOsvezenje] = useState("");

  const handleOsvezenje = (e) => {
    setOsvezenje(e.target.value);
  };

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleReservation = (selectedSeats) => {
    // Ovde moÅ¾ete izvrÅ¡iti akcije sa selektovanim sediÅ¡tima
    setSelectedSeats(selectedSeats);
    console.log("Selektovana sediÅ¡ta:", selectedSeats);
  };

  const [pom, setPom] = useState(false);
  const [pom1, setPom1] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const [showReturnDate, setShowReturnDate] = useState(false);

  // const [ticketPrice, setTicketPrice] = useState(0);

  let [formInputsValid, setFormInputsValid] = useState({
    name: true,
    mesto: true,
    mestoD: true,
    datum: true,
    datumD: true,
    vreme: true,
    vremeD: true,
    email: true,
    telefon: true,
  });
  const rezervacijaLogic = RezervacijaLogic();

  const fNameInputRef = useRef();
  const mestoInputRef = useRef();
  const mestoDInputRef = useRef();
  const datumInputRef = useRef();
  const datumDInputRef = useRef();
  const vremeInputRef = useRef();
  const vremeDInputRef = useRef();
  const emailInputRef = useRef();
  const telefonInputRef = useRef();

  const confirmeHandler = (event) => {
    event.preventDefault();

    const formValidation = rezervacijaLogic.formValidation(
      fNameInputRef,
      mestoInputRef,
      mestoDInputRef,
      datumInputRef,
      datumDInputRef,
      vremeInputRef,
      vremeDInputRef,
      emailInputRef,
      telefonInputRef
    );
    setFormInputsValid({
      name: formValidation.validName,
      mesto: formValidation.validMesto,
      mestoD: formValidation.validMestoD,
      datum: formValidation.validDatum,
      datumD: formValidation.validDatumD,
      vreme: formValidation.validVreme,
      vremeD: formValidation.validVremeD,
      email: formValidation.validEmail,
      telefon: formValidation.validTelefon,
    });
    if (!formValidation.isFormValid) {
      return;
    } else {
    }
  };

  //ovo dole omogucava da imam citanje povratne linije
  const filterLinija = async () => {
    if (!returnDate) return;
    setVal2(state.pocetnaStanica);
    setVal1(state.krajnjaStanica);
    const response = await LinijeApi().filterLinija(val1, val2, returnDate);
    const data = await response.json();
    setFilteredLinije(data.rezultat);
  };

  useEffect(() => {
    filterLinija();
  }, [returnDate]);

  // ovo se sigurno upotrebljava u prvom prolazu i to mi omogucava da samo jedna opcija bude check
  {
    /*
    const handleOptionClick = (option) => {
      setChecked(option === checked ? null : option);
    };
  */
  }
  const [sliderValue, setSliderValue] = useState(100);
  const NovaVrednost = 100;
  const handleNekePromene = () => {
    // Implementirajte logiku koja Ä‡e promeniti vrednost slidera kada preÄ‘ete na drugu stranicu
    setSliderValue(NovaVrednost); // Postavite novu vrednost prema potrebi
  };

  const [checkedItemId, setCheckedItemId] = useState(null);
  // const [error, setError] = useState(null);       // zbog obrade greske kod povratne karte

  const [pomPolazak, setPomPolazak] = useState(""); // da rese ispad kad se promeni datum kod povratne karte
  const [pomDolazak, setPomDolazak] = useState("");
  const [pomDatDolazak, setPomDatDolazak] = useState("");
  const [pomDatPolazak, setPomDatPolazak] = useState(""); // potreban kod edita povratne karte

  const [pomDateRet, setPomDateRet] = useState(""); //kod poziva dela za upis rezervacije na samom kraju

  const handleCheckboxChange = (id) => {
    setCheckedItemId(id);
  };

  const novaRezervacijaPovratak = () => {
    RezervacijaApi()
      .rezervacijaPovratna(
        1,
        state.krajnjaStanica,
        state.pocetnaStanica,
        returnDate,
        pomDatDolazak,
        pomPolazak,
        pomDolazak,
        PovratnaIdLinija,
        state.krajnjaStanicaId,
        state.pocetnaStanicaId,
        userPars.idKorisnika,

        osvezenje,
        parseInt(selectedSeats),
        tipKarte,
        email
      )
      .then((response) => {
        console.log(response);
        notifySuccest();
      })
      .catch((error) => {
        console.log(error);
        notifyWarn();
      });
  };

  // novaRezervacijaPovratakIzmena treba da upise izmenjenu povratnu kartu pice i sediste
  const novaRezervacijaPovratakIzmena = () => {
    RezervacijaApi()
      .rezervacijaPovratnaIzmena(
        1,
        state.krajnjaStanica, //citamo state ReadOnly
        state.pocetnaStanica, //citamo state ReadOnly
        pomDatPolazak, //korisnik promenio sa Fronta unosom novih podataka a bilo je returnDate,
        pomDatDolazak, //korisnik promenio sa Fronta unosom novih podataka
        pomPolazak, //korisnik promenio sa Fronta unosom novih podataka
        pomDolazak, //korisnik promenio sa Fronta unosom novih podataka
        PovratnaIdLinija,
        state.krajnjaStanicaId,
        state.pocetnaStanicaId,
        userPars.idKorisnika,

        osvezenje,
        parseInt(selectedSeats),
        tipKarte,
        email
      )
      .then((response) => {
        console.log(response);
        notifySuccest();
      })
      .catch((error) => {
        console.log(error);
        notifyWarn();
      });
  };

  const handleEmailInputChange = (event) => {
    const email = event.target.value;
    // Pozovite funkciju novaRezervacijaPovratak sa vrednošću email adrese
    setEmail(email);
  };

  //  upisujem podatke u bazu za obicnu kartu povratnu kartu i izmenjenu povratnu kartu
  const clickRezervisiPovratak = () => {
    if (pomDateRet == "") {
      novaRezervacija();
    } else if (pomDateRet == "povratna") {
      novaRezervacijaPovratak();
      novaRezervacija();
      //dodala za promenjeni povratak
      //novaRezervacijaPovratakIzmena();
    }

    /* // Prikazi poruku o rezervaciji (koristi alert, modal, ili neki drugi naÄin)
    alert("VaÅ¡a karta je uspeÅ¡no rezervisana!"); */

    // SaÄekaj nekoliko sekundi pre nego Å¡to se preusmeriÅ¡ na poÄetnu stranicu
    setTimeout(() => {
      window.location.href = "/pocetna";
    }, 10000); // Ova vrednost u milisekundama predstavlja koliko Ä‡e trajati prikazivanje poruke pre nego Å¡to se preusmeriÅ¡ (u ovom sluÄaju 1,5 sekunde)
  };

  //hocemo da menjamo povratnu liniju
  const newReturn = () => {
    setIzmeniPovratak(true);
    setReturnDate(Date); // da bih imala praznu listu kad krenem sa novim listanjem
  };

  // u povratnoj liniji ostaje po starom i vreme i datum
  const oldReturn = () => {
    setIzmeniPovratak(false);
    // Vrati staru vrednost u input polje za slucaj da je putnik vec nesto bio menjao
    vremeInputRef.current.value = state.vremePolaska;
    vremeDInputRef.current.value = state.vremeDolaska;
    datumInputRef.current.value = state.datumPolaska;
    datumDInputRef.current.value = state.datumDolaska;

    // da ne prikazuje predhodni izbor
    setReturnDate("");
    setPomPolazak("");
    setPomDolazak("");
  };

  // postavi novu vrednost u polje za vreme povratka
  const handleDaClick = () => {
    // Postavi novu vrednost u input polje
    vremeInputRef.current.value = pomPolazak;
    vremeDInputRef.current.value = pomDolazak;
    datumInputRef.current.value = pomDatPolazak;
    datumDInputRef.current.value = pomDatDolazak;
  };

  // vrati prvobitno odabrano vreme povratka
  const handleNeClick = () => {
    // Vrati staru vrednost u input polje
    vremeInputRef.current.value = state.vremePolaska;
    vremeDInputRef.current.value = state.vremeDolaska;
    datumInputRef.current.value = state.datumPolaska;
    datumDInputRef.current.value = state.datumDolaska;

    // da ne prikazuje predhodni izbor
    setReturnDate("");
    setPomPolazak("");
    setPomDolazak("");
  };

  useEffect(() => {
    // Inicijalno postavljanje vrednosti na null (prazan string)
    // ubacila da kad ucitam po prvi put formu da mi ne prikazuje podatke od prednodni put sto sam menjala
    setReturnDate("");
    setPomPolazak("");
    setPomDolazak("");
  }, []);

  //prevodjenje
  const lngs = {
    en: { nativeName: "En" },
    de: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

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
        <Slider value={sliderValue} />
      </div>
      <div className="red-1"></div>
      <form onSubmit={confirmeHandler} className="forma">
        {" "}
        <div>
          {" "}
          {/* className="flex-container"  */}
          <div className="flex-container">
            <div className="flex-clan">
              {" "}
              {/* levi deo sa prikazom podataka u formi */}
              <div className="red-1"></div>
              <div className="deoForme">
                <div className="levo">
                  <label className="labela-velika">
                    <Trans i18nKey="description.part178">Putnik </Trans>
                  </label>
                </div>
                <div className="red-1"></div>
                <div
                  className={`${classes.control} ${
                    formInputsValid.name ? "" : classes.invalid
                  }`}
                >
                  <label className="labela levo-23">
                    <Trans i18nKey="description.part1">Ime i prezime</Trans>
                  </label>
                  <input
                    className="test"
                    type="text"
                    name="ime"
                    value={
                      userPars.ime != undefined
                        ? userPars.ime + " " + userPars.prezime
                        : undefined
                    }
                    onChange={rezervacijaLogic.changeHandler}
                    ref={fNameInputRef}
                  />
                  {!formInputsValid.name && <p>Unesite ime i prezime</p>}
                </div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.email ? "" : classes.invalid
                  }`}
                >
                  <label className="labela levo-23">Email</label>
                  <input
                    type="text"
                    className="test"
                    name="email"
                    value={
                      userPars.email == undefined ? undefined : userPars.email
                    }
                    ref={emailInputRef}
                    onChange={(event) => {
                      rezervacijaLogic.changeHandler(event);
                      handleEmailInputChange(event);
                    }}
                  />
                  {!formInputsValid.email && <p>Unesite E-mail</p>}
                </div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.email ? "" : classes.invalid
                  }`}
                >
                  <label className="labela" style={{ paddingLeft: "2.3rem" }}>
                    <Trans i18nKey="description.part17">Telefon</Trans>
                  </label>
                  <input
                    type="text"
                    className="test"
                    name="telefon"
                    value={
                      userPars.brojTelefona == undefined
                        ? undefined
                        : userPars.brojTelefona
                    }
                    ref={telefonInputRef}
                    onChange={rezervacijaLogic.changeHandler}
                  />
                  {!formInputsValid.telefon && <p>Unesite telefon</p>}
                </div>
              </div>
              <div className="red-1"></div>
              <div className="deoForme">
                <div className="levo">
                  <label className="labela-velika">
                    <Trans i18nKey="description.part176">Linija </Trans>
                  </label>
                </div>
                <div className="red-1"></div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.mesto ? "" : classes.invalid
                  }`}
                >
                  <label className="labela levo-23">
                    <Trans i18nKey="description.part3">Mesto polaska</Trans>
                  </label>
                  <input
                    readOnly
                    defaultValue={state.pocetnaStanica}
                    className="test"
                    type="text"
                    name="mesto"
                    ref={mestoInputRef}
                    onChange={rezervacijaLogic.changeHandler}
                  />
                  {!formInputsValid.mesto && <p>Unesite mesto</p>}
                </div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.mesto ? "" : classes.invalid
                  }`}
                >
                  <label className="labela levo-23">
                    <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                  </label>
                  <input
                    readOnly
                    defaultValue={state.krajnjaStanica}
                    className="test"
                    type="text"
                    name="mestoD"
                    ref={mestoDInputRef}
                    onChange={rezervacijaLogic.changeHandler}
                  />
                  {!formInputsValid.mestoD && <p>Unesite mesto</p>}
                </div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.datum ? "" : classes.invalid
                  }`}
                >
                  <label className="labela levo-23">
                    <Trans i18nKey="description.part7">Datum polaska</Trans>
                  </label>

                  <input
                    defaultValue={state.datumPolaska}
                    className="test"
                    name="datum"
                    ref={datumInputRef}
                    onChange={rezervacijaLogic.changeHandler}
                  />

                  {!formInputsValid.datum && <p>Unesite datum</p>}
                </div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.datum ? "" : classes.invalid
                  }`}
                >
                  <label className="labela" style={{ paddingLeft: "2.3rem" }}>
                    <Trans i18nKey="description.part9">Datum dolaska</Trans>
                  </label>

                  <input
                    defaultValue={state.datumDolaska}
                    className="test"
                    name="datum"
                    ref={datumDInputRef}
                    onChange={rezervacijaLogic.changeHandler}
                  />

                  {!formInputsValid.datumD && <p>Unesite datum</p>}
                </div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.vreme ? "" : classes.invalid
                  }`}
                >
                  <label className="labela" style={{ paddingLeft: "2.3rem" }}>
                    <Trans i18nKey="description.part11">Vreme polaska</Trans>
                  </label>
                  <input
                    defaultValue={state.vremePolaska}
                    className="test"
                    name="vreme"
                    ref={vremeInputRef}
                    onChange={rezervacijaLogic.changeHandler}
                  />
                  {!formInputsValid.vreme && <p>Unesite vreme</p>}
                </div>

                <div
                  className={`${classes.control} ${
                    formInputsValid.vreme ? "" : classes.invalid
                  }`}
                >
                  <label className="labela levo-23">
                    <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                  </label>
                  <input
                    defaultValue={state.vremeDolaska}
                    className="test"
                    name="vremeD"
                    ref={vremeDInputRef}
                    onChange={rezervacijaLogic.changeHandler}
                  />
                  {!formInputsValid.vremeD && <p>Unesite vreme</p>}
                </div>
              </div>
              <div className="red-1"></div>
              <div className="deoForme sirina-3polja">
                <div className="levo">
                  <label className="labela-velika">
                    <Trans i18nKey="description.part177">Dodaci </Trans>
                  </label>
                </div>
                <div className="red-1"></div>

                <div className="radio">
                  <select
                    className="select"
                    type="text"
                    name="osvezenje"
                    value={osvezenje}
                    onChange={handleOsvezenje}
                  >
                    <option disabled={false} value="">
                      <Trans i18nKey="description.part19">
                        Izaberite osveženje{" "}
                      </Trans>
                    </option>
                    <option>
                      <Trans i18nKey="description.part21">Kafa</Trans>
                    </option>
                    <option>
                      <Trans i18nKey="description.part22">Čaj</Trans>
                    </option>
                    <option>Nes</option>
                  </select>
                </div>

                {/* Ovde dolazimo iz fajla karta.js u slucaju da je karta povratna 
              i zelimo rezervaciju sedista ili promenu datuma  */}
                {state.povratna ? (
                  <div>
                    <div className="red-1"></div>
                    <p className="teget">
                      Da li želite da promenite datum i vreme povratka
                    </p>
                    <div className="red-05"></div>
                    <button
                      onClick={newReturn}
                      className="promena-povratka animated-button"
                    >
                      Da
                    </button>
                    &ensp;
                    <button
                      onClick={oldReturn}
                      className="promena-povratka animated-button"
                    >
                      Ne
                    </button>
                    <div className="red-05"></div>
                    {/* dodajem deo u slucaju da putnik menja datum i vreme povratka    */}
                    {izmeniPovratak && (
                      <div>
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
                              //   value={returnDate || ''}    //da zadrzi vrednost koja je pre toga bila odabrana ili prikaze prazno ako nista nije odabirano
                              min={state.datumDolaska}
                              onChange={(e) => {
                                e.persist();

                                setTimeout(
                                  () => setReturnDate(e.target.value),
                                  0
                                );
                              }}
                              onClick={() => {
                                setPomPolazak("");
                                setPomDolazak("");
                                setPomDatPolazak(""); // ubaceno da bih imala podatak edit datuma povratka-polazak
                                setPomDatDolazak("");
                              }}
                            />
                          </div>
                          <div
                            style={{ textAlign: "left", paddingLeft: "2rem" }}
                          >
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
                                {filteredLinije.map((linija) => (
                                  <div>
                                    <li key={linija.id}>
                                      <label>
                                        {linija.vremePolaska} ---
                                        {linija.vremeDolaska}---
                                      </label>
                                      {/* polje gde biramo povratnu liniju  */}
                                      <input
                                        type="checkbox"
                                        value={linija.id}
                                        checked={checkedItemId === linija.id}
                                        onChange={() =>
                                          handleCheckboxChange(linija.id)
                                        }
                                        // na klik postavljamo odabrane vrednosti
                                        onClick={() => {
                                          setPovratnaIdLinija(linija.id);
                                          setPomPolazak(linija.vremePolaska);
                                          setPomDolazak(linija.vremeDolaska);
                                          setPomDatPolazak(linija.datumPolaska); // ubacila kod edita
                                          setPomDatDolazak(linija.datumDolaska);
                                          setPomDateRet("povratna"); // sluzi kod dela gde pozivamo upis u bazu podataka u karti
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
                            Odabrali ste polazak - dolazak (h):
                            <hr />
                            {pomPolazak}---{pomDolazak}
                            <br />
                            Da li želite da postavite nov povratak <br />
                            <button
                              onClick={handleDaClick}
                              className="promena-povratka animated-button"
                            >
                              Da
                            </button>{" "}
                            &emsp;
                            <button
                              onClick={handleNeClick}
                              className="promena-povratka animated-button"
                            >
                              Ne
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/*  kraj promene datuma povratka i vremena     */}
                  </div>
                ) : (
                  <div className="radio">
                    {" "}
                    {/*  className="radio1"   */}
                    {/*  dole biramo tipKarta koji treba upisati u bazu */}
                    <select
                      className="select"
                      type="text"
                      name="Izaberi kartu"
                      required
                      value={selectedValue}
                      //value={tipKarte}
                      onChange={(event) => {
                        const selectedOptionValue = event.target.value; // Ovo je vrednost izabranog optiona
                        setSelectedValue(selectedOptionValue);
                        //setTipKarte(selectedOptionValue);

                        if (
                          (selectedOptionValue === "Povratna") |
                          (selectedOptionValue === "Return")
                        ) {
                          setShowReturnDate(true);
                          setPomDateRet(returnDate);
                        } else {
                          setShowReturnDate(false);
                          setReturnDate(null); //da ne baca vrednosti iz baze od predhono izabranog datuma
                          setPomPolazak("");
                          setPomDolazak("");
                          setPomDatDolazak(""); //postavlja na nulu zbog promene tipa karte
                          setPomDateRet("povratna"); //sluzi za poziv vrste karte koju upisujemo u bazu
                        }
                        if (selectedOptionValue === "Studentska") {
                          setPom(true);
                        } else {
                          setPom(false);
                        }

                        if (selectedOptionValue === "Students") {
                          setPom1(true);
                        } else {
                          setPom1(false);
                        }
                        // Postavljanje vrednosti u state setTipKarte
                        setTipKarte(selectedOptionValue);
                      }}
                    >
                      <option disabled={false} value="">
                        <Trans i18nKey="description.part23">
                          Izaberite kartu
                        </Trans>
                      </option>
                      <option value="Jednosmerna">
                        <Trans i18nKey="description.part24">
                          {" "}
                          Jednosmerna{" "}
                        </Trans>
                      </option>
                      <option value="Povratna">
                        <Trans i18nKey="description.part25"> Povratna </Trans>
                      </option>
                      <option value="Besplatna">
                        <Trans i18nKey="description.part26">Besplatna</Trans>
                      </option>
                      <option value="Studentska">
                        <Trans i18nKey="description.part27">Studentska</Trans>
                      </option>
                      <option value="Vikend">
                        <Trans i18nKey="description.part28">Vikend</Trans>
                      </option>
                      <option value="Nedeljna">
                        <Trans i18nKey="description.part29">Nedeljna</Trans>
                      </option>
                    </select>
                    {/* studentska karta   */}
                    <div>
                      {pom ? (
                        <div className="ograda1">
                          <p>
                            {" "}
                            <Trans i18nKey="description.part137">
                              VaÅ¾i za studente do 27 god. uz index u suprotnom
                              plaÄ‡a se puna cena karte
                            </Trans>
                          </p>{" "}
                        </div>
                      ) : (
                        " "
                      )}

                      {pom1 ? (
                        <div className="ograda1">
                          {" "}
                          <p>
                            {" "}
                            <Trans i18nKey="description.part137">
                              Valid for students up to 27 years old. with the
                              index, otherwise the full price of the ticket is
                              paid{" "}
                            </Trans>
                          </p>
                        </div>
                      ) : (
                        " "
                      )}
                    </div>
                    {/* kraj studentska karta   */}
                    {showReturnDate && (
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
                            min={state.datumDolaska}
                            onChange={(e) => {
                              e.persist();

                              setTimeout(
                                () => setReturnDate(e.target.value),
                                0
                              );
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
                              {filteredLinije.map((linija) => (
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
                          Odabrali ste polazak - dolazak (h):
                          <hr />
                          {pomPolazak}---{pomDolazak}
                        </div>
                      </div>
                    )}
                    <div className="red-1"></div>
                  </div>
                )}
                {/* Kraj dela za definisanje vrste karte    */}
              </div>
              <div className="red-1"></div>
              <div className="red-1"></div>
              <div className="deoForme sirina-3polja">
                <div className="levo">
                  <label className="labela-velika ">
                    <Trans i18nKey="description.part179">Izabrali ste </Trans>
                  </label>
                </div>
                <div className="red-1"></div>
                <div className="vasIzbor">
                  <p>
                    <Trans i18nKey="description.part60">Cena karte:</Trans>{" "}
                    {ceneFilter} din
                  </p>
                </div>
              </div>
              <div className="red-1"></div>
            </div>

            <div className="flex-clan">
              {/* desni deo sa prikazom autobusa */}
              <div className="autobus">
                <div className="centar">
                  {/*------------------------------ Dopisala SN po Vulicevom predlogu ovaj blok */}
                  <div>
                    <div>
                      <label className="labela mestoPozovi">
                        <Trans i18nKey="description.part3">Mesto polaska</Trans>
                      </label>
                      <strong>{state.pocetnaStanica}</strong>
                    </div>
                    <div>
                      <label className="labela mestoPozovi">
                        <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                      </label>

                      <strong>{state.krajnjaStanica}</strong>
                    </div>
                  </div>
                  {/*------------------------------  */}
                </div>
                <div>
                  {(linija.oznakaBusa != "S2" ? (
                    ""
                  ) : (
                    <S2
                      onReservation={handleReservation}
                      linijaId={state.id}
                      pocetnaStanicaId={state.pocetnaStanicaId}
                      krajnjaStanicaId={state.krajnjaStanicaId}
                    />
                  )) ||
                    (linija.oznakaBusa != "MAN" ? (
                      ""
                    ) : (
                      <MAN
                        onReservation={handleReservation}
                        linijaId={state.id}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    )) ||
                    (linija.oznakaBusa != "VH" ? (
                      ""
                    ) : (
                      <VH
                        onReservation={handleReservation}
                        linijaId={state.id}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    )) ||
                    (linija.oznakaBusa != "MB1" ? (
                      ""
                    ) : (
                      <MB1
                        onReservation={handleReservation}
                        linijaId={state.id}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    )) ||
                    (linija.oznakaBusa != "MB3" ? (
                      ""
                    ) : (
                      <MB3
                        onReservation={handleReservation}
                        linijaId={state.id}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    )) ||
                    (linija.oznakaBusa != "MB4" ? (
                      ""
                    ) : (
                      <MB4
                        onReservation={handleReservation}
                        linijaId={state.id}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    )) ||
                    (linija.oznakaBusa != "VL" ? (
                      ""
                    ) : (
                      <VL
                        onReservation={handleReservation}
                        linijaId={state.id}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    )) ||
                    (linija.oznakaBusa != "S1" ? (
                      ""
                    ) : (
                      <S1
                        onReservation={handleReservation}
                        linijaId={state.id}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    ))}
                </div>

                <p className="plavo">
                  <Trans i18nKey="description.part183">
                    U slučaju izmene tipa autobusa, moguže je doći do promene
                    rezervacije sedišta, o čemu ćete biti obavešteni.
                  </Trans>{" "}
                </p>
              </div>
              <div className="red-1"></div>
              {/* <label>
              <Trans i18nKey="description.part180">Broj sediÅ¡ta </Trans>
              </label> &emsp;
              <input
                type="number"
                value={brojSedista}
                className="brSedista"
                onChange={(e) => setBrojSedista(e.target.value)}
              ></input> */}
              <div className="red-1"></div>
            </div>
          </div>
          <div className="red-1"></div>
          <div>
            {/*<button  onClick={clickRezervisiPovratak}>RezerviÅ¡i privremeno povratnu</button>  ovaj poziv dovodi do pucanja */}
            {/*   onClick={submitHandler}   bilo postavljeno da bi se proverilo u console.log  */}
            {/*    <button className="buttonSwitch" onClick={submitHandler} >      */}
            {/* returnDate!==null?       */}
            {/* biramo vrstu poziva upisa podataka u karti  */}
            <div>
              {/*  Poziv rezervacije za kartu koja nije povratna    */}
              <button
                className={classes.submit}
                style={{ fontSize: "18px", color: "darkblue" }}
                onClick={clickRezervisiPovratak}
              >
                <Trans i18nKey="description.part181">Rezerviši kartu </Trans>
              </button>
            </div>
            {/*     <button onClick={clickRezervisiPovratak}>RezerviÅ¡i povratnu kartu</button>  */}{" "}
            {/* ovde pukne program  */}
            {/* <button className={classes.submit} onClick={clickRezervisi}>
              <p className="slovaDugme">
                <Trans i18nKey="description.part181">RezerviÅ¡i kartu </Trans>
              </p>
            </button>
            &emsp; */}
            {/* <button className={classes.submit}>
              <p className="slovaDugme">&ensp; &nbsp; 
              <Trans i18nKey="description.part182">Kupi kartu </Trans>&ensp;
              </p>
            </button> */}
          </div>
          <div className="red-1"></div>
        </div>
      </form>
      <ToastContainer />
      <div className="red-1"></div>
    </>
  );
};

export default RezervacijaComponent;
