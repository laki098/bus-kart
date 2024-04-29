import React from "react";
import "./kontakt.css";

import "./i18n"; // za prevodjenje
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

//import SeatSabiranje from "../../rezervacije/proba/seatbiranje";
//import Autobus from "../../rezervacije/sedista/autobus";

const Kontakt = () => {
  //prevodjenje
  const lngs = {
    en: { nativeName: "En" },
    sr: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

  return (
    <div>
      {/*  header je deo za prevodjenje*/}
      <header>
        <div className="jezici">
          {Object.keys(lngs).map((lng) => (
            <button
              key={lng}
              className="jezici-dugme-promena"
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

      


      <section className="distance">
        <div className="contact row1">
          <div className="contact_prikaz">
            <div className="contact-div-1">
              {/*   <div className="podaci1">      */}
                <div
                  className="podaciKontakt"   
                  style={{ overflowX: "auto"}}   
                >
                  {" "}
                  {/* 35% u paddingLeft bilo */}
                  <div className="red-1"></div>
                  <h4>
                    <Trans i18nKey="description.part110">Kontakt </Trans>
                  </h4>{" "}
                  <div className="red-1"></div>
                  <h5>
                    <Trans i18nKey="description.part111">Adresa:</Trans>
                  </h5>{" "}
                  <h5> Jug Bogdanova, Kruševac</h5> 
                  <div className="red-1"></div>
                  <h5>
                    <Trans i18nKey="description.part112">Telefon: </Trans>
                  </h5>
                  <h5>+381 (0)37 44 32 77</h5> 
                  <div className="red-1"></div>
                  <h5>e-mail:</h5> <h5> eurocompassdoo@gmail.com </h5>
                  <div className="red-1"></div>
                </div>
              {/*  </div>   */}
            </div>
          </div>
          <div className="rasponsive-maps contact_prikaz">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.003133483065!2d21.32630621576257!3d43.5856510648136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475687e7b6613f35%3A0xa504bc5265bd6eee!2seurocompass!5e0!3m2!1sen!2srs!4v1677160858699!5m2!1sen!2srs"
              title="Google"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kontakt;
