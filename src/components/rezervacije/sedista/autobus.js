import { useState } from "react";
import "./sedista.css";

function Autobus() {
  const autobusi = [
    { oznaka: "MB1", brojSedista: 55 },
    { oznaka: "MB3", brojSedista: 51 },
    { oznaka: "MB4", brojSedista: 48 },
    { oznaka: "VL", brojSedista: 49 },
    { oznaka: "MAN", brojSedista: 57 },
    { oznaka: "S1", brojSedista: 75 },
    { oznaka: "S2", brojSedista: 83 },
    { oznaka: "VH", brojSedista: 91 },
  ];

  // const [rezervacije, setRezervacije] = useState(Array(53).fill(false));
  // const [trenutnaRezervacija, setTrenutnaRezervacija] = useState(null);
  // const [odabraniAutobus, setOdabraniAutobus] = useState(0);
  const [rezervacije, setRezervacije] = useState(Array(55).fill(false));
  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState([]);
  const [odabraniAutobus, setOdabraniAutobus] = useState(undefined);

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

  function handleSelect(event) {
    const index = parseInt(event.target.value);
    setOdabraniAutobus(index);
    const brojSedista = autobusi[index].brojSedista;
    const noviNiz = Array(brojSedista).fill(false);
    setRezervacije(noviNiz);
    setTrenutnaRezervacija([]);
  }

  function handlePotvrdi() {
    console.log("Izabrana sedišta:", trenutnaRezervacija);
    // Ovde dodajte svoju logiku za potvrdu ili slanje podataka
  }

  return (
    <div>
      {/* <select value={odabraniAutobus} onChange={handleSelect}> */}
      <select
        value={odabraniAutobus !== null ? odabraniAutobus : ""}
        onChange={handleSelect}
      >
        <option value="">Izaberi autobus</option>
        {autobusi.map((autobus, index) => (
          <option key={index} value={index}>
            {autobus.oznaka} - {autobus.brojSedista} sedišta
          </option>
        ))}
      </select>

      {/* <div className="autobus">
        {rezervacije.map((rezervisano, index) => (
          <div
            key={index}
            className={`sediste ${rezervisano ? "rezervisano" : ""}`}
            onClick={() => handleClick(index)}
          >
            {index + 1}
          </div>
        ))}
        <div>
          Trenutno rezervisano mesto: {trenutnaRezervacija || "Nijedno"}
        </div>
      </div> */}
      {odabraniAutobus !== undefined && (
        <div className="autobus">
          {rezervacije.map((rezervisano, index) => (
            <div
              key={index}
              className={`sediste ${rezervisano ? "rezervisano" : ""}`}
              onClick={() => handleClick(index)}
            >
              {index + 1}
            </div>
          ))}
          <div>
            Trenutno rezervisana mesta:{" "}
            {trenutnaRezervacija.length > 0
              ? trenutnaRezervacija.join(", ")
              : "Nijedno"}
          </div>
          <button
            onClick={handlePotvrdi}
            disabled={trenutnaRezervacija.length === 0}
          >
            Potvrdi izbor
          </button>
        </div>
      )}
    </div>
  );
}

export default Autobus;
