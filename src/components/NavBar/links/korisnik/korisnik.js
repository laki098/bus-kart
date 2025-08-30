import React, { useState, useEffect } from "react";
import KorisnikApi from "../../../../api/korisnikApi";
import KorisnikLogic from "../../../admin/korisnikLogic";
import "../korisnik/korisnik.css";

import { useTranslation, Trans } from "react-i18next";
import "../../../NavBar/links/i18n";
import "../../../../components/NavBar/links/i18n";

import cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LanguageSwitcher from "../../../header/header";

const Korisnik = () => {
  const [korisnik, setKorisnik] = useState({});

  // cookie korisnik
  const userData = cookies.get("userData");
  const userPars = userData ? JSON.parse(userData) : {};

  const korisnikLogic = KorisnikLogic();

  useEffect(() => {
    const getKorisnik = async () => {
      const response = await KorisnikApi().filterKorisnikId(
        userPars.idKorisnika
      );
      const data = await response.data;
      setKorisnik(data.korisnik || {});
    };
    getKorisnik();
  }, [userPars.idKorisnika]);

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      idKorisnik: userPars.idKorisnika,
      korisnickoIme: formData.get("korisnickoIme"),
      ime: formData.get("ime"),
      prezime: formData.get("prezime"),
      brojTelefona: formData.get("brojTelefona"),
      email: formData.get("email"),
      role: userPars.rola,
    };
    korisnikLogic.editKorisnik(data);
    // mala pauza pa povratak
    setTimeout(() => (window.location.href = "/pocetna"), 2000);
  };

  // i18n
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  // inicijali za avatar
  const initials = `${(korisnik?.ime || " ").charAt(0)}${(
    korisnik?.prezime || " "
  ).charAt(0)}`.toUpperCase();

  return (
    <div>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />
      <div className="profile-wrap">
        <form onSubmit={submitHandler} className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar" aria-hidden>
              {initials.trim() || "👤"}
            </div>
            <div>
              <h1 className="profile-title">
                <Trans i18nKey="description.part159">Korisnik</Trans>
              </h1>
              <p className="profile-subtitle">
                {korisnik?.email || "Ažurirajte podatke profila"}
              </p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="field">
              <label htmlFor="korisnickoIme" className="field-label">
                <Trans i18nKey="description.part44">Korisničko ime</Trans>
              </label>
              <input
                id="korisnickoIme"
                name="korisnickoIme"
                type="text"
                className="field-input"
                defaultValue={korisnik.korisnickoIme}
                required
                onChange={korisnikLogic.changeHandler}
              />
            </div>

            <div className="field">
              <label htmlFor="ime" className="field-label">
                <Trans i18nKey="description.part40">Ime</Trans>
              </label>
              <input
                id="ime"
                name="ime"
                type="text"
                className="field-input"
                defaultValue={korisnik.ime}
                required
                onChange={korisnikLogic.changeHandler}
              />
            </div>

            <div className="field">
              <label htmlFor="prezime" className="field-label">
                <Trans i18nKey="description.part42">Prezime</Trans>
              </label>
              <input
                id="prezime"
                name="prezime"
                type="text"
                className="field-input"
                defaultValue={korisnik.prezime}
                required
                onChange={korisnikLogic.changeHandler}
              />
            </div>

            <div className="field">
              <label htmlFor="brojTelefona" className="field-label">
                <Trans i18nKey="description.part48">Broj telefona</Trans>
              </label>
              <input
                id="brojTelefona"
                name="brojTelefona"
                type="text"
                className="field-input"
                defaultValue={korisnik.brojTelefona}
                required
                onChange={korisnikLogic.changeHandler}
              />
            </div>

            <div className="field field--full">
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="field-input"
                defaultValue={korisnik.email}
                required
                onChange={korisnikLogic.changeHandler}
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="profile-btn">
              <Trans i18nKey="description.part129">Sačuvaj</Trans>
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Korisnik;
