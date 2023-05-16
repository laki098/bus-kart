import { useRef, useState, useEffect } from "react";
import RezervacijaLogic from "./rezervacija.logic";
import classes from "../registration/registration.module.css";
import LinijeApi from "../../api/linije.api";
import Qrcode from "./QrCode";
import  "../rezervacije/index1.css"
import "./sedista/sedista.css";

const RezervacijaComponent = ({ id }) => {
  const [linija, setLinija] = useState({});
  var count = 0;

  const rezervacija = async () => {
    const response = await LinijeApi().filterLinijaID(id);
    const data = await response.data; // kako bi dobili vrednosti koje cemo koristiti za popuvanjavanje input polja
    let polazak = data.datumPolaska.split(",");
    let dolazak = data.datumDolaska.split(",");
    const linija = {
      ...data,
      datumPolaska: new Date(+polazak[0], +polazak[1] - 1, +polazak[2] + 1)
        .toISOString()
        .substr(0, 10),
      datumDolaska: new Date(+dolazak[0], +dolazak[1] - 1, +dolazak[2] + 1) //+ prebacuje u int iz stringa
        .toISOString()
        .substr(0, 10),
    };
    setLinija(linija);
  };

  useEffect(() => {
    if (id) {
      rezervacija();
    }
  }, []);


  const [osvezenje, setOsvezenje] = useState('');

  /* const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  } */

 

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }

  const [selectedKarta, setSelectedKarta] = useState('');
  const handleKarte = (event) => {
    setSelectedKarta(event.target.value)
  };


  
  const [rezervacije, setRezervacije] = useState(Array(57).fill(false));
  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([  ]);
  const [brojIzabranihSedista, setBrojIzabranihSedista] = useState(0);
  const [ukupnaCena, setUkupnaCena] = useState(0);
 
  function handleClick(index) {
  const noviNiz = [...rezervacije];
  console.log(index + 1);
  noviNiz[index] = !noviNiz[index];

  setRezervacije(noviNiz);
  const noviNizRezervacija = noviNiz
    .map((rezervisano, index) => (rezervisano ? index + 1 : null))
    .filter(sediste => sediste !== null);
  setTrenutnaRezervacija(noviNizRezervacija);
  const brojIzabranih = noviNiz.filter(s => s).length;
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
    switch(selectedTicketType) {
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
    radio:selectedValue,
    sediste:trenutnaRezervacija,
    cena:ukupnaCena
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
      <form onSubmit={confirmeHandler} className={classes.form}>
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
            defaultValue={linija.mestoPolaska}
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
            defaultValue={linija.mestoDolaska}
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
            defaultValue={linija.datumPolaska}
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
            defaultValue={linija.datumDolaska}
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
            defaultValue={linija.vremePolaska}
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
            defaultValue={linija.vremeDolaska}
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
            ref={telefonInputRef}
            onChange={rezervacijaLogic.changeHandler}
          />
          {!formInputsValid.telefon && <p>Unesite telefon</p>}
        </div>

        <div className="radio">
        <select className="select"
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
         
         

  
        <div className="radio" >
          <select className="radio1"
          type='text'
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
          <input type="date" id="returnDate" name="returnDate"  min={new Date().toISOString().split('T')[0]} />
        </div>
        
)} <div><p>Cena karte: {calculateTicketPrice(selectedValue)} dinara</p>
        <p>Broj izabranih sedišta: {brojIzabranihSedista}</p>
        <p>Ukupna cena: {ukupnaCena} dinara</p></div>


          <div className="autobus">
      {rezervacije.map((rezervisano, index) => (
        <div
          key={index}
          className={`sediste ${rezervisano ? 'rezervisano' : ''}`}
          onClick={() => handleClick(index)}
          style={{
            marginRight: index % 4 === 1 ? '1.5rem' : 1,
            width: index % 4 === 4 || index === rezervacije.length - 1 ? 'calc(20% - 0rem)' : '20%',
            marginLeft:
              index >= rezervacije.length - 5 && index <= rezervacije.length - 5 ? 'calc(5% - 1rem)' :
              index >= rezervacije.length - 4 && index <= rezervacije.length - 4 ? 'calc(5% - 0.6rem)' :
              index >= rezervacije.length - 3 && index <= rezervacije.length - 3 ? 'calc(5% - 2rem)' :
              index >= rezervacije.length - 2 && index <= rezervacije.length  ? 'calc(5% - 0.6rem)' :/* 
              index % 4 === 4 && index !== 0 ? '2.5rem' : */
              0,
          }}
        >
          {index + 1}
        </div>
      ))}
      <div>
        Trenutno rezervisano mesto: {trenutnaRezervacija + ''|| 'Nijedno'}
      </div>
      <ul className="showcase">
        <li>
          <div className="seat selected"></div>
          <small>Izabrano</small>
        </li>

        <li>
          <div className="seat occupied"></div>
          <small>Zauzeto</small>
        </li>
      </ul>
      <button>Izaberite sediste</button>
   
    </div>
         {/*  <Autobus /> */}

          <br />
          <br />
          <button className={classes.submit}>Rezervisi kartu</button>

          <p>
            Korisnik je kupio kartu od mesta {linija.mestoPolaska} do mesta{" "}
            {linija.mestoDolaska} i to datuma {linija.datumPolaska} za vreme{" "}
            {linija.vremePolaska} casova i dolazi {linija.datumDolaska} i to u
            vremenu {linija.vremeDolaska} casova i korisnik bira osvezenje{" "}
            {osvezenje}.Korisnik je izabrao   {selectedValue} kartu i  cena te karte je {ukupnaCena } dinara i rezervisao je sediste broj {trenutnaRezervacija + ''} 
          </p>
        </div>
      </form>
      <Qrcode code={code} />
     {/* <BusSedista /> */} 
     
    </>
  );
};

export default RezervacijaComponent;
