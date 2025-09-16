import React from "react";
import "./kontakt.css";

import "./i18n";
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";

import LanguageSwitcher from "../../header/header";

const Kontakt = () => {
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  return (
    <div className="contactPage">
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <section className="contactPage-section">
        <div className="contactPage-grid">
          {/* Info kartica */}
          <div className="contactPage-card">
            <div className="contactPage-head">
              <h1 className="contactPage-title">
                <Trans i18nKey="description.part110">Kontakt</Trans>
              </h1>
              <p className="contactPage-subtitle">
                <Trans>Tu smo za sva pitanja i sugestije.</Trans>
              </p>
            </div>

            <div className="contactPage-list">
              <div className="contactPage-item">
                <div className="contactPage-itemIcon" aria-hidden>
                  🏢
                </div>
                <div className="contactPage-itemBody">
                  <div className="contactPage-itemLabel">
                    <Trans i18nKey="description.part111">Adresa</Trans>
                  </div>
                  <div className="contactPage-itemValue">
                    Jug Bogdanova, Kruševac
                  </div>
                </div>
              </div>

              <div className="contactPage-item">
                <div className="contactPage-itemIcon" aria-hidden>
                  📞
                </div>
                <div className="contactPage-itemBody">
                  <div className="contactPage-itemLabel">
                    <Trans i18nKey="description.part112">Telefon</Trans>
                  </div>
                  <a className="contactPage-link" href="tel:+381037443277">
                    +381 (0)37 44 32 77
                  </a>
                </div>
              </div>

              <div className="contactPage-item">
                <div className="contactPage-itemIcon" aria-hidden>
                  ✉️
                </div>
                <div className="contactPage-itemBody">
                  <div className="contactPage-itemLabel">E-mail</div>
                  <a
                    className="contactPage-link"
                    href="mailto:eurocompassdoo@gmail.com"
                  >
                    eurocompassdoo@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="contactPage-actions">
              <a
                href="tel:+381037443277"
                className="contactPage-btn contactPage-btn--primary"
              >
                <Trans>Pozovi</Trans>
              </a>
              <a
                href="mailto:eurocompassdoo@gmail.com"
                className="contactPage-btn contactPage-btn--ghost"
              >
                <Trans>Pošalji e-mail</Trans>
              </a>
            </div>
          </div>

          {/* Mapa */}
          <div className="contactPage-mapCard">
            <div className="contactPage-map">
              <iframe
                title="Eurocompass lokacija"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.003133483065!2d21.32630621576257!3d43.5856510648136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475687e7b6613f35%3A0xa504bc5265bd6eee!2seurocompass!5e0!3m2!1sen!2srs!4v1677160858699!5m2!1sen!2srs"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kontakt;
