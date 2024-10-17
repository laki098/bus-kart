import React, { useState, useRef } from "react";
import "./reset.css";
import "./loginStyle.css";
import bus from "../images/bus.jpg";
import "../admin/admin.css";
import { useTranslation, Trans } from "react-i18next";
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import apiUrl from "../../apiConfig";
import ToastNotification from "../../toastNotification/ToastNotification";
import { ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const form = useRef();
  const [email, setEmail] = useState("");
  const { notifySuccess, notifyWarn } = ToastNotification();

  const submit = (e) => {
    e.preventDefault();
  };

  const getResetPassword = async () => {
    const response = await fetch(`${apiUrl}/korisnik/zaboravljena-sifra`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (response.ok) {
      if (response.status === 200) {
        notifySuccess(data.message);
        setTimeout(() => {
          window.location.href = "/pocetna";
        }, 2500);
      }
    } else {
      if (response.status === 404) {
        notifyWarn(data.message);
      }
    }
  };

  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();

  return (
    <div style={{ backgroundColor: "#e1e3eb" }}>
      <header>
        <div style={{ textAlign: "right", marginRight: "3rem" }}>
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
      <form ref={form} onSubmit={submit}>
        <div className="main" style={{ paddingTop: "0.625rem" }}>
          <div className="sub-main">
            <div>
              <div className="imgs">
                <div className="container-image1">
                  <img src={bus} alt="bus" className="bus" />
                </div>
              </div>
              <br />
              <p className="naslov">
                <Trans i18nKey="description.part120">Promeni lozinku</Trans>
              </p>
              <br />
              <br />
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="input-new name1"
                  name="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br />
              <br />
              <div className="login-button">
                <button className="button" onClick={getResetPassword}>
                  <Trans i18nKey="description.part121">Potvrdi</Trans>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
