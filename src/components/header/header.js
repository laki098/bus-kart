import React, { useState } from "react";

const LanguageSwitcher = ({ lngs, i18n }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State za otvaranje/zatvaranje dropdown-a

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Promeni stanje dropdown-a
  };

  return (
    <header>
      <div style={{ textAlign: "right", marginRight: "3rem" }}>
        {/* Prikaz trenutne zastave i jezika */}
        <button
          className="jezici-dugme-promena"
          style={{
            fontWeight: "bold", // Ovaj stil možeš dodati, da bi trenutni jezik bio podebljan
          }}
          type="button"
          onClick={toggleDropdown}
        >
          <img
            src={`/images/${i18n.resolvedLanguage === "sr" ? "sr" : "gb"}.png`} // Dinamičko prikazivanje zastave
            alt={i18n.resolvedLanguage}
            style={{ width: "24px", marginRight: "0.5rem" }}
          />
          {lngs[i18n.resolvedLanguage].nativeName}{" "}
          {/* Prikaz trenutnog jezika */}
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
              .filter((lng) => lng !== i18n.resolvedLanguage) // Prikazivanje samo jezika koji nije trenutno izabran
              .map((lng) => (
                <button
                  key={lng}
                  className="jezici-dugme-promena"
                  style={{
                    fontWeight:
                      i18n.resolvedLanguage === lng ? "bold" : "normal",
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    margin: "0.5rem 0",
                  }}
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(lng); // Promeni jezik na izabrani
                    setIsDropdownOpen(false); // Zatvori dropdown nakon što jezik bude promenjen
                  }}
                >
                  {/* Zastava i naziv jezika */}
                  <img
                    src={`/images/${lng === "sr" ? "sr" : "gb"}.png`} // Dinamičko prikazivanje zastave
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
