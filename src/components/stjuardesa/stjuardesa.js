import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cookies from "js-cookie";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../rezervacije/i18n";


const Stjuardesa = () => {
  const [stjuardesaLinija, setStjuardesaLinija] = useState([]);

  //? izvlacenje korisnika iz cookisa
  let userData = cookies.get("userData");
  let userPars = {};

  //? pitamo ga da li je prijvljen, ako nije da ne odradi to parsiranje u json.
  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }
  console.log(userPars);

  const getStjuardesaLinija = async () => {
    const response = await fetch(
      `http://localhost:5000/stjuardesa/${userPars.idKorisnika}`
    );
    const data = await response.json();
    console.log(data.izvlacenjeLinija);
    setStjuardesaLinija(data.izvlacenjeLinija);
  };

  useEffect(() => {
    getStjuardesaLinija();
  }, []);

  //prevodjenje start
  const lngs = {
      en: { nativeName: "Engleski" },
      de: { nativeName: "Srpski" },
    };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <>
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

      <div className="labela-stanica labela-stanica-naslov red-1">
      <Trans i18nKey="description.part189">  Aktivne linije    </Trans>
      </div>
      <div className="stampajLiniju">
      <div class="rowTabela korisniciStjuardesa">
        <ul>
          {stjuardesaLinija.map((linija) => (
            <div key={linija.id}>
              <li class="column centar">
              <Trans i18nKey="description.part31">  Početna stanica   </Trans>
              </li>
              <li className="column podaci-stjuardesa centar">{linija.pocetnaStanica.naziv}</li>
              <li class="column centar">
              <Trans i18nKey="description.part32">  Dolazna stanica   </Trans>
              </li>
              <li className="column podaci-stjuardesa centar">{linija.krajnjaStanica.naziv}</li>
              <li class="column centar">
              <Trans i18nKey="description.part11"> Vreme polaska   </Trans>
              </li>
              <li className="column podaci-stjuardesa centar">{linija.vremePolaska}</li>
              <li class="column centar">
              <Trans i18nKey="description.part33"> Datum polaska   </Trans>
              </li>
              <li className="column podaci-stjuardesa centar">{linija.datumPolaska}</li>
              <li class="column centar">
              <Link
                to={{
                  pathname: `${linija.id}/stjuardesaLinija`,
                  state: {
                    linija: linija, // Prosleđujemo ceo objekat linije kao stanje
                  },
                }}
              >
                <button className="buttonSwitch"><p >
                <Trans i18nKey="description.part190"> Čekiranje   </Trans>
                </p></button>
              </Link>
              </li>
            </div>
          ))}
        </ul>
      </div>
      </div>
    </>
  );
};

export default Stjuardesa;
