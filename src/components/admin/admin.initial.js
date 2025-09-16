import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LinijeApi from "../../api/linije.api";
import AdminLogic from "./admin.logic";
import apiUrl from "../../apiConfig";
import LanguageSwitcher from "../header/header";

import "./admin-initional.css";

import "../NavBar/links/i18n";
import "../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";
import AdminPanel from "./admin.panel";

const AdminInitial = () => {
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [val1, setVal1] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [val2, setVal2] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [stanice, setStanice] = useState([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [lineToDelete, setLineToDelete] = useState(null);

  const getStanice = async () => {
    const response = await fetch(`${apiUrl}/stanica`);
    const data = await response.json();
    const a1 = data.stanice.map((item) => ({ naziv: item.naziv, id: item.id }));
    setStanice(a1);
    if (a1?.length) {
      setVal1(a1[0].naziv);
      if (a1[1]) setVal2(a1[1].naziv);
    }
  };

  const filterLinija = async () => {
    if (!valueDate) return;
    const response = await LinijeApi().filterLinija(val1, val2, valueDate);
    const data = await response.json();
    setFilteredLinije(data.rezultat);
  };

  useEffect(() => {
    getStanice();
  }, []);
  useEffect(() => {
    if (!valueDate) setValueDate(today);
  }, [today, valueDate]);

  const adminLogic = AdminLogic();
  const [showClass, setShowClass] = useState(false);
  const changer = () => setShowClass((s) => !s);
  const clickButton = async () => {
    await filterLinija();
    changer();
  };

  const brisanjeLinije = (id) => {
    setLineToDelete(id);
    setIsDeleteConfirmationOpen(true);
  };
  const confirmDelete = async () => {
    if (lineToDelete !== null) {
      await adminLogic.brisanjeLinije(lineToDelete);
      setFilteredLinije((prev) =>
        prev.filter((linija) => linija.id !== lineToDelete)
      );
    }
    setIsDeleteConfirmationOpen(false);
  };
  const cancelDelete = () => {
    setLineToDelete(null);
    setIsDeleteConfirmationOpen(false);
  };

  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  return (
    <div className="adminInitional-page">
      <LanguageSwitcher lngs={lngs} i18n={i18n} />
      <AdminPanel />

      {/* KARTICA SA FILTERIMA */}
      <div className="adminInitional-card adminInitional-card--auth">
        <div className="adminInitional-cardBody">
          <div className="adminInitional-cardHead">
            <div className="adminInitional-cardTitle">Red vožnje</div>
            <div className="adminInitional-cardSubtitle">
              Odaberite polazak, dolazak i datum
            </div>
          </div>

          <div className="adminInitional-grid">
            <div className="adminInitional-field">
              <label className="adminInitional-label">
                <Trans i18nKey="description.part3">Mesto polaska:</Trans>
              </label>
              <br />
              <select
                className="adminInitional-input"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
              >
                {stanice.map((stanica) => (
                  <option key={stanica.id} value={stanica.naziv}>
                    {stanica.naziv}
                  </option>
                ))}
              </select>
            </div>

            <div className="adminInitional-field">
              <label className="adminInitional-label">
                <Trans i18nKey="description.part5">Mesto Dolaska:</Trans>
              </label>
              <br />
              <select
                className="adminInitional-input"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
              >
                {stanice.map((stanica) => (
                  <option key={stanica.id} value={stanica.naziv}>
                    {stanica.naziv}
                  </option>
                ))}
              </select>
            </div>

            <div className="adminInitional-field">
              <label className="adminInitional-label">
                <Trans i18nKey="description.part9">Datum polaska</Trans>
              </label>
              <br />
              <input
                type="date"
                className="adminInitional-input adminInitional-input--date"
                value={valueDate || today}
                min={today}
                onChange={(e) => setValueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Akcije: primarno dugme full width + dva sporedna u redu */}
          <div className="adminInitional-actions">
            <button
              className="adminInitional-btn adminInitional-btn--primary adminInitional-btn--block"
              onClick={clickButton}
            >
              <Trans i18nKey="description.part34">Red vožnje</Trans>
            </button>

            <div className="adminInitional-secondary">
              <Link
                to="/admin.component"
                className="adminInitional-btn adminInitional-btn--ghost adminInitional-btn--grow"
              >
                <Trans i18nKey="description.part37">Dodavanje linije</Trans>
              </Link>

              <Link
                to="/viseLinija"
                className="adminInitional-btn adminInitional-btn--ghost adminInitional-btn--grow"
              >
                <Trans i18nKey="description.part209">Produžetak linije</Trans>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* REZULTATI */}
      {filteredLinije.length > 0 ? (
        <div>
          <ul>
            <div
              className={`adminInitional-table adminInitional-card adminInitional-results ${
                showClass ? "is-visible" : ""
              }`}
            >
              {filteredLinije.map((linija) => (
                <li key={linija.id}>
                  <div className="adminInitional-resultRow">
                    <div className="adminInitional-chipLabel">
                      <Trans i18nKey="description.part3">Mesto polaska</Trans>
                    </div>
                    <div className="adminInitional-chipValue">
                      {linija.pocetnaStanica}
                    </div>

                    <div className="adminInitional-chipLabel">
                      <Trans i18nKey="description.part11">Vreme polaska</Trans>
                    </div>
                    <div className="adminInitional-chipValue">
                      {linija.vremePolaska}
                    </div>

                    <div className="adminInitional-chipLabel">
                      <Trans i18nKey="description.part13">Vreme dolaska</Trans>
                    </div>
                    <div className="adminInitional-chipValue">
                      {linija.vremeDolaska}
                    </div>

                    <div className="adminInitional-chipLabel">
                      <Trans i18nKey="description.part5">Mesto dolaska</Trans>
                    </div>
                    <div className="adminInitional-chipValue">
                      {linija.krajnjaStanica}
                    </div>

                    <Link
                      to={{
                        pathname: `${linija.id}/admin.change.line`,
                        state: {
                          id: linija.id,
                          vremePolaska: linija.vremePolaska,
                          pocetnaStanica: linija.pocetnaStanica,
                          krajnjaStanica: linija.krajnjaStanica,
                          vremeDolaska: linija.vremeDolaska,
                          datumPolaska: linija.datumPolaska,
                          datumDolaska: linija.datumDolaska,
                          oznakaBusa: linija.oznakaBusa,
                          kola: linija.kola,
                        },
                      }}
                    >
                      <div className="adminInitional-chipLabel">
                        <button className="adminInitional-btn adminInitional-btn--ghost adminInitional-btn--sm">
                          <Trans i18nKey="description.part133">Uredi</Trans>
                        </button>
                      </div>
                    </Link>

                    <div className="adminInitional-chipLabel">
                      <button
                        className="adminInitional-btn adminInitional-btn--danger adminInitional-btn--sm"
                        onClick={() => brisanjeLinije(linija.id)}
                      >
                        <Trans i18nKey="description.part134">Obriši</Trans>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </div>
      ) : (
        <p>
          <Trans i18nKey="description.part135">Nema Linije...</Trans>
        </p>
      )}

      {/* MODAL POTVRDE */}
      {isDeleteConfirmationOpen && (
        <div className="adminInitional-confirmOverlay">
          <div className="adminInitional-confirmBox">
            <div className="adminInitional-confirmText">
              <Trans i18nKey="description.part155">
                Da li ste sigurni da želite da obrišete ovog korisnika?
              </Trans>
            </div>
            <div className="adminInitional-confirmActions">
              <button
                className="adminInitional-btn adminInitional-btn--danger"
                onClick={confirmDelete}
              >
                <Trans i18nKey="description.part153">Da</Trans>
              </button>
              <button
                className="adminInitional-btn adminInitional-btn--ghost"
                onClick={cancelDelete}
              >
                <Trans i18nKey="description.part154">Ne</Trans>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInitial;
