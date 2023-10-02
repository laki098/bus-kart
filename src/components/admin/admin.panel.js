import { Link } from "react-router-dom";
import "./admin.css";

import "../NavBar/links/i18n"; // za prevodjenje
import "../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

const AdminPanel = () => {

  //prevodjenje
  const lngs = {
      en: { nativeName: "Engleski" },
      de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

  return (
    <div>

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
      <Link to={"/bus.initial"}>
        <button className="button-panel">
        <Trans i18nKey="description.part174">Autobusi </Trans>
        </button>
      </Link>
      &ensp;
      <Link to={"/admin.initial"}>
        <button className="button-panel">
        <Trans i18nKey="description.part176">Linije </Trans>
        </button>
      </Link>
      &ensp;
      <Link to={"/korisniciInitial"}>
        <button className="button-panel">
        <Trans i18nKey="description.part175">Korisnici  </Trans>
        </button>
      </Link>
      <Link to={"stanice.initial"}>
        <button className="button-panel">
        <Trans i18nKey="description.part173"> Stanice </Trans>
        </button>
      </Link>
    </div>
  );
};

export default AdminPanel;
