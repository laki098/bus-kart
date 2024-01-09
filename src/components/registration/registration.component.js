import { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import RegistrationLogic from "./registration.logic";
import classes from "./registration.module.css";
import "react-toastify/dist/ReactToastify.css";

const RegistrationComponent = () => {
  let [formInputsValid, setFormInputsValid] = useState({
    name: true,
    prezime: true,
    email: true,
    korisnickoIme: true,
    lozinka: true,
    brojTelefona: true,
  });
  const registrationLogic = RegistrationLogic();

  const fNameInputRef = useRef();
  const prezimeInputRef = useRef();
  const korisnickoImeInputRef = useRef();
  const emailInputRef = useRef();
  const brojTelefonaInputRef = useRef();
  const lozinkaInputRef = useRef();

  const confirmeHandler = (event) => {
    event.preventDefault();

    const formValidation = registrationLogic.formValidation(
      fNameInputRef,
      prezimeInputRef,
      emailInputRef,
      korisnickoImeInputRef,
      lozinkaInputRef,
      brojTelefonaInputRef
    );
    setFormInputsValid({
      name: formValidation.validName,
      prezime: formValidation.validPrezime,
      email: formValidation.validEmail,
      korisnickoIme: formValidation.validKorisnickoIme,
      brojTelefona: formValidation.validPhone,
      lozinka: formValidation.validLozinka,
    });
    if (!formValidation.isFormValid) {
      return;
    }

    registrationLogic.registracija();
  };

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleToggleClick = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <>
      <form onSubmit={confirmeHandler} className={classes.form}>
        <div
          className={`${classes.control} ${
            formInputsValid.name ? "" : classes.invalid
          }`}
        >
          <label>Ime:</label>
          <input
            type="text"
            name="ime"
            onChange={registrationLogic.changeHandler}
            ref={fNameInputRef}
          />
          {!formInputsValid.name && <p>Unesite ime</p>}
        </div>
        <div
          className={`${classes.control} ${
            formInputsValid.prezime ? "" : classes.invalid
          }`}
        >
          <label>Prezime:</label>
          <input
            type="text"
            name="prezime"
            ref={prezimeInputRef}
            onChange={registrationLogic.changeHandler}
          />
          {!formInputsValid.prezime && <p>Unesite prezime</p>}
        </div>
        <div
          className={`${classes.control} ${
            formInputsValid.korisnickoIme ? "" : classes.invalid
          }`}
        >
          <label>Koriscko ime:</label>
          <input
            type="text"
            name="korisnickoIme"
            ref={korisnickoImeInputRef}
            onChange={registrationLogic.changeHandler}
          ></input>
          {!formInputsValid.korisnickoIme && <p>Unesite korisničko ime</p>}
        </div>
        <div
          className={`${classes.control} ${
            formInputsValid.lozinka ? "" : classes.invalid
          }`}
        >
          <label>Lozinka:</label>
          <div className={classes.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="lozinka"
              ref={lozinkaInputRef}
              onChange={registrationLogic.changeHandler}
            />
            <span
              className={classes.passwordToggle}
              onClick={handleToggleClick}
            >
              {showPassword ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
            </span>
          </div>
          {!formInputsValid.lozinka && <p>Unesite lozinku</p>}
        </div>
        <div
          className={`${classes.control} ${
            formInputsValid.brojTelefona ? "" : classes.invalid
          }`}
        >
          <label>Broj telefona:</label>
          <input
            type="text"
            name="brojTelefona"
            ref={brojTelefonaInputRef}
            onChange={registrationLogic.changeHandler}
          ></input>
          {!formInputsValid.brojTelefona && <p>Unesite broj telefona</p>}
        </div>
        <div
          className={`${classes.control} ${
            formInputsValid.email ? "" : classes.invalid
          }`}
        >
          <label>Email:</label>
          <input
            type="email"
            name="email"
            ref={emailInputRef}
            onChange={registrationLogic.changeHandler}
          ></input>
          {!formInputsValid.email && <p>Unesite email</p>}
        </div>
        <div>
          <button className={classes.submit}>Registruj se</button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default RegistrationComponent;
