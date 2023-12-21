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
import { isVisible } from "@testing-library/user-event/dist/utils";

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

  //? izvlacenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};

  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }

{/*
  const filterLinija = async () => {
    if (!valueDate) return;
    const response = await LinijeApi().filterLinija(val1, val2, returnDate);

    const data = await response.json();

    console.log(data.rezultat);
    setFilteredLinije(data.rezultat);
  };
*/}

  const novaRezervacija = () => {
    console.log("--***----KORAK 3")
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
    /* setTimeout(() => {
      window.location.href = "/pocetna";
    }, 5000); */ // Ova vrednost u milisekundama predstavlja koliko će trajati prikazivanje poruke pre nego što se preusmeriš (u ovom slučaju 1,5 sekunde) 
  };

  const [pom, setPom] = useState(false);
  const [pom1, setPom1] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  {/*
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
*/}

  const [brojIzabranihSedista, setBrojIzabranihSedista] = useState(0);
  const [ukupnaCena, setUkupnaCena] = useState(0);

  useEffect(() => {
    const novaCena = calculateTicketPrice(selectedValue) * brojIzabranihSedista;
    setUkupnaCena(novaCena);
  }, [selectedValue, brojIzabranihSedista]);

  const [showReturnDate, setShowReturnDate] = useState(false);

 // const [ticketPrice, setTicketPrice] = useState(0);

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
    else {
      clickRezervisi();
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
{/*
    const handleOptionClick = (option) => {
      setChecked(option === checked ? null : option);
    };
  */}

  const [checkedItemId, setCheckedItemId] = useState(null);
 // const [error, setError] = useState(null);       // zbog obrade greske kod povratne karte

  const [pomPolazak, setPomPolazak]=useState(''); // da rese ispad kad se promeni datum kod povratne karte
  const [pomDolazak, setPomDolazak]=useState('');
  const [pomDatDolazak, setPomDatDolazak]=useState("");

  const [pomDateRet, setPomDateRet]=useState(null);   //kod poziva dela za upis rezervacije na samom kraju

  const handleCheckboxChange = (id) => {
    setCheckedItemId(id);
  };



  //let start;
  //let end;

  // ovo korektno radi
  const submitHandler = (event) => {
    event.preventDefault();
    {
    /*  const formData = new FormData(event.target);      */
      const data = { 
        polaznaStanicaR: state.krajnjaStanica,
        krajnjaStanicaR: state.pocetnaStanica,
        datumPolaska: returnDate,
        datumDolaska: pomDatDolazak,
        vremePolaska: pomPolazak,
        vremeDolaska: pomDolazak,
        cekiran: "DA", 
      };
      
      console.log("Podaci sa povratne karte");
      console.log(data);
    }
  };

  // za rezervaciju povratne karte ali tu nesto nije kako treba
  const novaRezervacijaPovratak = (event) => {
    console.log("--***----KORAK 2")
    event.preventDefault();
    console.log(state.krajnjaStanica,
      state.pocetnaStanica,
      returnDate,
      pomDatDolazak,
      pomPolazak,
      pomDolazak,   
      state.id,
      state.krajnjaStanicaId,
      state.pocetnaStanicaId,
      userPars.idKorisnika,
      osvezenje,
      parseInt(selectedSeats))
    {
    RezervacijaApi()
      .rezervacijaPovratna(
        1,
        state.krajnjaStanica,
        state.pocetnaStanica,
        returnDate,
        pomDatDolazak,
        pomPolazak,
        pomDolazak,   
        state.id,
        state.krajnjaStanicaId,
        state.pocetnaStanicaId,
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
    }  
  };

  //puca mi program zbog ovog dole
  const clickRezervisiPovratak = () => {
    novaRezervacijaPovratak();
    console.log('Rezervacija za povratnu kartu iz clikRezervisiPovratak');
    /* // Prikazi poruku o rezervaciji (koristi alert, modal, ili neki drugi način)
    alert("Vaša karta je uspešno rezervisana!"); */

    // Sačekaj nekoliko sekundi pre nego što se preusmeriš na početnu stranicu
    /* setTimeout(() => {
      window.location.href = "/pocetna";
    }, 200000); */ // Ova vrednost u milisekundama predstavlja koliko će trajati prikazivanje poruke pre nego što se preusmeriš (u ovom slučaju 1,5 sekunde) 
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

      <div className="red-1"></div>
      <form onSubmit= {confirmeHandler} className="forma">

        {" "}
        {/* className={`${classes.form} side`}  */}
        <p className="p-style2">Korak 3/3</p>
        <div className="margin">

        </div>
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
                    value={userPars.email == undefined ? undefined : userPars.email}
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
                      setSelectedValue(event.target.value);

                      if ((event.target.value === "Povratna") | (event.target.value ==="Return")) {
                        setShowReturnDate(true);
                        setPomDateRet(returnDate);
                      } else {
                        setShowReturnDate(false);
                        setReturnDate(null);        //da ne baca vrednosti iz baze od predhono izabranog datuma
                        setPomPolazak(''); setPomDolazak(''); setPomDatDolazak('');   //postavlja na nulu zbog promene tipa karte
                        setPomDateRet(null);  //sluzi za poziv vrste karte koju upisujemo u bazu
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
                      <Trans i18nKey="description.part23">
                        Izaberite kartu
                      </Trans>
                    </option>
                    <option>
                      <Trans i18nKey="description.part24">Jednosmerna</Trans>
                    </option>
                    <option>
                      <Trans i18nKey="description.part25">Povratna</Trans>
                    </option>
                    <option>
                      <Trans i18nKey="description.part26">Besplatna</Trans>
                    </option>
                    <option>
                      <Trans i18nKey="description.part27">Studentska</Trans>
                    </option>
                    <option>
                      <Trans i18nKey="description.part28">Vikend</Trans>
                    </option>
                    <option>
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
                    <div >
                      <label htmlFor="returnDate">
                      <Trans i18nKey="description.part70">  Datum povratka  </Trans>
                      </label>
                      &emsp; &ensp;
                      <input
                        type="date"
                        id="returnDate"
                        name="returnDate"
                        min={state.datumDolaska}
                        onChange={(e) => {
                          e.persist();
                          
                          setTimeout(() => setReturnDate(e.target.value), 0);
                        }}
                        onClick={()=>{setPomPolazak(''); setPomDolazak(''); setPomDatDolazak('');}}
                      />
                    </div>
                    <div style={{textAlign: "left", paddingLeft:"2rem"}}>
                      <label >  
                      <Trans i18nKey="description.part11">  Vreme polaska  </Trans>
                      </label>
                    </div>
  
                    <div className="teget">
                      {/* Ovde formira podatke za povratnu kartu  */}
                      {returnDate!==null? 
                      <div>
                    {filteredLinije.map((linija) => (
                      <div>
                      <li key={linija.id}>
                        <label>{linija.vremePolaska}  ---{linija.vremeDolaska}---</label>
                        <input
                          type="checkbox"
                          value={linija.id}
                          checked={checkedItemId === linija.id}
                          onChange={() => handleCheckboxChange(linija.id)}

                          onClick={()=> {
                          setPomPolazak(linija.vremePolaska)
                          setPomDolazak(linija.vremeDolaska)
                          setPomDatDolazak(linija.datumDolaska)
                          setPomDateRet(returnDate)   // sluzi kod dela gde pozivamo upis u bazu podataka u karti
                          }}
                        />   
                      </li>   
                      </div>
                    ))}
                      </div>:""}
                    <hr/>Odabrali ste polazak - dolazak (h):<hr/> 
                    {pomPolazak}---{pomDolazak}                   
                    </div>

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
                    <strong>
                      {" "}
                      {calculateTicketPrice(selectedValue)}
                      &nbsp; <Trans i18nKey="description.part61"> dinara</Trans>
                    </strong>
                  </p>
                  <p>
                    <Trans i18nKey="description.part62">
                      Broj izabranih sedišta:
                    </Trans>
                    <strong> {brojIzabranihSedista}</strong>
                  </p>
                  <p>
                    <Trans i18nKey="description.part63">Ukupna cena:</Trans>
                    <strong>
                      {" "}
                      {ukupnaCena}
                      &nbsp;
                      <Trans i18nKey="description.part61"> dinara</Trans>
                    </strong>
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
                  {console.log(state) ||
                    (linija.oznakaBusa != "S2" ? (
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


       {/*<button  onClick={clickRezervisiPovratak}>Rezerviši privremeno povratnu</button>  ovaj poziv dovodi do pucanja */}
        {/*   onClick={submitHandler}   bilo postavljeno da bi se proverilo u console.log  */}


        {/*    <button className="buttonSwitch" onClick={submitHandler} >      */}
        
        {console.log('returnDate je:',returnDate)}

        {console.log('pomDateRet',pomDateRet)}

          {/* returnDate!==null?       */}  
          {/* biramo vrstu poziva upisa podataka u karti  */}
        {pomDateRet!==null?
        <div>
          {/* Da pozovemo rezervaciju za povratnu kartu ovde mi puca----------- */}
        <button className={classes.submit} onClick={() => { clickRezervisiPovratak(); novaRezervacija(); }}>
              
            <Trans i18nKey="description.part181">Rezerviši kartu </Trans> Povratna je !!!
            </button>
        </div>
        :
        <div>
          {/*  Poziv rezervacije za kartu koja nije povratna    */}
        <button className={classes.submit} onClick={clickRezervisi}>
              
            <Trans i18nKey="description.part181">Rezerviši kartu </Trans>
            </button>
        </div>}

       {/*     <button onClick={clickRezervisiPovratak}>Rezerviši povratnu kartu</button>  */}   {/* ovde pukne program  */}
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
      <ToastContainer/>
      <div className="red-1"></div>
    </>
  );
};

export default RezervacijaComponent;
