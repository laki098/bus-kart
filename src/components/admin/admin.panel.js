// src/components/admin/admin.panel.js
import { NavLink } from "react-router-dom";
import "./admin1.css";
import LanguageSwitcher from "../header/header";
import "../NavBar/links/i18n";
import "../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";
import { FiTruck, FiShare2, FiUsers, FiMapPin, FiTag } from "react-icons/fi";

export default function AdminPanel({ counts = {}, showLang = true }) {
  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  const NAV_ITEMS = [
    {
      id: "buses",
      to: "/bus.initial",
      key: "description.part174",
      fallback: "Autobusi",
      icon: FiTruck,
      exact: true,
    },
    {
      id: "lines",
      to: "/admin.initial",
      key: "description.part176",
      fallback: "Linija",
      icon: FiShare2,
      exact: true,
    },
    {
      id: "users",
      to: "/korisniciInitial",
      key: "description.part175",
      fallback: "Korisnici",
      icon: FiUsers,
      exact: true,
    },
    {
      id: "stations",
      to: "/stanice.initial",
      key: "description.part173",
      fallback: "Stanice",
      icon: FiMapPin,
      exact: true,
    },
    {
      id: "prices",
      to: "/cene.initial",
      key: "description.part201",
      fallback: "Cene",
      icon: FiTag,
      exact: true,
    },
  ];

  return (
    <div className="adminbar">
      <div className="container">
        {/* NEMA shell-like */}
        <div className="adminbar__inner">
          <div /> {/* levo prazan stub da centriranje radi */}
          <nav className="admin-subnav pro" aria-label="Admin navigacija">
            <div className="admin-subnav__scroll">
              {NAV_ITEMS.map(({ id, to, key, fallback, icon: Icon, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="admin-chip"
                  activeClassName="is-active"
                  exact={!!exact}
                >
                  <span className="admin-chip__icon">
                    <Icon />
                  </span>
                  <span className="admin-chip__label">
                    <Trans i18nKey={key}>{fallback}</Trans>
                  </span>
                  {counts[id] != null && (
                    <span className="admin-chip__badge">{counts[id]}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
