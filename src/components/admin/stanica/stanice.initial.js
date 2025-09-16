import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaniceApi from "../../../api/stanice.api";
import "./stanica.css";
import "../../NavBar/links/i18n";
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";
import apiUrl from "../../../apiConfig";
import LanguageSwitcher from "../../header/header";
import AdminPanel from "../admin.panel";

const StaniceInitial = () => {
  const [stanice, setStanice] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [staniceToDelete, setStaniceToDelete] = useState(null);

  const getStanice = async () => {
    const response = await fetch(`${apiUrl}/stanica`);
    const data = await response.json();
    setStanice(data.stanice);
  };

  useEffect(() => {
    getStanice();
  }, []);

  const brisanjeStanice = (id) => {
    setStaniceToDelete(id);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (staniceToDelete !== null) {
      await StaniceApi().brisanjeStanice(staniceToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setStaniceToDelete(null);
    setIsConfirmationOpen(false);
  };

  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { t, i18n } = useTranslation();

  return (
    <>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />
      <AdminPanel />

      <section className="station-page">
        <div className="station-card">
          <header className="station-card__header">
            <h2>
              <Trans i18nKey="description.part173">Stanice</Trans>
            </h2>

            <Link to="/stanice.add" className="btn btn--primary">
              <Trans i18nKey="description.part152">Dodaj novu stanicu</Trans>
            </Link>
          </header>

          {stanice?.length === 0 ? (
            <div className="station-empty">
              {t("stations.empty", "Još nema unetih stanica.")}
            </div>
          ) : (
            <ul className="station-list">
              {stanice.map((stanica) => (
                <li key={stanica.id} className="station-item">
                  <div className="station-grid">
                    <div className="station-field">
                      <span className="station-label">
                        <Trans i18nKey="description.part142">Naziv</Trans>
                      </span>
                      <span className="station-value">{stanica.naziv}</span>
                    </div>

                    <div className="station-field station-field--wide">
                      <span className="station-label">
                        <Trans i18nKey="description.part111">Adresa</Trans>
                      </span>
                      <span className="station-value">{stanica.adresa}</span>
                    </div>

                    <div className="station-actions">
                      <Link
                        to={`${stanica.id}/stanice.edit`}
                        className="btn btn--ghost"
                      >
                        <Trans i18nKey="description.part145">Izmeni</Trans>
                      </Link>

                      <button
                        onClick={() => brisanjeStanice(stanica.id)}
                        className="btn btn--danger"
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

      {isConfirmationOpen && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog-box modern">
            <div className="confirm-dialog-text">
              <Trans i18nKey="description.part155">
                Da li ste sigurni da želite da obrišete ovu liniju?
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

export default StaniceInitial;
