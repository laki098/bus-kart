import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaniceApi from "../../../api/stanice.api";

import "./stanica.css";

import "../../NavBar/links/i18n";
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import apiUrl from "../../../apiConfig";

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
      const response = await StaniceApi().brisanjeStanice(staniceToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setStaniceToDelete(null);
    setIsConfirmationOpen(false);
  };

  //prevodjenje
  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

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

      <div className="red-1"></div>
      <div className="stampajLiniju">
        <div className="tabela-stanica spisak-stanica" >
          <ul>
            {stanice.map((stanica) => {
              return (
                <li key={stanica.id}>
                  <div className="jedan-red-stanica">
                    <div className="polje-stanica">
                      <Trans i18nKey="description.part142">Naziv </Trans>
                    </div>
                    <div className="info-stanica sirina-info-stanica">
                      {" "}
                      {stanica.naziv}
                    </div>
                    <div className="polje-stanica">
                      <Trans i18nKey="description.part111">Adresa </Trans>
                    </div>
                    <div className="info-stanica sirina-info-stanica email-polje obicna-debljina">
                      {stanica.adresa}
                    </div>
                    <div className="polje-stanica">
                      <Link to={`${stanica.id}/stanice.edit`}>
                        <button className="buttonSwitch">
                          <Trans i18nKey="description.part145">Izmeni</Trans>
                        </button>
                      </Link>{" "}
                    </div>
                    <div className="polje-stanica">
                      <button
                        onClick={() => brisanjeStanice(stanica.id)}
                        className="buttonSwitch"
                      >
                        <Trans i18nKey="description.part134">Obriši</Trans>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="red-1"></div>
      <Link to={"/stanice.add"}>
        <button className="buttonSwitch">
          <Trans i18nKey="description.part152">Dodaj novu stanicu</Trans>
        </button>
      </Link>

      <div className="red-1"></div>

      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-box">
              <div className="red-05">
                <Trans i18nKey="description.part155">
                  Da li ste sigurni da želite da obrišete ovu liniju?{" "}
                </Trans>
              </div>
              <button className="confirm-dialog-yes" onClick={confirmDelete}>
                <Trans i18nKey="description.part153">Da</Trans>
              </button>
              <button className="confirm-dialog-no" onClick={cancelDelete}>
                <Trans i18nKey="description.part154">Ne</Trans>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StaniceInitial;
