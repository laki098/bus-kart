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

import "./i18n"; // za prevodjenje
import "./i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

const RezervacijaComponent = ({ id, state }) => {
  const [linija, setLinija] = useState({});
  const [brojSedista, setBrojSedista] = useState();

  //? izvlacenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};

  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }

  const novaRezervacija = () => {
    RezervacijaApi()
      .rezervacija(
        brojSedista,
        state.pocetnaStanica,
        state.krajnjaStanica,
        state.datumPolaska,
        state.datumDolaska,
        state.vremePolaska,
        state.vremeDolaska,
        state.id,
        state.pocetnaStanicaId,
        state.krajnjaStanicaId,
        userPars.idKorisnika
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
  const [pom1, setPom1] =useState(false);
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

  //prevodjenje
  const lngs = {
      en: { nativeName: "Engleski" },
      de: { nativeName: "Srpski" },
    };
  const { t, i18n } = useTranslation();
  // prevodjenje
  return (
    <>
      <div className="red-1"></div>
      <form onSubmit={confirmeHandler} className="forma">  {/* className={`${classes.form} side`}  */}
        <div  > {/* className="flex-container"  */}

        
        <div className="flex-container">
          <div className="flex-clan" > {/* levi deo sa prikazom podataka u formi */}

            <div className="red-1"></div>
            <div className="deoForme">
            <div className="levo"><label className="labela-velika">Putnik</label></div>
            <div className="red-1"></div>
            <div className={`${classes.control} ${
                formInputsValid.name ? "" : classes.invalid
                }`}
            >
                <label className="labela" style={{paddingLeft:"2.3rem"}}>Ime i prezime</label>
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

            <div className={`${classes.control} ${
              formInputsValid.email ? "" : classes.invalid
              }`}
            >
              <label className="labela" style={{paddingLeft:"2.3rem"}}>Email</label>
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
              
            <div className={`${classes.control} ${
              formInputsValid.email ? "" : classes.invalid
              }`}
            >
              <label className="labela" style={{paddingLeft:"2.3rem"}} >Telefon</label>
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
            </div>

            <div className="red-1"></div>

            <div className="deoForme">
            <div className="levo"><label className="labela-velika">Linija</label></div>
            <div className="red-1"></div>

            <div className={`${classes.control} ${
                formInputsValid.mesto ? "" : classes.invalid
                }`}
            >
                <label className="labela" style={{paddingLeft:"2.3rem"}}>Mesto polaska</label>
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

            <div className={`${classes.control} ${
                formInputsValid.mesto ? "" : classes.invalid
                }`}
            >
                <label className="labela" style={{paddingLeft:"2.3rem"}}>Mesto dolaska</label>
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

            <div className={`${classes.control} ${
                formInputsValid.datum ? "" : classes.invalid
                }`}
            >
              <label className="labela" style={{paddingLeft:"2.3rem"}}>Datum polaska</label>

              <input
                defaultValue={state.datumPolaska}
                className="test"
                name="datum"
                ref={datumInputRef}
                onChange={rezervacijaLogic.changeHandler}
              />

              {!formInputsValid.datum && <p>Unesite datum</p>}
            </div>

            <div className={`${classes.control} ${
              formInputsValid.datum ? "" : classes.invalid
              }`}
            >
              <label className="labela" style={{paddingLeft:"2.3rem"}}>Datum dolaska</label>

              <input
                defaultValue={state.datumDolaska}
                className="test"
                name="datum"
                ref={datumDInputRef}
                onChange={rezervacijaLogic.changeHandler}
              />

              {!formInputsValid.datumD && <p>Unesite datum</p>}
            </div>

            <div className={`${classes.control} ${
              formInputsValid.vreme ? "" : classes.invalid
              }`}
            >
              <label className="labela" style={{paddingLeft:"2.3rem"}}>Vreme polaska</label>
              <input
                defaultValue={state.vremePolaska}
                className="test"
                name="vreme"
                ref={vremeInputRef}
                onChange={rezervacijaLogic.changeHandler}
              />
              {!formInputsValid.vreme && <p>Unesite vreme</p>}
            </div>

            <div className={`${classes.control} ${
              formInputsValid.vreme ? "" : classes.invalid
              }`}
            >
              <label className="labela" style={{paddingLeft:"2.3rem"}}>Vreme dolaska</label>
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
            <div className="levo"><label className="labela-velika">Dodaci</label></div>
            <div className="red-1"></div>

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
                  Izaberite osveženje
                </option>
                <option>Kafa</option>
                <option>Čaj</option>
                <option>Nes</option>
              </select>
            </div>

            <div className="radio">   {/*  className="radio1"   */}
              <select
                className="select"
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
                if (event.target.value === "Studentska") {
                  setPom(true);
                } else {
                  setPom(false);
                }

                if (event.target.value === "Students") {
                  setPom1(true);
                } else {
                  setPom1(false);
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

          {/* studentska karta   */}
          <div  >
          { pom ? <div className="ograda1">
            <p> <Trans i18nKey="description.part137">Važi za studente do 27 god. uz index u suprotnom plaća se puna cena karte</Trans></p> </div>
          :" "}
          
          {pom1 ? <div className="ograda1" > <p > <Trans i18nKey="description.part137">Valid for students up to 27 years old. with the index, otherwise the full price of the ticket is paid </Trans></p></div> 
          : " "}
            
          </div>
          {/* kraj studentska karta   */}  

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
{/*
            {pom ? (
              <div className="maliCrveni">
                <p>
                  {" "}
                  Važi za studente do 27 god. uz index u suprotnom plaća se puna cena
                  cena
                </p>{" "}
              </div>
            ) : (
              " "
            )}
*/}            
            <div className="red-1"></div>
            </div>
            </div>

            <div className="red-1"></div>
            <div className="red-1"></div>
            <div className="deoForme sirina-3polja">
            <div className="levo"><label className="labela-velika ">Izabrali ste</label></div>
            <div className="red-1"></div>
            <div className="vasIzbor">
              <p>Cena karte: <strong> {calculateTicketPrice(selectedValue)} dinara</strong></p>
              <p>Broj izabranih sedišta:<strong> {brojIzabranihSedista}</strong></p>
              <p>Ukupna cena: <strong> {ukupnaCena} dinara</strong></p>
            </div>
            </div>
            <div className="red-1"></div>
          </div>

              <div className="flex-clan">  {/* desni deo sa prikazom autobusa */}
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

              <div className="red-1"></div>

              <label>Broj sedišta</label> &emsp;
              <input
                type="number"
                value={brojSedista}
                className="brSedista"
                onChange={(e) => setBrojSedista(e.target.value)}
              ></input>

              <div className="red-1"></div>
              </div>

        </div> 
        <div className="red-1"></div>
        <div >
        <button className={classes.submit}  onClick={novaRezervacija}><p className="slovaDugme">Rezerviši kartu </p></button>
        &emsp;
        <button className={classes.submit}><p className="slovaDugme">&ensp; &nbsp; Kupi kartu &ensp;</p></button>
        </div>
        <div className="red-1"></div>

        </div>
      </form>
      <div className="red-1"></div>
      <Qrcode code={code} />
      {/* <BusSedista /> */}
    </>
  );
};

export default RezervacijaComponent;
