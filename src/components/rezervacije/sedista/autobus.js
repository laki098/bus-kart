import { useState, useEffect } from "react";
import "./sedista.css";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../../NavBar/links/i18n";
import "../i18n";

function Autobus({ autobusData }) {
  const [rezervacije, setRezervacije] = useState([]);
  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([]);
  const [odabraniAutobus, setOdabraniAutobus] = useState(null);

  useEffect(() => {
    if (autobusData) {
      // Postavljamo rezervacije kada se dobiju podaci o autobusu
      const brojSedista = autobusData.brojSedista;
      setRezervacije(Array(brojSedista).fill(false));
      setTrenutnaRezervacija([]);
      setOdabraniAutobus(autobusData.oznakaBusa);
    }
  }, [autobusData]);

  function handleClick(index) {
    const noviNiz = [...rezervacije];
    noviNiz[index] = !noviNiz[index];

    if (noviNiz[index]) {
      setTrenutnaRezervacija([...trenutnaRezervacija, index + 1]);
    } else {
      setTrenutnaRezervacija(
        trenutnaRezervacija.filter((s) => s !== index + 1)
      );
    }

    setRezervacije(noviNiz);
  }

  function handlePotvrdi() {
    console.log("Izabrana sedišta:", trenutnaRezervacija);
    // Ovde dodajte svoju logiku za potvrdu ili slanje podataka
  }

  return (
    <div>
      <div className="autobus-stujardesa">
        {rezervacije.map((rezervisano, index) => (
          <div
            key={index}
            className={`sediste ${rezervisano ? "rezervisano" : ""}`}
            onClick={() => handleClick(index)}
          >
            {index + 1}
          </div>
        ))}
        <div className="labela-stanica">
        <Trans i18nKey="description.part195">  Trenutno rezervisano mesto broj:    </Trans>
        {" "}
          &ensp;
          {trenutnaRezervacija.length > 0
            ? trenutnaRezervacija.join(", ")
            : "Nijedno"}
        </div>
        &emsp;&ensp;&emsp;&ensp;
        <button
          onClick={handlePotvrdi}
          disabled={trenutnaRezervacija.length === 0}
          className="buttonSwitch"
        >
          <Trans i18nKey="description.part121"> Potvrdite    </Trans>   {/* Potvrdi izbor   */}
        </button>
      </div>
    </div>
  );
}

export default Autobus;
