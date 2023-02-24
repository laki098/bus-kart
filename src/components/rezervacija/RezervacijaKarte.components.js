import React, { Component } from "react";
import { useRef, useState } from "react";
//import {useFormik} from 'formik';

import { ToastContainer } from "react-toastify";
import "./index1.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import classes from "./RezervacijaKarte.module.css";
import "react-toastify/dist/ReactToastify.css";
import RezervacijaLogic from "./RezervacijaKarte.logic";
import VrstaKarte from "./VrstaKarte";

import { Popup } from "../Popup/Popup";

/* const regularExpression = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/); */

const RezervacijaKarteComponents = () => {
  const [open, setOpen] = useState(false);
  {
    /* / za popup /; */
  }

  let [formInputsValid, setFormInputsValid] = useState({
    ime: true,
    pol_stan: true,
    vremePol: true,
    datum: true,
    email: true,
    brtel: true,
  });
  const rezervacijaLogic = RezervacijaLogic();

  const imeInputRef = useRef();
  const pol_stanInputRef = useRef();
  const vremePolInputRef = useRef();
  const datumInputRef = useRef();
  const emailInputRef = useRef();
  const brtelInputRef = useRef();

  const confirmeHandler = (event) => {
    event.preventDefault();

    const formValidation = rezervacijaLogic.formValidation(
      imeInputRef,
      pol_stanInputRef,
      vremePolInputRef,
      datumInputRef,
      emailInputRef,
      brtelInputRef
    );
    setFormInputsValid({
      ime: formValidation.validIme,
      pol_stan: formValidation.validPol_stan,
      vremePol: formValidation.validVremePol,
      datum: formValidation.validDatum,
      email: formValidation.validEmail,
      brtel: formValidation.validBrtel,
    });
    if (!formValidation.isFormValid) {
      return;
    }

    rezervacijaLogic.registracija();
    {
      /*  /  vidi malo slovo /; */
    }
  };

  const [value, setValue] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());

  function VrstaKarte() {
    alert("Odaberi vrstu karte!");
  }

  {
    /* /   ------------------------------------     /; */
  }
  const [message, setMessage] = useState("");

  const handleClick = (event) => {
    event.preventDefault();

    if (message.trim().length !== 0) {
      alert("input polje NIJE prazno");
      console.log("input polje NIJE prazno");
    } else {
      alert("input polje JESTE prazno");
      console.log("input polje JESTE prazno");
    }
  };

  {
    /* /   ------------------------------------     /; */
  }

  return (
    <>
      <form onSubmit={confirmeHandler} className={classes.form}>
        <div>
          <div className="tableNova">
            <h2>Rezervacija i kupovina karte</h2>
            <br />
            <br />

            <div
              className={`${classes.control} ${
                formInputsValid.ime ? "" : classes.invalid
              }`}
            >
              <label>
                Unesite ime i prezime: <span className="crveno">*</span>
              </label>
              <input
                type="text"
                className="inputTextVeci"
                name="ime"
                placeholder="Unesite ime i prezime"
                onChange={rezervacijaLogic.changeHandler}
                ref={imeInputRef}
              />
              {!formInputsValid.ime && <p>Unesite ime</p>}
            </div>

            <div
              className={`${classes.control} ${
                formInputsValid.pol_stan ? "" : classes.invalid
              }`}
            >
              <label className="labela" style={{ color: "#053e78" }}>
                Unesite mesto polaska: <span className="crveno">*</span>
              </label>
              <input
                type="text"
                className="inputTextVeci"
                name="pol_stan"
                placeholder="Unesite mesto polaska"
                onChange={rezervacijaLogic.changeHandler}
                ref={pol_stanInputRef}
              />
              {!formInputsValid.pol_stan && <p>Unesite mesto polaska</p>}
            </div>

            <div
              className={`${classes.control} ${
                formInputsValid.vremePol ? "" : classes.invalid
              }`}
            >
              <label>
                Izaberite vreme polaska: <span className="crveno">*</span>
              </label>
              <input
                type="time"
                className="inputTextVeci"
                name="vremePol"
                placeholder="Unesite vreme polaska"
                onChange={rezervacijaLogic.changeHandler}
                ref={vremePolInputRef}
              />{" "}
              {!formInputsValid.vremePol && <p>Unesite vreme polaska</p>}
            </div>

            <div
              className={`${classes.control} ${
                formInputsValid.datPol ? "" : classes.invalid
              }`}
            >
              <label className="labela" style={{ color: "#053e78" }}>
                Izaberite datum polaska: <span className="crveno">*</span>
              </label>
              <DatePicker
                className="inputTextVeci"
                selected={startDate}
                value={value}
                name="datum"
                ref={datumInputRef}
                onChange={rezervacijaLogic.changeHandler}
              />{" "}
              {/*  / vidi onChange  bilo je :   onChange={(date) => setStartDate(date)} / */}
              {!formInputsValid.datPol && <p>Unesite datum polaska</p>}
            </div>

            <div
              className={`${classes.control} ${
                formInputsValid.email ? "" : classes.invalid
              }`}
            >
              <label className="labela">
                E-mail: <span className="crveno">*</span>
              </label>
              <input
                type="email"
                className="inputTextVeci"
                name="email"
                placeholder="Unesite E-mail"
                ref={emailInputRef}
                onChange={rezervacijaLogic.changeHandler}
              />
              {!formInputsValid.email && <p>Unesite E-mail</p>}
            </div>

            <div
              className={`${classes.control} ${
                formInputsValid.brtel ? "" : classes.invalid
              }`}
            >
              <label className="labela">
                Broj telefona: <span className="crveno">*</span>
              </label>
              <input
                type="text"
                className="inputTextVeci"
                name="brtel"
                placeholder="Unesite broj telefona (npr. 064123456)"
                ref={brtelInputRef}
                onChange={rezervacijaLogic.changeHandler}
              />
              {!formInputsValid.brtel && <p>Unesite broj telefona</p>}
              <label className="labela"> Odaberite vrstu karte </label>
            </div>

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

            <div>
              <button
                type="submit"
                className={classes.submit}
                onClick={handleClick}
              >
                Pošalji
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default RezervacijaKarteComponents;
