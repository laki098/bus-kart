import { useRef, useState, useEffect } from "react";
import RezervacijaLogic from "./rezervacija.logic";
import classes from "../registration/registration.module.css";

//import VrstaKarte from "./VrstaKarte";
//import VrstaKarte2 from "../rezervacija/VrstaKarte2";
import { Popup } from "../Popup/Popup";
import LinijeApi from "../../api/linije.api";

const RezervacijaComponent = ({ id }) => {
  const [linija, setLinija] = useState({});
  const [open, setOpen] = useState(false); /*  za popup  */

  console.log(id);
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
    rezervacija();
  }, []);

  console.log(linija);

  let [formInputsValid, setFormInputsValid] = useState({
    name: true,
    mesto: true,
    datum: true,
    vreme: true,
    email: true,
    telefon: true,
  });
  const rezervacijaLogic = RezervacijaLogic();

  const fNameInputRef = useRef();
  const mestoInputRef = useRef();
  const datumInputRef = useRef();
  const vremeInputRef = useRef();
  const emailInputRef = useRef();
  const telefonInputRef = useRef();

  const confirmeHandler = (event) => {
    event.preventDefault();

    const formValidation = rezervacijaLogic.formValidation(
      fNameInputRef,
      mestoInputRef,
      datumInputRef,
      vremeInputRef,
      emailInputRef,
      telefonInputRef
    );
    setFormInputsValid({
      name: formValidation.validName,
      mesto: formValidation.validMesto,
      datum: formValidation.validDatum,
      vreme: formValidation.validVreme,
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
        </div>
      </form>
    </>
  );
};

export default RezervacijaComponent;
