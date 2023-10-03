import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import { useLocation } from "react-router-dom";
import Autobus from "../rezervacije/sedista/autobus";
import AdminLogic from "../admin/admin.logic";

const StjuardesaLinija = ({}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [autobus, setAutobus] = useState([]);
  const [linijaState, setLinijaState] = useState(null); // Dodajte stanje za liniju

  //?primanje podataka sa stjuardese za baš odredjenu liniju
  const location = useLocation();
  const state = location.state;

  //? dobavljanje autobusa koji je postavljen na toj liniji. kako bi prikayali sedista stjuardesi
  const dobavljanjeBrojaMesta = async () => {
    const response = await fetch(
      `http://localhost:5000/autobusi/oznaka/${state.linija.oznakaBusa}`
    );
    const data = await response.json();
    setAutobus(data.autobusi);
  };

  useEffect(() => {
    dobavljanjeBrojaMesta();
    setLinijaState(location.state);
  }, [location.state]);

  //?kada kliknemo dugme da otvori skenerQrCode
  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  //?kada skeniramo qrCode da se kamera sama zatvori
  const handleQRScanSuccess = (message) => {
    console.log("Uspešno skeniranje:", message);
    setShowQRScanner(false);
  };

  const adminLogic = AdminLogic();

  const medjustanice = [];

  //? Funkcija za ažuriranje linije kraj linije (datum i vreme azurira)
  const handleDatumAkcije = (akcija) => {
    const trenutniDatum = new Date();
    const formattedDatum = trenutniDatum.toISOString();
    const dataToUpdate = {
      pocetnaStanica: state.linija.pocetnaStanica.naziv,
      medjustanice: medjustanice,
      krajnjaStanica: state.linija.krajnjaStanica.naziv,
      vremePolaska: state.linija.vremePolaska,
      vremeDolaska: state.linija.vremeDolaska,
      datumPolaska: state.linija.datumPolaska,
      datumDolaska: state.linija.datumDolaska,
      oznakaBusa: state.linija.oznakaBusa,
      [`${akcija}Rute`]: formattedDatum, //? prosledjujem preko dugmeta akciju
      vozac: state.linija.vozac,
      stjuardesa: state.linija.stjuardesa,
    };

    adminLogic.editLinije(dataToUpdate, state.linija.id);
  };

  // Funkcija za ažuriranje vremena polaska medjustanice
  const updateMedjustanicaVremePolaska = async (medjustanicaId) => {
    const trenutniDatum = new Date();
    const trenutnoVreme = trenutniDatum.toISOString();

    // Pripremite podatke za ažuriranje u bazi podataka

    const dataToUpdate = {
      pocetnaStanica: state.linija.pocetnaStanica.naziv,
      medjustanice: state.linija.Stanicas.map((stanica) => {
        if (stanica.id === medjustanicaId) {
          return {
            ...stanica.Medjustanica,
            pocetakRute: trenutnoVreme,
          };
        }
        return stanica.Medjustanica;
      }),
      krajnjaStanica: state.linija.krajnjaStanica.naziv,
      vremePolaska: state.linija.vremePolaska,
      vremeDolaska: state.linija.vremeDolaska,
      datumPolaska: state.linija.datumPolaska,
      datumDolaska: state.linija.datumDolaska,
      oznakaBusa: state.linija.oznakaBusa,
      pocetakRute: state.linija.pocetakRute,
      krajRute: state.linija.krajRute,
      vozac: state.linija.vozac,
      stjuardesa: state.linija.stjuardesa,
    };

    // Pozovite funkciju za ažuriranje linije
    adminLogic.editLinije(dataToUpdate, state.linija.id);

    // Nakon ažuriranja u bazi podataka, dohvatite ažurirane podatke ponovo
    const updatedData = await fetch(
      `http://localhost:5000/autobusi/oznaka/${state.linija.oznakaBusa}`
    );
    const updatedAutobusData = await updatedData.json();
    setAutobus(updatedAutobusData.autobusi);
    console.log(updatedAutobusData.autobusi);
  };

  return (
    <>
      <div>
        <h2>Informacije o Ruti</h2>
        <div>
          <p>Polazna Tačka: {state.linija.pocetnaStanica.naziv}</p>
          <button onClick={() => handleDatumAkcije("pocetak")}>Krenuli</button>
        </div>

        <div>
          <p>Krajnja Tačka: {state.linija.krajnjaStanica.naziv}</p>
          <button onClick={() => handleDatumAkcije("kraj")}>Stigli</button>
        </div>

        <p>Međustanice:</p>
        <ul>
          {state.linija.Stanicas.map((stanica) => (
            <div key={stanica.id}>
              <li>{stanica.naziv}</li>
              <button
                onClick={() => updateMedjustanicaVremePolaska(stanica.id)}
              >
                Krenuli
              </button>
              <button>Stigli</button>
            </div>
          ))}
        </ul>
      </div>
      <Autobus autobusData={autobus} />
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          idLinije={state.linija.id}
        />
      )}

      {!showQRScanner && (
        <button onClick={handleQRScan}>Skeniraj QR kod</button>
      )}
    </>
  );
};

export default StjuardesaLinija;
