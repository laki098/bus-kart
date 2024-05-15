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
  openModalC,
  openModal,
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
  console.log(rezervacija);

  return (
    <div>
      <div className="autobus-stujardesa">
        {sediste.map((rezervisano, index) => (
          <div
            key={index + 1}
            className={`sediste ${
              isSeatReserved(index + 1) ? "rezervisano" : "nije"
            } ${
              rezervacija &&
              rezervacija.find(
                (rez) => rez.oznakaSedista === index + 1 && rez.cekiran === true
              )
                ? "cekirano"
                : ""
            }${
              rezervacija &&
              rezervacija.find(
                (rez) =>
                  rez.oznakaSedista === index + 1 && rez.cekiran === false
              )
                ? "nijeCekirano"
                : ""
            }`}
            onClick={() => {
              handleClick(index + 1);
              const rezervacijaZaSediste = rezervacija.find(
                (rez) => rez.oznakaSedista === index + 1
              );
              if (!rezervacijaZaSediste) {
                openModal(index + 1);
              } else if (
                rezervacijaZaSediste &&
                rezervacijaZaSediste.cekiran == false
              ) {
                openModalC(
                  index + 1,
                  rezervacijaZaSediste.id,
                  rezervacijaZaSediste.linijaId
                );
              }
            }}
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
      </div>
    </div>
  );
}

export default Autobus;
