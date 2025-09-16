import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BusApi from "../../api/bus.api";
/* import "./admin.css"; */
import "./ListBus.css";
import { useTranslation, Trans } from "react-i18next";
import "../../components/NavBar/links/i18n";
import "../../components/rezervacije/i18n";
import apiUrl from "../../apiConfig";
import AdminPanel from "./admin.panel";
import LanguageSwitcher from "../header/header";

const BusInitional = () => {
  const [busevi, setBusevi] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  useEffect(() => {
    getBus();
  }, []);

  const getBus = async () => {
    const response = await fetch(`${apiUrl}/autobusi`);
    const data = await response.json();
    setBusevi(data.autobusi);
  };

  const brisanjeBusa = (idAutobusa) => {
    setBusToDelete(idAutobusa);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (busToDelete !== null) {
      await BusApi().brisanjeBus(busToDelete);
      setTimeout(() => {
        window.location.href = "/bus.initial";
      }, 2000);
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setBusToDelete(null);
    setIsConfirmationOpen(false);
  };

  const { t } = useTranslation();

  return (
    <>
      <AdminPanel />

      <section className="bus-page">
        <div className="bus-card">
          <header className="bus-card__header">
            <h2>
              <Trans i18nKey="description.part174">Autobusi</Trans>
            </h2>

            <Link to="/bus.add" className="btn btn--primary">
              <Trans i18nKey="description.part127">Dodajte autobus</Trans>
            </Link>
          </header>

          {busevi.length === 0 ? (
            <div className="bus-empty">
              {t("description.emptyBuses", "Još nema unetih autobusa.")}
            </div>
          ) : (
            <ul className="bus-list">
              {busevi.map((bus) => (
                <li key={bus.idAutobusa} className="bus-item">
                  <div className="bus-grid">
                    <div className="bus-field">
                      <span className="bus-label">
                        <Trans i18nKey="description.part170">Oznaka</Trans>
                      </span>
                      <span className="bus-value">{bus.oznakaBusa}</span>
                    </div>

                    <div className="bus-field">
                      <span className="bus-label">
                        <Trans i18nKey="description.part171">Tablice</Trans>
                      </span>
                      <span className="bus-value">{bus.tablice}</span>
                    </div>

                    <div className="bus-field">
                      <span className="bus-label">
                        <Trans i18nKey="description.part36">Broj mesta</Trans>
                      </span>
                      <span className="bus-value">{bus.brojSedista}</span>
                    </div>

                    <div className="bus-actions">
                      <Link
                        to={`${bus.idAutobusa}/bus.change.line`}
                        className="btn btn--ghost"
                      >
                        <Trans i18nKey="description.part145">Izmeni</Trans>
                      </Link>

                      <button
                        onClick={() => brisanjeBusa(bus.idAutobusa)}
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
              <Trans i18nKey="description.part172">
                Da li ste sigurni da želite da obrišete ovu stavku?
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

export default BusInitional;
