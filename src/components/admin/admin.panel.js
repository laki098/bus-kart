import { Link } from "react-router-dom";
import "./admin.css";
import LanguageSwitcher from "../header/header";

import "../NavBar/links/i18n"; // za prevodjenje
import "../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

const AdminPanel = () => {
  //prevodjenje
  const lngs = {
    en: { nativeName: "En" },
    sr: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

  return (
    <div>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />
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
          <Trans i18nKey="description.part175">Korisnici </Trans>
        </button>
      </Link>
      <Link to={"stanice.initial"}>
        <button className="button-panel">
          <Trans i18nKey="description.part173"> Stanice </Trans>
        </button>
      </Link>
      <Link to={"/cene.initial"}>
        <button className="button-panel">
          <Trans i18nKey="description.part201"> Cene </Trans>
        </button>
      </Link>
    </div>
  );
};

export default AdminPanel;
