import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import KorisnikApi from "../../../../api/korisnikApi";
import KorisnikLogic from "../../../admin/korisnikLogic";
import "../korisnik/korisnik.css";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../../../NavBar/links/i18n";
import "../../../../components/NavBar/links/i18n";

import cookies from "js-cookie";

//import { useAlert } from 'react-alert';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Korisnik = () => {
  const [korisnik, setKorisnik] = useState({});

  //? izvlacenje korisnika iz cookisa
  let userData = cookies.get("userData");
  let userPars = {};

  //? pitamo ga da li je prijvljen, ako nije da ne odradi to parsiranje u json.
  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }

  useEffect(() => {
    getKorisnik();
  }, []);
  const korisnikLogic = KorisnikLogic();

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
  };

  const getKorisnik = async () => {
    const response = await KorisnikApi().filterKorisnikId(userPars.idKorisnika);
    const data = await response.data;

    setKorisnik(data.korisnik);
  };


  const back = () => {
    setTimeout(() => {
      window.location.href = "/pocetna";
    }, 2000);
  };

  //prevodjenje start
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <div>
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

      <div className="red-5"></div>

      <div className="stampajLiniju ">
        <div className="tabela-stanica ">
          <form onSubmit={submitHandler}>
            {" "}
            {/* className="form-user"   */}
            <div className="user-control">
              <div className="red-1"></div>
              <label className="labela-stanica labela-stanica-vece veliki-naslov">
                <Trans i18nKey="description.part159"> Korisik </Trans>
              </label>
              <div className="red-1"></div>
              <div className="red-1"></div>

              <div className="red-05">
                <label className="labela-stanica labela-stanica-vece">
                  <Trans i18nKey="description.part44"> Korisničko ime </Trans>
                </label>{" "}
                {/*  className="user-label"    */}
              </div>
              {/* className="user-input"   */}
              <input
                className="user-input"
                defaultValue={korisnik.korisnickoIme}
                type="text"
                required
                name="korisnickoIme"
                onChange={korisnikLogic.changeHandler}
              ></input>

              <div className="red-05"></div>
            </div>
            <div className="user-control">
              <div className="red-05">
                <label className="labela-stanica labela-stanica-vece">
                  <Trans i18nKey="description.part40"> Ime </Trans>
                </label>
              </div>
              <input
                className="user-input"
                defaultValue={korisnik.ime}
                type="text"
                required
                name="ime"
                onChange={korisnikLogic.changeHandler}
              ></input>
            </div>
            <div className="red-05"></div>
            <div className="user-control">
              <div className="red-05">
                <label className="labela-stanica labela-stanica-vece">
                  <Trans i18nKey="description.part42"> Prezime </Trans>
                </label>
              </div>
              <input
                className="user-input"
                defaultValue={korisnik.prezime}
                type="text"
                required
                name="prezime"
                onChange={korisnikLogic.changeHandler}
              ></input>
            </div>
            <div className="user-control">
              <div className="red-05">
                <label className="labela-stanica labela-stanica-vece">
                  <Trans i18nKey="description.part48"> Broj telefona </Trans>
                </label>
              </div>
              <input
                className="user-input"
                defaultValue={korisnik.brojTelefona}
                type="text"
                required
                name="brojTelefona"
                onChange={korisnikLogic.changeHandler}
              ></input>
            </div>
            <div className="user-control">
              <div className="red-05">
                <label className="labela-stanica labela-stanica-vece">
                  Email
                </label>
              </div>
              <input
                className="user-input"
                defaultValue={korisnik.email}
                type="text"
                required
                name="email"
                onChange={korisnikLogic.changeHandler}
              ></input>
            </div>
            <div className="red-1"></div>
            <div>
              <button type="submit" onClick={back}  className="buttonSwitch">
                {" "}
                {/*  user-button   */}
                <Trans i18nKey="description.part129"> Sačuvaj </Trans>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Korisnik;
