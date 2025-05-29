import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Uvezi useLocation

const LanguageSwitcher = ({ lngs, i18n }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // Dobavi informacije o trenutnoj putanji

  // Ako smo na početnoj ("/"), boja teksta je bela, inače crna
  const textColor = location.pathname === "/pocetna" ? "white" : "black";

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Debugging log da vidiš šta se dešava
  console.log("lngs:", lngs);
  console.log("i18n.resolvedLanguage:", i18n.resolvedLanguage);

  // Proveri da li `lngs` i `i18n.resolvedLanguage` postoje
  const currentLanguage = lngs?.[i18n.resolvedLanguage] || {
    nativeName: "Unknown",
  };

  return (
    <header>
      <div style={{ textAlign: "right", marginRight: "3rem" }}>
        {/* Prikaz trenutne zastave i jezika */}
        <button
          className="jezici-dugme-promena"
          style={{
            fontWeight: "bold",
            color: textColor, // Dinamički setuj boju teksta
          }}
          type="button"
          onClick={toggleDropdown}
        >
          <img
            src={`/images/${i18n.resolvedLanguage === "sr" ? "sr" : "gb"}.png`}
            alt={i18n.resolvedLanguage}
            style={{ width: "24px", marginRight: "0.5rem" }}
          />
          {lngs[i18n.resolvedLanguage].nativeName}{" "}
        </button>

        {/* Dropdown za odabir jezika */}
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              right: "3rem",
              borderRadius: "0.5rem",
            }}
          >
            {Object.keys(lngs)
              .filter((lng) => lng !== i18n.resolvedLanguage)
              .map((lng) => (
                <button
                  key={lng}
                  className="jezici-dugme-promena"
                  style={{
                    fontWeight:
                      i18n.resolvedLanguage === lng ? "bold" : "normal",
                    color: textColor, // Takođe primeni boju teksta ovde
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    margin: "0.5rem 0",
                  }}
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(lng);
                    setIsDropdownOpen(false);
                  }}
                >
                  <img
                    src={`/images/${lng === "sr" ? "sr" : "gb"}.png`}
                    alt={lng}
                    style={{ width: "24px", marginRight: "0.5rem" }}
                  />
                  {lngs[lng].nativeName}
                </button>
              ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default LanguageSwitcher;
