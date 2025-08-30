import { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import RegistrationLogic from "./registration.logic";
import classes from "./registration.module.css";
import "react-toastify/dist/ReactToastify.css";

const RegistrationComponent = () => {
  const [formInputsValid, setFormInputsValid] = useState({
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

  const [showPassword, setShowPassword] = useState(false);

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

    if (!formValidation.isFormValid) return;

    registrationLogic.registracija();
  };

  return (
    <>
      <div className={classes.wrap}>
        <form onSubmit={confirmeHandler} className={classes.form}>
          <header className={classes.header}>
            <div className={classes.badge} aria-hidden="true">
              ✳︎
            </div>
            <div>
              <h1 className={classes.title}>Registracija</h1>
              <p className={classes.subtitle}>Kreirajte novi nalog</p>
            </div>
          </header>

          <div
            className={`${classes.control} ${
              formInputsValid.name ? "" : classes.invalid
            }`}
          >
            <label>Ime</label>
            <input
              type="text"
              name="ime"
              placeholder="Unesite ime"
              autoComplete="given-name"
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
            <label>Prezime</label>
            <input
              type="text"
              name="prezime"
              placeholder="Unesite prezime"
              autoComplete="family-name"
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
            <label>Korisničko ime</label>
            <input
              type="text"
              name="korisnickoIme"
              placeholder="npr. mika123"
              autoComplete="username"
              ref={korisnickoImeInputRef}
              onChange={registrationLogic.changeHandler}
            />
            {!formInputsValid.korisnickoIme && <p>Unesite korisničko ime</p>}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValid.lozinka ? "" : classes.invalid
            }`}
          >
            <label>Lozinka</label>
            <div className={classes.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="lozinka"
                placeholder="Min. 6 karaktera"
                autoComplete="new-password"
                ref={lozinkaInputRef}
                onChange={registrationLogic.changeHandler}
              />
              <button
                type="button"
                className={classes.passwordToggle}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
                title={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
              >
                {showPassword ? (
                  <i className="fa-regular fa-eye" />
                ) : (
                  <i className="fa-regular fa-eye-slash" />
                )}
              </button>
            </div>
            {!formInputsValid.lozinka && (
              <p>Lozinka ne može biti kraća od 6 karaktera</p>
            )}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValid.brojTelefona ? "" : classes.invalid
            }`}
          >
            <label>Broj telefona</label>
            <input
              type="tel"
              name="brojTelefona"
              placeholder="npr. 0631234567"
              autoComplete="tel"
              ref={brojTelefonaInputRef}
              onChange={registrationLogic.changeHandler}
            />
            {!formInputsValid.brojTelefona && <p>Unesite broj telefona</p>}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValid.email ? "" : classes.invalid
            }`}
          >
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              ref={emailInputRef}
              onChange={registrationLogic.changeHandler}
            />
            {!formInputsValid.email && <p>Unesite ispravan email</p>}
          </div>

          <button className={classes.submit}>Registruj se</button>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default RegistrationComponent;
