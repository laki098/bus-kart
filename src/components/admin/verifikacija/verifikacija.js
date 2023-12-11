import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./verifikacija.css"; // Importujte CSS fajl
import apiUrl from "../../../apiConfig";

const Verifikacija = () => {
  const [rezervacija, setRezervacija] = useState(null);

  const { id } = useParams();

  const getRezervacija = async () => {
    try {
      const response = await fetch(`${apiUrl}/rezervacije/${id}`);
      const data = await response.json();
      setRezervacija(data.rezervacija);
    } catch (error) {
      console.error("Greška prilikom dohvatanja rezervacije:", error);
    }
  };

  useEffect(() => {
    getRezervacija();

    // Dodajte klasu 'verifikacija-stranica' na body kada se komponenta mountuje
    document.body.classList.add("verifikacija-stranica");

    // Uklonite klasu 'verifikacija-stranica' kada se komponenta unmountuje
    return () => {
      document.body.classList.remove("verifikacija-stranica");
    };
  }, []);

  return (
    <div
      className={rezervacija?.cekiran ? "crvena-pozadina" : "zelena-pozadina"}
    >
      {rezervacija ? (
        <div>
          <h1>Status karte</h1>
          <p className="verifikacija-p">
            Status karte:{" "}
            {rezervacija.cekiran
              ? "Karta je iskorišćena"
              : "Karta nije iskorišćena."}
          </p>
          <p className="verifikacija-p">
            Datum polaska: {rezervacija.datumPolaska}
          </p>
          <p className="verifikacija-p">
            Vreme polaska: {rezervacija.vremePolaska}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Verifikacija;
