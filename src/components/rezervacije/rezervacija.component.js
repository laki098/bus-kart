import { useRef, useState, useEffect } from "react";
import RezervacijaLogic from "./rezervacija.logic";
import classes from "../registration/registration.module.css";
import LinijeApi from "../../api/linije.api";
import cookies from "js-cookie";

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
import Slider from "../NavBar/links/slider/slider";
import apiUrl from "../../apiConfig";

const RezervacijaComponent = ({ id, state }) => {
  // const [filteredLinije, setFilteredLinije] = useState([]);
  const [linija, setLinija] = useState({});
  const [brojSedista, setBrojSedista] = useState();
  const [ceneFilter, setCeneFilter] = useState();
  const [tipKarte, setTipKarte] = useState();

  //? izvlacenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};

  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }

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
        parseInt(selectedSeats)
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
  console.log(osvezenje);

  const handleOsvezenje = (e) => {
    setOsvezenje(e.target.value);
  };

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleReservation = (selectedSeats) => {
    // Ovde možete izvršiti akcije sa selektovanim sedištima
    setSelectedSeats(selectedSeats);
    console.log("Selektovana sedišta:", selectedSeats);
  };

  const clickRezervisi = () => {
    novaRezervacija();

    /* // Prikazi poruku o rezervaciji (koristi alert, modal, ili neki drugi način)
    alert("Vaša karta je uspešno rezervisana!"); */

    // Sačekaj nekoliko sekundi pre nego što se preusmeriš na početnu stranicu
    setTimeout(() => {
      window.location.href = "/pocetna";
    }, 2000); // Ova vrednost u milisekundama predstavlja koliko će trajati prikazivanje poruke pre nego što se preusmeriš (u ovom slučaju 1,5 sekunde)
  };

  const [pom, setPom] = useState(false);
  const [pom1, setPom1] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

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

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    cene();
  }, [tipKarte]);

  const [showReturnDate, setShowReturnDate] = useState(false);

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
      clickRezervisi();
    }
  };

  //prevodjenje
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

  const [sliderValue, setSliderValue] = useState(100);
  const NovaVrednost = 100;
  const handleNekePromene = () => {
    // Implementirajte logiku koja će promeniti vrednost slidera kada pređete na drugu stranicu
    setSliderValue(NovaVrednost); // Postavite novu vrednost prema potrebi
  };

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
        <Slider value={sliderValue} />
      </div>

      <div className="red-1"></div>
      <form onSubmit={confirmeHandler} className="forma">
        {" "}
        {/* className={`${classes.form} side`}  */}
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
                    onChange={rezervacijaLogic.changeHandler}
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
                    required
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

                <div className="radio">
                  {" "}
                  {/*  className="radio1"   */}
                  <select
                    className="select"
                    type="text"
                    name="Izaberi kartu"
                    required
                    value={selectedValue}
                    onChange={(event) => {
                      const selectedOptionValue = event.target.value; // Ovo je vrednost izabranog optiona

                      setSelectedValue(selectedOptionValue);

                      if (
                        (selectedOptionValue === "Povratna") |
                        (selectedOptionValue === "Return")
                      ) {
                        setShowReturnDate(true);
                      } else {
                        setShowReturnDate(false);
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
                      <Trans i18nKey="description.part24">Jednosmerna</Trans>
                    </option>
                    <option value="Povratna">
                      <Trans i18nKey="description.part25">Povratna</Trans>
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
                            Važi za studente do 27 god. uz index u suprotnom
                            plaća se puna cena karte
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
                          min={new Date().toISOString().split("T")[0]}
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
                      {/* prikazi vremena  */}
                      <div></div>
                    </div>
                  )}
                  <div className="red-1"></div>
                </div>
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
                    U slučaju izmene tipa autobusa, moguće je doći do promene
                    rezervacije sedišta, o čemu ćete biti obavešteni.
                  </Trans>{" "}
                </p>
              </div>
              <div className="red-1"></div>
              {/* <label>
              <Trans i18nKey="description.part180">Broj sedišta </Trans>
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
            <button className={classes.submit}>Rezerviši kartu </button>
            {/* <button className={classes.submit} onClick={clickRezervisi}>
              <p className="slovaDugme">
                <Trans i18nKey="description.part181">Rezerviši kartu </Trans>
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
