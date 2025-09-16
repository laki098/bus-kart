import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CeneApi from "../../../api/cene.api";
import apiUrl from "../../../apiConfig";

import "../../admin/stanica/stanica.css";
import "../../admin/dopuna_stila.css";
import "./cene.css"; // ⬅️ dodaj ovaj fajl (novi stil)

import "../../NavBar/links/i18n";
import "../../../components/rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";

import LanguageSwitcher from "../../header/header";
import AdminPanel from "../admin.panel";

const CeneInitial = () => {
  const [cene, setCene] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [ceneToDelete, setCeneToDelete] = useState(null);

  const getCene = async () => {
    const response = await fetch(`${apiUrl}/cena`);
    const data = await response.json();
    setCene(data.cena);
  };

  useEffect(() => {
    getCene();
  }, []);

  const brisanjeCene = (id) => {
    setCeneToDelete(id);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (ceneToDelete !== null) {
      await CeneApi().brisanjeCene(ceneToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setCeneToDelete(null);
    setIsConfirmationOpen(false);
  };

  const { t, i18n } = useTranslation();
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };

  return (
    <>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />
      <AdminPanel />

      <section className="price-page">
        <div className="price-card">
          <header className="price-card__header">
            <h2>
              <Trans i18nKey="description.part201">Cene</Trans>
            </h2>

            <Link to="/cene.add" className="btn btn--primary">
              <Trans i18nKey="description.part199">Dodaj novu cenu</Trans>
            </Link>
          </header>

          {!Array.isArray(cene) || cene.length === 0 ? (
            <div className="price-empty">
              {t("prices.empty", "Još nema unetih cena.")}
            </div>
          ) : (
            <ul className="price-list">
              {cene.map((jednaCena) => {
                const formatiranaCena = Number(jednaCena.cenaKarte).toFixed(2);
                return (
                  <li key={jednaCena.id} className="price-item">
                    <div className="price-grid">
                      <div className="price-field">
                        <span className="price-label">
                          <Trans i18nKey="description.part31">
                            Početna stanica
                          </Trans>
                        </span>
                        <span className="price-value">
                          {jednaCena.pocetnaStanica}
                        </span>
                      </div>

                      <div className="price-field">
                        <span className="price-label">
                          <Trans i18nKey="description.part198">
                            Krajnja stanica
                          </Trans>
                        </span>
                        <span className="price-value">
                          {jednaCena.krajnjaStanicaR}
                        </span>
                      </div>

                      <div className="price-field price-field--price">
                        <span className="price-label">
                          <Trans i18nKey="description.part169">Cena</Trans>
                        </span>
                        <span className="price-value price-value--money">
                          {formatiranaCena}
                        </span>
                      </div>

                      <div className="price-actions">
                        <Link
                          to={`${jednaCena.id}/cene.edit`}
                          className="btn btn--ghost"
                        >
                          <Trans i18nKey="description.part145">Izmeni</Trans>
                        </Link>
                        <button
                          onClick={() => brisanjeCene(jednaCena.id)}
                          className="btn btn--danger"
                        >
                          <Trans i18nKey="description.part134">Obriši</Trans>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {isConfirmationOpen && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog-box modern">
            <div className="confirm-dialog-text">
              <Trans i18nKey="description.part200">
                Da li ste sigurni da želite da obrišete ovu cenu?
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

export default CeneInitial;
