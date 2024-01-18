import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CeneApi from "../../../api/cene.api";
import apiUrl from "../../../apiConfig";

import "../../admin/stanica/stanica.css";
import "../../admin/dopuna_stila.css";
import "../../NavBar/links/i18n"; // za prevodjenje
import "../../../components/rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

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
      const response = await CeneApi().brisanjeCene(ceneToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setCeneToDelete(null);
    setIsConfirmationOpen(false);
  };

    //prevodjenje
    const lngs = {
      en: { nativeName: "En" },
      de: { nativeName: "Sr" },
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
              className="jezici-dugme-promena"
              style={{fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",}}
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
      </header>



      <div className="cene-okvir" style={{borderWidth:0}}>      {/* trazio Laza bez bordera primer i zato je style*/}
        <ul>
          {cene &&
            Array.isArray(cene) &&
            cene.map((jednaCena) => {
              const formatiranaCena = parseFloat(jednaCena.cenaKarte).toFixed(2);

              return (
                <li key={jednaCena.id}>
                  <div className="cene-red">
                    <div className="cene-polja">
                      <Trans i18nKey="description.part31">Pocetna Stanica</Trans></div>
                    <div className=" cena-info fino-podesavanje">
                      {jednaCena.pocetnaStanica}
                    </div>
                    <div className="cene-polja">
                      <Trans i18nKey="description.part198">Krajnja Stanica</Trans></div>
                    <div className=" cena-info fino-podesavanje">
                      {jednaCena.krajnjaStanicaR}
                    </div>
                    <div className="cene-polja">
                      <Trans i18nKey="description.part169">Cena</Trans></div>
                    <div className=" cena-info ">{formatiranaCena} </div>
                    <div className="cene-polja">
                      <Link to={`${jednaCena.id}/cene.edit`}>
                        <button className="buttonSwitch">
                          <Trans i18nKey="description.part145">Izmeni</Trans></button>
                      </Link>
                    </div>
                    <div className="cene-polja">
                      <button
                        onClick={() => brisanjeCene(jednaCena.id)}
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
      <div>
        <Link to={"/cene.add"}>
          <button className="buttonSwitch">
            <Trans i18nKey="description.part199">Dodaj novu cenu</Trans></button>
        </Link>
      </div>
      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-box">
              <div><Trans i18nKey="description.part200">Da li ste sigurni da želite da obrišete ovu cenu?</Trans></div>
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

export default CeneInitial;
