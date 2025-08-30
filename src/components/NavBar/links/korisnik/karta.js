import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import "./still.css";
import "../../../admin/dopuna_stila.css";
import KorisnikLogic from "./karta.logic.js";
import SectionTitle from "../../../../components/SectionTitle";

import { useTranslation, Trans } from "react-i18next";
import "../i18n";
import "../../../../components/NavBar/links/i18n";
import apiUrl from "../../../../apiConfig";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LanguageSwitcher from "../../../header/header.js";

const Karta = () => {
  const { t, i18n } = useTranslation();
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };

  const [sveKarte, setSveKarte] = useState([]);
  const [potvrdaP, setPotvrdaP] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ulogovani korisnik
  const userData = cookies.get("userData");
  const userPars = userData ? JSON.parse(userData) : {};
  const userIdP = JSON.stringify({ korisnikId: userPars.idKorisnika || 0 });

  const korisnikLogic = KorisnikLogic();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/korisnik/karta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: userIdP,
        });
        const data = await res.json();

        const a1 = (data.karte || []).map((item) => ({
          id: item.id,
          linijaId: item.linijaId,
          brojMesta: item.brojMesta,
          pocetna: item.polaznaStanicaR,
          krajnja: item.krajnjaStanicaR,
          datumP: item.datumPolaska,
          datumD: item.datumDolaska,
          vremeP: item.vremePolaska,
          vremeD: item.vremeDolaska,
          cekiranje: item.cekiran,
          tipKarte: item.tipKarte || "",
          pocetnaStanicaId: item.pocetnaStanicaId,
          krajnjaStanicaId: item.krajnjaStanicaId,
          email: item.email,
          kola: item.kola,
          brojSlobodnihMesta: item.brojSlobodnihMesta,
        }));

        setSveKarte(a1);
      } catch (e) {
        console.error("Greška prilikom preuzimanja karata:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userIdP]);

  const aktivneKarte = sveKarte.filter((k) => {
    const d = new Date(`${k.datumD}T${k.vremeD}`);
    return !k.cekiranje && d > new Date();
  });

  const neaktivneKarte = sveKarte.filter((k) => {
    const d = new Date(`${k.datumD}T${k.vremeD}`);
    return k.cekiranje || d <= new Date();
  });

  const handleOtkaziKartu = (karte) => {
    korisnikLogic.otkazivanjeKarte(karte);
  };

  const sedistePovratak_1 = () => setPotvrdaP(true);

  if (loading) return <p>Učitavanje…</p>;

  const Card = ({ karte, showActions = true }) => (
    <li className="lista-stavka">
      {/* Header: ruta + bedževi */}
      <div className="ticket-header">
        <div className="route">
          <span className="city">{karte.pocetna}</span>
          <span className="arrow">→</span>
          <span className="city">{karte.krajnja}</span>
        </div>

        <div className="chips">
          <span className="chip"> {karte.kola}</span>
          <span
            className={`chip ${karte.cekiranje ? "chip-success" : "chip-warn"}`}
          >
            {karte.cekiranje
              ? t("description.part153")
              : t("description.part154")}
          </span>
        </div>
      </div>

      {/* Polja */}
      <dl className="kv">
        <dt>{t("description.part184")}</dt>
        <dd>{karte.brojMesta}</dd>

        <dt>{t("description.part33")}</dt>
        <dd>{karte.datumP}</dd>

        <dt>{t("description.part11")}</dt>
        <dd>{karte.vremeP}</dd>

        <dt>{t("description.part9")}</dt>
        <dd>{karte.datumD}</dd>

        <dt>{t("description.part13")}</dt>
        <dd>{karte.vremeD}</dd>
      </dl>

      {showActions && (
        <div className="ticket-actions">
          <button
            className="dugme-otkazi-kartu"
            style={{
              visibility:
                new Date(karte.datumP) < new Date() ? "hidden" : "visible",
            }}
            onClick={() => handleOtkaziKartu(karte)}
          >
            {t("description.part232")}
          </button>

          {karte.tipKarte === "PrPovratna" && (
            <button
              className="dugme-povratna-karta"
              onClick={sedistePovratak_1}
            >
              {t("description.part25")}
            </button>
          )}

          {karte.tipKarte === "PrPovratna" && potvrdaP ? (
            <Link
              to={{
                pathname: `${karte.linijaId}/rezervacijakarte`,
                state: {
                  id: karte.id,
                  linijaId: karte.linijaId,
                  vremePolaska: karte.vremeP,
                  pocetnaStanica: karte.pocetna,
                  pocetnaStanicaId: karte.pocetnaStanicaId,
                  krajnjaStanicaId: karte.krajnjaStanicaId,
                  brojSlobodnihMesta: karte.brojSlobodnihMesta,
                  krajnjaStanica: karte.krajnja,
                  vremeDolaska: karte.vremeD,
                  datumPolaska: karte.datumP,
                  datumDolaska: karte.datumD,
                  povratna: potvrdaP,
                  tipKarte: karte.tipKarte,
                  email: karte.email,
                },
              }}
            >
              <button className="dugme-sediste-karta">
                {t("description.part203")}
              </button>
            </Link>
          ) : null}
        </div>
      )}
    </li>
  );

  return (
    <>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      {/* Glavni naslov */}
      <SectionTitle
        title={<Trans i18nKey="description.part186">Moje karte</Trans>}
        tone="primary"
      />

      <div className="red-1"></div>

      {/* Aktivne */}
      {/* Aktivne karte */}
      <SectionTitle
        title={<Trans i18nKey="description.part187">Aktivne karte</Trans>}
        count={aktivneKarte.length}
        tone="success"
      />
      <ul className="Grupa">
        {aktivneKarte.map((k) => (
          <Card key={k.id} karte={k} showActions />
        ))}
      </ul>

      <div className="red-1"></div>

      {/* Neaktivne */}
      <SectionTitle
        title={<Trans i18nKey="description.part188">Neaktivne karte</Trans>}
        count={neaktivneKarte.length}
        tone="muted"
      />
      <ul className="Grupa">
        {neaktivneKarte.map((k) => (
          <Card key={k.id} karte={k} showActions={false} />
        ))}
      </ul>

      <ToastContainer />
    </>
  );
};

export default Karta;
