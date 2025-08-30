import LoginLogic from "./login.logic";
import { Link } from "react-router-dom";
import "./loginStyle.css";
import profile from "../images/profile.png";

import { useTranslation, Trans } from "react-i18next";
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";

import { ToastContainer } from "react-toastify";
import { useState } from "react";

import LanguageSwitcher from "../header/header";

const LoginComponent = () => {
  const loginLogic = LoginLogic();

  // prevod
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  // show/hide lozinka
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="pozadina">
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <div className="login-wrap">
        <form
          className="login-card"
          onSubmit={(e) => {
            e.preventDefault();
            loginLogic.login();
          }}
        >
          <div className="login-header">
            <div className="login-avatar">
              <img src={profile} alt="profile" />
            </div>
            <div>
              <h1 className="login-title">
                <Trans i18nKey="description.part124">Logovanje</Trans>
              </h1>
              <p className="login-subtitle">Dobrodošli nazad</p>
            </div>
          </div>

          <div className="login-fields">
            <label className="login-label">Korisničko ime</label>
            <input
              type="text"
              name="korisnickoIme"
              autoComplete="username"
              className="login-input"
              placeholder="Unesite korisničko ime"
              onChange={loginLogic.changeHandler}
            />

            <label className="login-label">Lozinka</label>
            <div className="login-password">
              <input
                type={showPassword ? "text" : "password"}
                name="lozinka"
                autoComplete="current-password"
                className="login-input"
                placeholder="Unesite lozinku"
                onChange={loginLogic.changeHandler}
              />
              <button
                type="button"
                className="login-eye"
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
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="login-links">
            <Link to="/reset.password">Zaboravljena šifra</Link>
            <span>•</span>
            <Link to="/registration.component">Registrujte se</Link>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginComponent;
