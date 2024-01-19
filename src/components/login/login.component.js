import LoginLogic from "./login.logic";
import { Link } from "react-router-dom";
import "./loginStyle.css";
import profile from "../images/profile.png";
import user from "../images/user.png";
import password from "../images/password.png";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";

import "../admin/admin.css";
import { ToastContainer } from "react-toastify";
import { useState } from "react";

const LoginComponent = () => {
  const loginLogic = LoginLogic();

  //prevodjenje start
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  const submitHandler = (event) => {
    event.preventDefault();
  }

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleToggleClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="pozadina">
      {/*  header je deo za prevodjenje*/}
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
      <form onSubmit={submitHandler}>
      <div className="main">
        <div className="sub-main sirina-20" >
          <div>
            <div className="imgs">
              <div className="container-image">
                <img src={profile} alt="profile" className="profile" />
              </div>
            </div>
            <div>
              <div>
              <div className="red-1"></div>
                <p className="naslovLogin">
                  <Trans i18nKey="description.part124">Logovanje</Trans>
                </p>{" "}
                <div className="red-1"></div>
                <div>
                  {/* <img src={user} alt="user" className="user" /> */}
                  <input
                    type="text"
                    placeholder="Korisničko ime"
                    name="korisnickoIme"
                    className="name1 input-new"
                    onChange={loginLogic.changeHandler}
                    autoComplete="username"
                  />
                </div>
                <div className="second-input">
                 <div className="passwordContainer">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Lozinka"
                    name="lozinka"
                    current-password
                    className="name1 input-new"
                    onChange={loginLogic.changeHandler}
                    autoComplete="current-password"
                  />
                  <span
                    className="passwordToggleLogin "
                    onClick={handleToggleClick}
                  >
                           {showPassword ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
                  </span>
                </div>
                </div>
                <div className="login-button">
                  <button className="button" onClick={loginLogic.login}>
                    Login
                  </button>
                </div>
                <div className="link">
                  {" "}
                  {/* bilo je "a naslov"  */}
                  <Link to="/reset.password" className=" naslov-srednji">
                    <Trans i18nKey="description.part125">
                      Zaboravljena šifra
                    </Trans>{" "}
                  </Link>{" "}
                  <div className="red-1"></div>
                  <Link
                    to="/registration.component"
                    className=" naslov-srednji"
                  >
                    <Trans i18nKey="description.part52">Registracija</Trans>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginComponent;
