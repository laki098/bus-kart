import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import KorisnikLogic from "./korisnikLogic";

import "./ListBus.css";
import "./userChange.css";

import { useTranslation, Trans } from "react-i18next";
import "../../components/NavBar/links/i18n";
import "../../components/rezervacije/i18n";
import { ToastContainer } from "react-toastify";
import LanguageSwitcher from "../header/header";

const KorisnikChange = () => {
  const [korisnik, setKorisnik] = useState({});
  const { idKorisnik } = useParams();
  const [privremenaRola, setPrivremenaRola] = useState(false);

  useEffect(() => {
    getKorisnik();
  }, []);

  const korisnikLogic = KorisnikLogic();

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      idKorisnik: idKorisnik,
      korisnickoIme: formData.get("korisnickoIme"),
      ime: formData.get("ime"),
      prezime: formData.get("prezime"),
      brojTelefona: formData.get("brojTelefona"),
      email: formData.get("email"),
      role: formData.get("role"),
      vremeTrajanjaRole: formData.get("vremeTrajanjaRole"),
      privremenaRola,
    };
    korisnikLogic.editKorisnik(data);
  };

  const handleChange = () => {
    setPrivremenaRola((prev) => !prev);
  };

  const getKorisnik = async () => {
    const response = await KorisnikApi().filterKorisnikId(idKorisnik);
    const data = await response.data;

    setKorisnik(data.korisnik);
  };

  //prevodjenje start
  const lngs = {
    en: { nativeName: "En" },
    sr: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <div>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <div className="red-1"></div>

      <form onSubmit={submitHandler}>
        <div className="userForm-card userForm-cardBody userForm-form">
          {/* Korisničko ime */}
          <div className="userForm-field">
            <div className="userForm-label">
              <label>
                <Trans i18nKey="description.part44">Korisničko ime</Trans>
              </label>
            </div>

            <input
              defaultValue={korisnik.korisnickoIme}
              type="text"
              required
              name="korisnickoIme"
              className="userForm-input"
              onChange={korisnikLogic.changeHandler}
            />
          </div>

          {/* Ime */}
          <div className="userForm-field">
            <div className="userForm-label">
              <label>
                <Trans i18nKey="description.part40">Ime</Trans>
              </label>
            </div>

            <input
              defaultValue={korisnik.ime}
              type="text"
              required
              name="ime"
              className="userForm-input"
              onChange={korisnikLogic.changeHandler}
            />
          </div>

          {/* Prezime */}
          <div className="userForm-field">
            <div className="userForm-label">
              <label>
                <Trans i18nKey="description.part42">Prezime</Trans>
              </label>
            </div>

            <input
              defaultValue={korisnik.prezime}
              type="text"
              required
              name="prezime"
              className="userForm-input"
              onChange={korisnikLogic.changeHandler}
            />
          </div>

          {/* Broj telefona */}
          <div className="userForm-field">
            <div className="userForm-label">
              <label>
                <Trans i18nKey="description.part48">Broj telefona</Trans>
              </label>
            </div>

            <input
              defaultValue={korisnik.brojTelefona}
              type="text"
              required
              name="brojTelefona"
              className="userForm-input"
              onChange={korisnikLogic.changeHandler}
            />
          </div>

          {/* Email */}
          <div className="userForm-field">
            <div className="userForm-label">
              <label>Email</label>
            </div>

            <input
              defaultValue={korisnik.email}
              type="text"
              required
              name="email"
              className="userForm-input"
              onChange={korisnikLogic.changeHandler}
            />
          </div>

          {/* Privremena rola */}
          <div className="userForm-field">
            <div className="userForm-label">
              <label>
                <Trans i18nKey="description.part157">Privremena rola</Trans>
              </label>
            </div>

            <input
              type="checkbox"
              onChange={handleChange}
              value={privremenaRola}
              className="userForm-checkbox"
            />
            {privremenaRola && (
              <>
                &ensp;{" "}
                <label>
                  <Trans i18nKey="description.part158">
                    Vreme trajanja role
                  </Trans>
                </label>{" "}
                &ensp;
                <input
                  type="number"
                  name="vremeTrajanjaRole"
                  className="userForm-input"
                  onChange={korisnikLogic.changeHandler}
                />
              </>
            )}
          </div>

          {/* Role */}
          <div className="userForm-field">
            <div className="userForm-label">
              <label>Role</label>
            </div>

            <select
              defaultValue={korisnik.role}
              type="text"
              required
              name="role"
              className="userForm-select"
              onChange={korisnikLogic.changeHandler}
            >
              <option value="korisnik">
                <Trans i18nKey="description.part159">Korisnik</Trans>
              </option>
              <option value="menadzer">
                <Trans i18nKey="description.part160">Menadžer</Trans>
              </option>
              <option value="admin">Admin</option>
              <option value="stjuardesa">
                <Trans i18nKey="description.part161">Stjuardesa</Trans>
              </option>
              <option value="biletar">
                <Trans i18nKey="description.part162">Biletar</Trans>
              </option>
              <option value="vozac">
                <Trans i18nKey="description.part163">Vozač</Trans>
              </option>
            </select>
          </div>

          {/* Sačuvaj */}
          <div className="userForm-actions">
            <button type="submit" className="userForm-button">
              <Trans i18nKey="description.part129">Sačuvaj</Trans>
            </button>
          </div>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};
export default KorisnikChange;
