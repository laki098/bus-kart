import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import "./admin.css";
import "./korisnikInitional.css";

import { useTranslation, Trans } from "react-i18next";
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import apiUrl from "../../apiConfig";
import LanguageSwitcher from "../header/header";
import AdminPanel from "./admin.panel";
import NeDolazakModal from "../../modal/NeDolasciModal";

const KorisniciInitial = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [filtriraniKorisnici, setFiltriraniKorisnici] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [korisnikToDelete, setKorisnikToDelete] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedKorisnik, setSelectedKorisnik] = useState(null);
  const [isNeDolazakModalOpen, setIsNeDolazakModalOpen] = useState(false);

  const getKorisnici = async () => {
    const response = await fetch(`${apiUrl}/korisnik`);
    const data = await response.json();
    setKorisnici(data.korisnici);
    setFiltriraniKorisnici(data.korisnici);
  };

  useEffect(() => {
    getKorisnici();
  }, []);

  const brisanjeKorisnika = (idKorisnik) => {
    setKorisnikToDelete(idKorisnik);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (korisnikToDelete !== null) {
      await KorisnikApi().brisanjeKorisnika(korisnikToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setKorisnikToDelete(null);
    setIsConfirmationOpen(false);
  };

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = korisnici.filter((k) =>
      [k.korisnickoIme, k.ime, k.prezime, k.email, k.brojTelefona, k.role].some(
        (v) => (v || "").toLowerCase().includes(q)
      )
    );
    setFiltriraniKorisnici(filtered);
  };

  const { t, i18n } = useTranslation();
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };

  const handleNesavestniPutnici = () => {
    if (filter === "nesavestni") {
      setFiltriraniKorisnici(korisnici);
      setFilter("all");
    } else {
      const nesavestni = korisnici.filter((k) => (k.brojNeDolazaka || 0) > 2);
      setFiltriraniKorisnici(nesavestni);
      setFilter("nesavestni");
    }
  };

  const handleNeDolazak = (idKorisnik) => {
    const k = korisnici.find((x) => x.idKorisnik === idKorisnik);
    if (k) {
      setSelectedKorisnik(k);
      setIsNeDolazakModalOpen(true);
    }
  };

  const closeNeDolazakModal = () => {
    setSelectedKorisnik(null);
    setIsNeDolazakModalOpen(false);
  };

  return (
    <>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />
      <AdminPanel />

      <section className="user-page">
        <div className="user-card">
          <header className="user-card__header">
            <h2>
              <Trans i18nKey="">Korisnici</Trans>
            </h2>

            <div className="user-header-actions">
              <input
                type="text"
                className="input input--search"
                placeholder={t("searchUsers", "Pretražite korisnike...")}
                onChange={handleSearch}
              />
              <button
                className={`btn ${
                  filter === "nesavestni" ? "btn--warning" : "btn--ghost"
                }`}
                onClick={handleNesavestniPutnici}
              >
                {filter === "nesavestni"
                  ? "Svi korisnici"
                  : "Nesavesni putnici"}
              </button>
            </div>
          </header>

          {filtriraniKorisnici.length === 0 ? (
            <div className="user-empty">
              <Trans i18nKey="description.noUnsavedPassengers">
                Nema nesavesnih putnika.
              </Trans>
            </div>
          ) : (
            <ul className="user-list">
              {filtriraniKorisnici.map((korisnik) => (
                <li key={korisnik.idKorisnik} className="user-item">
                  <div className="user-grid">
                    <div className="user-field">
                      <span className="user-label">
                        <Trans i18nKey="description.part44">
                          Korisničko ime
                        </Trans>
                      </span>
                      <span className="user-value">
                        {korisnik.korisnickoIme}
                      </span>
                    </div>

                    <div className="user-field">
                      <span className="user-label">
                        <Trans i18nKey="description.part40">Ime</Trans>
                      </span>
                      <span className="user-value">{korisnik.ime}</span>
                    </div>

                    <div className="user-field">
                      <span className="user-label">
                        <Trans i18nKey="description.part42">Prezime</Trans>
                      </span>
                      <span className="user-value">{korisnik.prezime}</span>
                    </div>

                    <div className="user-field">
                      <span className="user-label">
                        <Trans i18nKey="description.part48">
                          Broj telefona
                        </Trans>
                      </span>
                      <span className="user-value">
                        {korisnik.brojTelefona}
                      </span>
                    </div>

                    <div className="user-field user-field--email">
                      <span className="user-label">Email</span>
                      <span className="user-value">{korisnik.email}</span>
                    </div>

                    <div className="user-field">
                      <span className="user-label">Role</span>
                      <span className="user-value">{korisnik.role}</span>
                    </div>

                    <div className="user-actions">
                      <Link
                        to={`${korisnik.idKorisnik}/korisnikChange`}
                        className="btn btn--ghost"
                      >
                        <Trans i18nKey="description.part145">Izmeni</Trans>
                      </Link>

                      <button
                        className="btn btn--ghost"
                        onClick={() => handleNeDolazak(korisnik.idKorisnik)}
                      >
                        <Trans i18nKey="">Ne dolasci</Trans>
                      </button>

                      <button
                        className="btn btn--danger"
                        onClick={() => brisanjeKorisnika(korisnik.idKorisnik)}
                      >
                        <Trans i18nKey="description.part134">Obriši</Trans>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Modal za prikaz nedolazaka */}
      <NeDolazakModal
        korisnik={selectedKorisnik}
        isOpen={isNeDolazakModalOpen}
        onClose={closeNeDolazakModal}
      />

      {/* Potvrda brisanja */}
      {isConfirmationOpen && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog-box modern">
            <div className="confirm-dialog-text">
              <Trans i18nKey="description.part155">
                Da li ste sigurni da želite da obrišete ovog korisnika?
              </Trans>
            </div>
            <div className="confirm-dialog-actions">
              <button className="btn btn--danger" onClick={confirmDelete}>
                <Trans i18nKey="description.part153">Da</Trans>
              </button>
              <button className="btn btn--ghost" onClick={cancelDelete}>
                <Trans i18nKey="description.part154">Ne</Trans>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KorisniciInitial;
