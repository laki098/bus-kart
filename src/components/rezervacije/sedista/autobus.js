import { useState, useEffect } from "react";
import "./sedista.css";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../../NavBar/links/i18n";
import "../i18n";
import apiUrl from "../../../apiConfig";

function Autobus({
  autobusData,
  linijaId,
  pocetnaStanicaId,
  krajnjaStanicaId,
  updateTrenutnaRezervacija,
}) {
  const [sediste, setSediste] = useState([]);
  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([]);
  const [odabraniAutobus, setOdabraniAutobus] = useState(null);
  const [rezervacija, setRezervacija] = useState([]);
  const [pocetnaStanicaIdS, setPocetnaStanicaIdS] = useState();

  const getLinije = async () => {
    const response = await fetch(`${apiUrl}/rezervacije/linija/${linijaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        pocetnaStanicaId,
        krajnjaStanicaId,
      }),
    });
    const data = await response.json();
    setRezervacija(data.rezervacije);
  };

  useEffect(() => {
    if (autobusData) {
      //?Postavljamo sediste kada se dobiju podaci o autobusu
      const brojSedista = autobusData.brojSedista;
      setSediste(Array(brojSedista).fill(false));
      setOdabraniAutobus(autobusData.oznakaBusa);
    }
    if (pocetnaStanicaId != undefined) {
      getLinije();
      setPocetnaStanicaIdS(pocetnaStanicaId);
    }
    if (krajnjaStanicaId != undefined) {
      getLinije();
      setPocetnaStanicaIdS(krajnjaStanicaId);
    }
  }, [autobusData, pocetnaStanicaId, krajnjaStanicaId]);

  function handleClick(index) {
    const noviNiz = [...sediste];
    noviNiz[index] = !noviNiz[index];

    if (noviNiz[index]) {
      const novaRezervacija = [...trenutnaRezervacija, index];
      setTrenutnaRezervacija(novaRezervacija);
      updateTrenutnaRezervacija(novaRezervacija);
    } else {
      const novaRezervacija = trenutnaRezervacija.filter((s) => s !== index);
      setTrenutnaRezervacija(novaRezervacija);
      updateTrenutnaRezervacija(novaRezervacija);
    }

    setSediste(noviNiz);
  }

  function handlePotvrdi() {
    console.log("Izabrana sedišta:", trenutnaRezervacija);
    // Ovde dodajte svoju logiku za potvrdu ili slanje podataka
    updateTrenutnaRezervacija([...trenutnaRezervacija]);
  }

  const isSeatReserved = (seatNumber) => {
    // Proverite da li rezervacija niz ima podatke
    return (
      rezervacija &&
      rezervacija.length > 0 &&
      rezervacija.some((r) => r.oznakaSedista == seatNumber)
    );
  };

  return (
    <div>
      <div className="autobus-stujardesa">
        {sediste.map((rezervisano, index) => (
          <div
            key={index + 1}
            className={`sediste ${
              isSeatReserved(index + 1) ? "rezervisano" : "nije"
            }`}
            onClick={() => handleClick(index + 1)}
          >
            {isSeatReserved(index + 1) ? (
              <p>
                osvezenje:{" "}
                {rezervacija.find((rez) => rez.oznakaSedista === index + 1)
                  ?.osvezenje || "Bez osvezenja"}
              </p>
            ) : null}

            {index + 1}
          </div>
        ))}
        <div className="labela-stanica">
          <Trans i18nKey="description.part195">
            {" "}
            Trenutno rezervisano mesto broj:{" "}
          </Trans>{" "}
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
          <Trans i18nKey="description.part121"> Potvrdite </Trans>
        </button>
      </div>
    </div>
  );
}

export default Autobus;
