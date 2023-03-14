import { useRef, useState, useEffect } from "react";
import RezervacijaLogic from "./rezervacija.logic";
import classes from "../registration/registration.module.css";

//import VrstaKarte from "./VrstaKarte";
//import VrstaKarte2 from "../rezervacija/VrstaKarte2";
import { Popup } from "../Popup/Popup";
import LinijeApi from "../../api/linije.api";
import Qrcode from "./QrCode";

const RezervacijaComponent = ({ id }) => {
  const [linija, setLinija] = useState({});
  const [open, setOpen] = useState(false); /*  za popup  */

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

  const change = (event) => {
    setOsvezenje(osvezenje);
  };


  const code = {
    mestoPolaska: linija.mestoPolaska,
    mestoDolaska: linija.mestoDolaska,
    datumPolaska: linija.datumPolaska,
    datumDolaska: linija.datumDolaska,
    vremePolaska: linija.vremePolaska,
    vremeDolaska: linija.vremeDolaska,
    osvezenje: osvezenje
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
            type="date"
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
            type="date"
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
            type="time"
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
            type="time"
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
            name="telefon"
            ref={telefonInputRef}
            onChange={rezervacijaLogic.changeHandler}
          />
          {!formInputsValid.telefon && <p>Unesite telefon</p>}
        </div>

        <select
            type="text"
            name="osvezenje"
            value={osvezenje}
            onChange={(event) => {setOsvezenje(event.target.value)}}
            >
          <option disabled={false} value="">
            Izaberite osvezenje
          </option>
          <option>Kafa</option>
          <option>Caj</option>
          <option>Nes</option>
        </select>

        <div>
          {/*  / ---------------------------POPUP----------------------------------    / */}

          <div>
            <button onClick={() => setOpen(true)} className={classes.submit}>
              {" "}
              Vrsta karte
            </button>
            {open ? (
              <Popup
                text="Birate vrstu karte!"
                closePopup={() => setOpen(false)}
              />
            ) : null}
          </div>

          <br />
          <br />
          <button className={classes.submit}>Rezervisi kartu</button>

          <p>
            Korisnik je kupio kartu od mesta {linija.mestoPolaska} do mesta{" "}
            {linija.mestoDolaska} i to datuma {" "}
            {linija.datumPolaska} za vreme {linija.vremePolaska} casova i dolazi{" "}
            {linija.datumDolaska} i to u vremenu {linija.vremeDolaska} casova i korisnik bira osvezenje {osvezenje}
          </p>
        </div>
      </form>
      <Qrcode code={code} />
    </>
  );
};

export default RezervacijaComponent;
