import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaniceApi from "../../../api/stanice.api";

import "../../NavBar/links/i18n";
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

const StaniceInitial = () => {
  const [stanice, setStanice] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [staniceToDelete, setStaniceToDelete] = useState(null);

  const getStanice = async () => {
    const response = await fetch("http://localhost:5000/stanica");
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
      <div className="tabela-stanica spisak-stanica">
        <ul>
          {stanice.map((stanica) => {
            return (
              <li key={stanica.id}>
                <div className="jedan-red-stanica">
                 <div className="polje-stanica">Naziv </div> <div className="info-stanica"> {stanica.naziv}</div> 
                 <div className="polje-stanica">Adresa</div><div className="info-stanica">{stanica.adresa}</div>
                 <div className="polje-stanica"><Link to={`${stanica.id}/stanice.edit`}>
                    <button className="buttonSwitch">Izmeni</button>
                  </Link> </div>
                 <div className="polje-stanica"> 
                    <button onClick={() => brisanjeStanice(stanica.id)} className="buttonSwitch">
                    Obriši
                  </button></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      
      
      <div className="red-1"></div>
      <Link to={"/stanice.add"}>
        <button className="buttonSwitch">Dodaj novu stanicu</button>
      </Link>

      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-box">
            <p>Da li ste sigurni da želite da obrišete ovu liniju?</p>
            <button className="confirm-dialog-yes" onClick={confirmDelete}>
              Da
            </button>
            <button className="confirm-dialog-no" onClick={cancelDelete}>
              Ne
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default StaniceInitial;
