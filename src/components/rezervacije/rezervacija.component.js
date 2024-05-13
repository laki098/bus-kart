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
import "../admin/dopuna_stila.css";

//import { PotvrdaContext } from '../NavBar/links/korisnik/karta';    // da onemoguci promenu tipa karte jer je ovo povratna karta

const RezervacijaComponent = ({ id, state }) => {
  // const [filteredLinije, setFilteredLinije] = useState([]);
  const [linija, setLinija] = useState({});
  // zbog povratne karte
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [returnDate, setReturnDate] = useState(Date);
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [PovratnaIdLinija, setPovratnaIdLinija] = useState();
  const [ceneFilter, setCeneFilter] = useState();
  const [tipKarte, setTipKarte] = useState("");
  const [drugiKorisnik, setDrugiKorisnik] = useState(false);
  const [izmeniPovratak, setIzmeniPovratak] = useState(false); //menjamo datum i vreme povratka
  const [stariPovratak, setStariPovratak] = useState(false); // ostajemo kod prvobitno rezervisanog datuma i vremena povratka
  const [email, setEmail] = useState();
  const [filteredLinijePovratna, setFilteredLinijePovratna] = useState([]); // kad menjamo realnoPovratnu kartu
  const [val1Pov, setVal1Pov] = useState(""); //kod promene realnoPovratne karte
  const [val2Pov, setVal2Pov] = useState("");
  const [pKorisnik, setPKorisnik] = useState({});

  const [pomCena, setPomCena] = useState(""); //da mi ocita cenu kod promene rezdervacija

  //? izvlacenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};

  //?provera da li postoji user(kada je prijavljen) i parsiramo podatke kako bi mogli da koristimo podatke, posto stizu kao JSON
  if (userData != undefined) {
    userPars = JSON.parse(userData);
    //?proveravamo da li postoji mejl i setujemo trenutni mejl
    if (!email) {
      setPKorisnik(userPars);
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
    return data.cenaPovratne; // Vraćamo samo vrednost cenaPovratne   ---- dodala
  };

  useEffect(() => {
    cene();
  }, [tipKarte]);

  // da ocita cenu kod promene rezervacije

  useEffect(() => {
    setPomCena(ceneFilter);
    // alert('cena karte je: ' + ceneFilter);
  }, [ceneFilter]);

  //niz sa cenama
  useEffect(() => {
    cene().then((cena) => {
      setPomCena((prevCene) => ({
        ...prevCene,
        [state.id]: cena,
      }));
    });
  }, [ceneFilter]);

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
        rezervacijaLogic.data.emailKorisnika?.trim()
          ? rezervacijaLogic.data.emailKorisnika.trim()
          : email,
        rezervacijaLogic.data.imeIprezime?.trim()
          ? rezervacijaLogic.data.imeIprezime.trim()
          : pKorisnik.ime + " " + pKorisnik.prezime,
        rezervacijaLogic.data.brojTelefona?.trim()
          ? rezervacijaLogic.data.brojTelefona.trim()
          : pKorisnik.brojTelefona
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
    toast.success(
      <Trans i18nKey="description.part216">
        "Uspešno ste rezervisali kartu"
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
      <Trans i18nKey="description.part217">"Nisu uneti svi podaci"</Trans>,
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
    // Ovde mozete izvrsiti akcije sa selektovanim sedistima
    setSelectedSeats(selectedSeats);
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
  const oznakaBusaRef = useRef(); //dodala zbog prikaza busa

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
      telefonInputRef,
      oznakaBusaRef // dodala zbog busa
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

    setVal1Pov(state.pocetnaStanica); //ovo sam dopisla za deo kada menjam realnoPovratnu kartu
    setVal2Pov(state.krajnjaStanica);
    const responsePov = await LinijeApi().filterLinija(
      val1Pov,
      val2Pov,
      returnDate
    );
    const dataPov = await responsePov.json();
    setFilteredLinijePovratna(dataPov.rezultat);
  };

  useEffect(() => {
    filterLinija();
  }, [returnDate]);

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
  const [pomOznakaBus, setPomOznakaBus] = useState(""); //kod prikaza seme sedista busa prilikom izmene kod realnoPovratne karte
  const [finalOznakaBus, setFinalOznakaBus] = useState(""); // taj bus prikazujem i tu se biraju sedista kod realnoPovratne karte

  //const [linijaId_nova, setLinijaId_nova] = useState("");   //linijaId od izabrane linije busa kojom cemo da se vracamo kod promene povratne karte

  const [povIspravkaIdLinija, setPovIspravkaIdLinija] = useState(""); //da preuzme IdLinije kod realnoPovratnog busa kojeg menjamo
  const handleCheckboxChange = (id) => {
    setCheckedItemId(id);
  };

  // definise sliku busa gde biramo mesto kod realnoPovratne linije
  useEffect(() => {
    {
      izmeniPovratak
        ? setFinalOznakaBus(pomOznakaBus)
        : setFinalOznakaBus(linija.oznakaBusa);
    }
  }, [pomOznakaBus, stariPovratak]);

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
        "PrPovratna", //tipKarte,   tip karte za povratnu
        rezervacijaLogic.data.emailKorisnika?.trim()
          ? rezervacijaLogic.data.emailKorisnika.trim()
          : email,
        rezervacijaLogic.data.imeIprezime?.trim()
          ? rezervacijaLogic.data.imeIprezime.trim()
          : pKorisnik.ime + " " + pKorisnik.prezime,
        rezervacijaLogic.data.brojTelefona?.trim()
          ? rezervacijaLogic.data.brojTelefona.trim()
          : pKorisnik.brojTelefona
      )
      .then((response) => {
        console.log(response);
        //     notifySuccest();          da ne bi duplo javljalo poruku o uspesnosti rezervacije povratne karte
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
        state.pocetnaStanica, //citamo state ReadOnly
        state.krajnjaStanica, //citamo state ReadOnly
        pomDatPolazak, //korisnik promenio sa Fronta unosom novih podataka a bilo je returnDate,
        pomDatDolazak, //korisnik promenio sa Fronta unosom novih podataka
        pomPolazak, //korisnik promenio sa Fronta unosom novih podataka
        pomDolazak, //korisnik promenio sa Fronta unosom novih podataka
        povIspravkaIdLinija, //state.id,   // bilo  PovratnaIdLinija,
        state.pocetnaStanicaId, // bilo je obrnuto
        state.krajnjaStanicaId,
        userPars.idKorisnika,

        osvezenje,
        parseInt(selectedSeats),
        state.tipKarte,
        rezervacijaLogic.data.emailKorisnika?.trim()
          ? rezervacijaLogic.data.emailKorisnika.trim()
          : email,
        rezervacijaLogic.data.imeIprezime?.trim()
          ? rezervacijaLogic.data.imeIprezime.trim()
          : pKorisnik.ime + " " + pKorisnik.prezime,
        rezervacijaLogic.data.brojTelefona?.trim()
          ? rezervacijaLogic.data.brojTelefona.trim()
          : pKorisnik.brojTelefona
      )
      .then((response) => {
        console.log(response);
        notifySuccest();
      })
      .catch((error) => {
        console.log("Greška prilikom izvršavanja izmenjenog upisa karte");
        console.log(error);
        notifyWarn();
      });
  };

  //dodala da proverim hoce li da se upisu novi podaci od izmenjene povratne karte
  const preRezervacija = () => {
    RezervacijaApi()
      .pre_rezervacija(
        1,
        state.pocetnaStanica,
        state.krajnjaStanica,
        pomDatPolazak, //state.datumPolaska,
        pomDatDolazak, //state.datumDolaska,
        pomPolazak, //state.vremePolaska,
        pomDolazak, //state.vremeDolaska,
        povIspravkaIdLinija, //state.id,
        state.pocetnaStanicaId, //state.pocetnaStanicaId,
        state.krajnjaStanicaId,
        userPars.idKorisnika,
        osvezenje,
        parseInt(selectedSeats),
        state.tipKarte, //tipKarte,
        rezervacijaLogic.data.emailKorisnika?.trim()
          ? rezervacijaLogic.data.emailKorisnika.trim()
          : email,
        rezervacijaLogic.data.imeIprezime?.trim()
          ? rezervacijaLogic.data.imeIprezime.trim()
          : pKorisnik.ime + " " + pKorisnik.prezime,
        rezervacijaLogic.data.brojTelefona?.trim()
          ? rezervacijaLogic.data.brojTelefona.trim()
          : pKorisnik.brojTelefona
      )
      .then((response) => {
        //console.log(response);
        //notifySuccest();

        if (response.status === 200) {
          notifySuccest(); // Ako je status 200, prikaži uspešnu poruku
          setTimeout(() => {
            window.location.href = "/pocetna";
          }, 3000);
        }
        if (response.status === 404) {
          notifyWarn();
        }
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
    if (selectedValue === "Jednosmerna") {
      novaRezervacija();
    } else if (
      pomDateRet === "povratna" &&
      izmeniPovratak === false &&
      stariPovratak === false
    ) {
      novaRezervacijaPovratak();
      novaRezervacija();
    } else if (pomDateRet === "povratna" && izmeniPovratak === true) {
      // alert("Izmena povratne karte u toku, id karte je: "  +state.id+ " br sedista je "+ selectedSeats);
      console.log("3 uslov: menjamo datum vreme unosimo pice i sediste");
      // novaRezervacijaPovratakIzmena(state.id, state.linijaId, selectedSeats);

      preRezervacija();
      novaRezervacijaPovratakIzmena();

      // dopisano da moze samo sa picem i sedistem da se upisu novi podaci dole
      // to dole ne radi uopse nista jer mi ode u drugi uslov
    } else if (
      pomDateRet === "povratna" &&
      stariPovratak === true &&
      izmeniPovratak === false
    ) {
      console.log("4 uslov: samo unosimo pice i sediste");
      alert(
        "Izmena povratne karte je u toku ali samo sa picem i sedistem" +
          stariPovratak
      );
      //  novaRezervacijaPovratakIzmena(state.id, state.linijaId, selectedSeats);

      novaRezervacijaPovratakIzmena();
    }

    // Sacekaj nekoliko sec da te preusmeri na Pocetna.js stranicu
    setTimeout(() => {
      window.location.href = "/pocetna";
    }, 1500); // Ova vrednost u milisekundama predstavlja koliko ce trajati prikazivanje poruke pre nego sto se preusmeri (u ovom slucaju 1,5 sekunde)
  };

  //hocemo da menjamo povratnu liniju
  const newReturn = () => {
    setIzmeniPovratak(true); //novi datum povratka
    setStariPovratak(false); // prvobitno odabrani datum povratka
    setReturnDate(Date); // da bih imala praznu listu kad krenem sa novim listanjem

    //setFinalOznakaBus(state.oznakaBusa);   // da mi ne prikazuje prazno za bus kada pritisnem dugme DA
  };

  // u povratnoj liniji ostaje po starom i vreme i datum
  const oldReturn = () => {
    setIzmeniPovratak(false);
    setStariPovratak(true);
    setPomDateRet("povratna"); //da bi moglo da se pozove izmena povratne karte
    // Vrati staru vrednost u input polje za slucaj da je putnik vec nesto bio menjao
    vremeInputRef.current.value = state.vremePolaska;
    vremeDInputRef.current.value = state.vremeDolaska;
    datumInputRef.current.value = state.datumPolaska;
    datumDInputRef.current.value = state.datumDolaska;
    oznakaBusaRef.current.value = state.oznakaBusa; //dodala zbog busa
    setFinalOznakaBus(state.oznakaBusaRef);

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
    //zbog busa ubacujem naredna 2 reda da bi vratio prvobitni bus
    setIzmeniPovratak(false);
    setStariPovratak(true);
    // Vrati staru vrednost u input polje
    vremeInputRef.current.value = state.vremePolaska;
    vremeDInputRef.current.value = state.vremeDolaska;
    datumInputRef.current.value = state.datumPolaska;
    datumDInputRef.current.value = state.datumDolaska;

    oznakaBusaRef.current.value = state.oznakaBusa; //dodala da bi ocitala prvobitni bus
    setFinalOznakaBus(oznakaBusaRef);

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
                {/*  rezervacija za drugu osobu    */}
                <div className="red-1"></div>
                <hr />
                <div className="red-05"></div>
                <p className="teget">
                  <Trans i18nKey="description.part210">
                    Da li rezervišete za drugu osobu{" "}
                  </Trans>
                </p>
                <div className="red-05"></div>
                <button
                  onClick={() => setDrugiKorisnik(true)}
                  className="drugi-korisnik animated-button"
                >
                  <Trans i18nKey="description.part153"> Da </Trans>
                </button>
                &ensp;
                <button
                  onClick={() => setDrugiKorisnik(false)}
                  className="drugi-korisnik animated-button"
                >
                  <Trans i18nKey="description.part154"> Ne </Trans>
                </button>
                <div className="red-05"></div>
                {drugiKorisnik ? (
                  <div>
                    {/* -------podaci o drugom korisniku  ------  */}

                    <div className={classes.control}>
                      <div>
                        <label className="labela levo-23">
                          <Trans i18nKey="description.part1">
                            Ime i prezime
                          </Trans>
                        </label>
                      </div>
                      <input
                        className="test"
                        type="text"
                        name="imeIprezime"
                        placeholder="Ime i prezime korisnika karte"
                        onChange={rezervacijaLogic.changeHandler}
                      />
                    </div>

                  {/*
                    <div className={classes.control}>
                      <div>
                        <label className="labela levo-23">Email</label>
                      </div>
                      <input
                        className="test"
                        type="text"
                        name="emailKorisnika"
                        placeholder="Email korisnika karte"
                        onChange={rezervacijaLogic.changeHandler}
                      />
                    </div>
                  */}

                    <div className={classes.control}>
                      <div>
                        <label className="labela levo-23">
                          <Trans i18nKey="description.part17">Telefon</Trans>
                        </label>
                      </div>
                      <input
                        className="test"
                        type="text"
                        name="brojTelefona"
                        placeholder="Telefon korisnika karte"
                        onChange={rezervacijaLogic.changeHandler}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/*  kraj rezervacije za drugu osobu   */}
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
                      <Trans i18nKey="description.part211">
                        Pritisnite DA ako želite da promenite datum i vreme
                        povratka ?
                      </Trans>
                    </p>
                    <div className="red-05"></div>
                    <p className="teget">
                      <Trans i18nKey="description.part215">
                        Pritisnite NE ako želite prvobitu rezervaciju povratka !
                      </Trans>
                    </p>
                    <div className="red-05"></div>
                    <button
                      onClick={newReturn}
                      className="promena-povratka animated-button"
                    >
                      <Trans i18nKey="description.part153"> Da </Trans>
                    </button>
                    &ensp;
                    <button
                      onClick={oldReturn}
                      className="promena-povratka animated-button"
                    >
                      <Trans i18nKey="description.part154"> Ne </Trans>
                    </button>
                    <div className="red-05"></div>
                    {/*Stigli ste: {state.id+1}     */}
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
                              //  min={state.datumDolaska}   //   bilo je tako
                              //  min={mogucDatumRealnogPovratka}
                              //  min={mogucDatumRealnogPovratka ? mogucDatumRealnogPovratka.toISOString().split('T')[0] : ''}
                              min={new Date().toISOString().split("T")[0]} // Postavljanje min na trenutni datum
                              //  min={minDatRealnogPovratka}
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
                                            // setPovratnaIdLinija(linija.id);
                                            setPovIspravkaIdLinija(linija.id); //zbog prikaza sedista u busu
                                            setPomPolazak(linija.vremePolaska);
                                            setPomDolazak(linija.vremeDolaska);
                                            setPomDatPolazak(
                                              linija.datumPolaska
                                            ); // ubacila kod edita
                                            setPomDatDolazak(
                                              linija.datumDolaska
                                            );
                                            setPomDateRet("povratna"); // sluzi kod dela gde pozivamo upis u bazu podataka u karti
                                            setPomOznakaBus(linija.oznakaBusa); //da bi prikazao dinamicki slobodna mesta u busu
                                            //  setLinijaId_nova(linija.linijaId);      //da bi mogla da upisem promenjene podatke u povratnoj karti
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
                            <br />
                            <Trans i18nKey="description.part213">
                              Da li želite da postavite nov povratak ?{" "}
                            </Trans>
                            <br />
                            <button
                              onClick={handleDaClick}
                              className="promena-povratka animated-button"
                            >
                              <Trans i18nKey="description.part153"> Da </Trans>
                            </button>{" "}
                            &emsp;
                            <button
                              onClick={handleNeClick}
                              className="promena-povratka animated-button"
                            >
                              <Trans i18nKey="description.part154"> Ne </Trans>
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
                          setPomDateRet("jednosmerna");
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
                              {filteredLinije
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
                {/*  {izmeniPovratak ? cene : ceneFilter}   ne radi  */}
              </div>
              <div className="red-1"></div>
            </div>

            <div className="flex-clan">
              {/* desni deo sa prikazom autobusa */}
              <div className="autobus">
                <div className="centar">
                  {/* ubacila sam da mi olaksa testiranje pa sam sada zakomentarisala donji red
                Prvobitni tip busa: {linija.oznakaBusa} --- Izmenjeni tip busa: {finalOznakaBus}
                */}
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

                {/* finalOznakaBus mi govori koji tip busa je izabran 
                prilikom promene rezervacije realnoPovratne karte  */}

                {izmeniPovratak ? (
                  <div>
                    {(finalOznakaBus != "S2" ? (
                      ""
                    ) : (
                      <S2
                        onReservation={handleReservation}
                        linijaId={povIspravkaIdLinija}
                        pocetnaStanicaId={state.pocetnaStanicaId}
                        krajnjaStanicaId={state.krajnjaStanicaId}
                      />
                    )) ||
                      (finalOznakaBus != "MAN" ? (
                        ""
                      ) : (
                        <MAN
                          onReservation={handleReservation}
                          linijaId={povIspravkaIdLinija}
                          pocetnaStanicaId={state.pocetnaStanicaId}
                          krajnjaStanicaId={state.krajnjaStanicaId}
                        />
                      )) ||
                      (finalOznakaBus != "VH" ? (
                        ""
                      ) : (
                        <VH
                          onReservation={handleReservation}
                          linijaId={povIspravkaIdLinija}
                          pocetnaStanicaId={state.pocetnaStanicaId}
                          krajnjaStanicaId={state.krajnjaStanicaId}
                        />
                      )) ||
                      (finalOznakaBus != "MB1" ? (
                        ""
                      ) : (
                        <MB1
                          onReservation={handleReservation}
                          linijaId={povIspravkaIdLinija}
                          pocetnaStanicaId={state.pocetnaStanicaId}
                          krajnjaStanicaId={state.krajnjaStanicaId}
                        />
                      )) ||
                      (finalOznakaBus != "MB3" ? (
                        ""
                      ) : (
                        <MB3
                          onReservation={handleReservation}
                          linijaId={povIspravkaIdLinija}
                          pocetnaStanicaId={state.pocetnaStanicaId}
                          krajnjaStanicaId={state.krajnjaStanicaId}
                        />
                      )) ||
                      (finalOznakaBus != "MB4" ? (
                        ""
                      ) : (
                        <MB4
                          onReservation={handleReservation}
                          linijaId={povIspravkaIdLinija}
                          pocetnaStanicaId={state.pocetnaStanicaId}
                          krajnjaStanicaId={state.krajnjaStanicaId}
                        />
                      )) ||
                      (finalOznakaBus != "VL" ? (
                        ""
                      ) : (
                        <VL
                          onReservation={handleReservation}
                          linijaId={povIspravkaIdLinija}
                          pocetnaStanicaId={state.pocetnaStanicaId}
                          krajnjaStanicaId={state.krajnjaStanicaId}
                        />
                      )) ||
                      (finalOznakaBus != "S1" ? (
                        ""
                      ) : (
                        <S1
                          onReservation={handleReservation}
                          linijaId={povIspravkaIdLinija}
                          pocetnaStanicaId={state.pocetnaStanicaId}
                          krajnjaStanicaId={state.krajnjaStanicaId}
                        />
                      ))}
                  </div>
                ) : (
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
                )}
                {/* kraj prikaza busa u zavisnosti od toga da li je normalna povratna rez ili je prerezervacija realnoPovratne karte  */}

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
