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
import MK91 from "./proba/mk91";
import MB1 from "./proba/mb1";
import MB3 from "./proba/mb3";
import MB4 from "./proba/mb4";
import VL from "./proba/vl";
import S1 from "./proba/s1";
import RezervacijaApi from "../../api/rezervacijaApi";

const RezervacijaComponent = ({ id, state }) => {
  const [linija, setLinija] = useState({});
  const [brojSedista, setBrojSedista] = useState();

  //? izvlacenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};

  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }
  console.log(
    brojSedista,
    state.id,
    state.pocetnaStanicaId,
    state.krajnjaStanicaId
  );
  const novaRezervacija = () => {
    RezervacijaApi()
      .rezervacija(
        brojSedista,
        state.id,
        state.pocetnaStanicaId,
        state.krajnjaStanicaId
      )
      .then((response) => {
        console.log(response);
        alert("radi");
      })
      .catch((error) => {
        console.log(error);
        alert("nece");
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

  /* const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  } */

  // const [studentska, setStudentska]=useState(false);
  const [pom, setPom] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [selectedKarta, setSelectedKarta] = useState("");
  const handleKarte = (event) => {
    setSelectedKarta(event.target.value);
  };

  const [rezervacije, setRezervacije] = useState(Array(57).fill(false));
  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([]);
  const [brojIzabranihSedista, setBrojIzabranihSedista] = useState(0);
  const [ukupnaCena, setUkupnaCena] = useState(0);

  function handleClick(index) {
    const noviNiz = [...rezervacije];
    noviNiz[index] = !noviNiz[index];

    setRezervacije(noviNiz);
    const noviNizRezervacija = noviNiz
      .map((rezervisano, index) => (rezervisano ? index + 1 : null))
      .filter((sediste) => sediste !== null);
    setTrenutnaRezervacija(noviNizRezervacija);
    const brojIzabranih = noviNiz.filter((s) => s).length;
    setBrojIzabranihSedista(brojIzabranih);
  } // kod za pravljenje divova za autobus

  useEffect(() => {
    const novaCena = calculateTicketPrice(selectedValue) * brojIzabranihSedista;
    setUkupnaCena(novaCena);
  }, [selectedValue, brojIzabranihSedista]);

  const [showReturnDate, setShowReturnDate] = useState(false);

  const [ticketPrice, setTicketPrice] = useState(0);

  const calculateTicketPrice = (selectedTicketType) => {
    let price = 0;
    switch (selectedTicketType) {
      case "Jednosmerna":
        price = 1000;
        break;
      case "Povratna":
        price = 2000;
        break;
      case "Besplatna":
        price = 0;
        break;
      case "Studentska":
        price = 500;
        break;
      case "Vikend":
        price = 1500;
        break;
      case "Nedeljna":
        price = 2500;
        break;
      default:
        price = 0;
    }
    return price;
  };

  const code = {
    mestoPolaska: linija.mestoPolaska,
    mestoDolaska: linija.mestoDolaska,
    datumPolaska: linija.datumPolaska,
    datumDolaska: linija.datumDolaska,
    vremePolaska: linija.vremePolaska,
    vremeDolaska: linija.vremeDolaska,
    osvezenje: osvezenje,
    radio: selectedValue,
    sediste: trenutnaRezervacija,
    cena: ukupnaCena,
  }; // vrednosti koje se prosledjuju u QRcodu da bi se on generisao

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
    }
  };

  return (
    <>
      <form onSubmit={confirmeHandler} className={`${classes.form} side`}>
        <div className="left-side">
          <div
            className={`${classes.control} ${
              formInputsValid.name ? "" : classes.invalid
            }`}
          >
            <label>Ime i prezime:</label>
            <input
              className="test"
              type="text"
              name="ime"
              value={
                userPars.ime == undefined
                  ? ""
                  : userPars.ime + " " + userPars.prezime
              }
              onChange={rezervacijaLogic.changeHandler}
              ref={fNameInputRef}
            />
            {!formInputsValid.name && <p>Unesite ime i prezime</p>}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValid.mesto ? "" : classes.invalid
            }`}
          >
            <label>Mesto polaska:</label>
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
            <label>Mesto dolaska:</label>
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
            <label>Datum polaska:</label>

            <input
              defaultValue={state.datumPolaska}
              className="test"
              /* type="date" */
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
            <label>Datum dolaska:</label>

            <input
              defaultValue={state.datumDolaska}
              className="test"
              /*  type="date" */
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
            <label>Vreme polaska:</label>
            <input
              defaultValue={state.vremePolaska}
              className="test"
              /* type="time" */ /*da ne bi moglo vreme da se menja */
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
            <label>Vreme dolaska:</label>
            <input
              defaultValue={state.vremeDolaska}
              className="test"
              /* type="time" */
              name="vremeD"
              ref={vremeDInputRef}
              onChange={rezervacijaLogic.changeHandler}
            />
            {!formInputsValid.vremeD && <p>Unesite vreme</p>}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValid.email ? "" : classes.invalid
            }`}
          >
            <label>Email:</label>
            <input
              type="text"
              className="test"
              name="email"
              value={userPars.email == undefined ? "" : userPars.email}
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
            <label>Telefon:</label>
            <input
              type="text"
              className="test"
              name="telefon"
              value={
                userPars.brojTelefona == undefined ? "" : userPars.brojTelefona
              }
              ref={telefonInputRef}
              onChange={rezervacijaLogic.changeHandler}
            />
            {!formInputsValid.telefon && <p>Unesite telefon</p>}
          </div>

          <div className="radio">
            <select
              className="select"
              type="text"
              name="osvezenje"
              value={osvezenje}
              required
              onChange={(event) => {
                setOsvezenje(event.target.value);
              }}
            >
              <option disabled={false} value="">
                Izaberite osvezenje
              </option>
              <option>Kafa</option>
              <option>Caj</option>
              <option>Nes</option>
            </select>
          </div>

          <div className="radio">
            <select
              className="radio1"
              type="text"
              name="Izaberi kartu"
              required
              value={selectedValue}
              onChange={(event) => {
                setSelectedValue(event.target.value);
                if (event.target.value === "Povratna") {
                  setShowReturnDate(true);
                } else {
                  setShowReturnDate(false);
                }
                if (event.target.value === "Studentska" && "Students") {
                  setPom(true);
                } else {
                  setPom(false);
                }
              }}
            >
              <option disabled={false} value="">
                Izaberite kartu
              </option>
              <option>Jednosmerna</option>
              <option>Povratna</option>
              <option>Besplatna</option>
              <option>Studentska</option>
              <option>Vikend</option>
              <option>Nedeljna</option>
            </select>

            {showReturnDate && (
              <div>
                <label htmlFor="returnDate">Datum povratka:</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            )}

            {pom ? (
              <div className="maliCrveni">
                <p>
                  {" "}
                  Važi za studente do 27 god. uz index u suprotnom plaća se puna
                  cena
                </p>{" "}
              </div>
            ) : (
              " "
            )}

            <div>
              <p>Cena karte: {calculateTicketPrice(selectedValue)} dinara</p>
              <p>Broj izabranih sedišta: {brojIzabranihSedista}</p>
              <p>Ukupna cena: {ukupnaCena} dinara</p>
            </div>
          </div>

          <div className="right-side">
            <div className="autobus">
              <div>
                {(linija.oznakaBusa != "S2" ? "" : <S2 />) ||
                  (linija.oznakaBusa != "MAN" ? "" : <MAN />) ||
                  (linija.oznakaBusa != "MK91" ? "" : <MK91 />) ||
                  (linija.oznakaBusa != "MB1" ? "" : <MB1 />) ||
                  (linija.oznakaBusa != "MB3" ? "" : <MB3 />) ||
                  (linija.oznakaBusa != "MB4" ? "" : <MB4 />) ||
                  (linija.oznakaBusa != "VL" ? "" : <VL />) ||
                  (linija.oznakaBusa != "S1" ? "" : <S1 />)}
              </div>
              <p className="plavo">
                U slučaju izmene tipa autobusa, moguće je doći do promene
                rezervacije sedišta, o čemu ćete biti obavešteni.{" "}
              </p>
            </div>

            {/*  <Autobus /> */}
            <label>brojSedista</label>
            <input
              type="number"
              value={brojSedista}
              onChange={(e) => setBrojSedista(e.target.value)}
            ></input>
            <br />
            <br />

            <button className={classes.submit} onClick={novaRezervacija}>
              Rezervisi kartu
            </button>
            <button className={classes.submit}>Kupi kartu</button>
          </div>
          {/* <p>
            Korisnik je kupio kartu od mesta {linija.mestoPolaska} do mesta{" "}
            {linija.mestoDolaska} i to datuma {linija.datumPolaska} za vreme{" "}
            {linija.vremePolaska} casova i dolazi {linija.datumDolaska} i to u
            vremenu {linija.vremeDolaska} casova i korisnik bira osvezenje{" "}
            {osvezenje}.Korisnik je izabrao {selectedValue} kartu i cena te
            karte je {ukupnaCena} dinara i rezervisao je sediste broj{" "}
            {trenutnaRezervacija + ""}
          </p> */}
        </div>
      </form>
      <Qrcode code={code} />
      {/* <BusSedista /> */}
    </>
  );
};

export default RezervacijaComponent;
