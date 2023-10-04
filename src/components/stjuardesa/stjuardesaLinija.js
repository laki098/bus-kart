import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import { useLocation } from "react-router-dom";

const StjuardesaLinija = ({}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [autobus, setAutobus] = useState([]);

  //?primanje podataka sa stjuardese za baš odredjenu liniju
  const location = useLocation();
  const state = location.state;

  const dobavljanjeBrojaMesta = async () => {
    const response = await fetch(
      `http://localhost:5000/autobusi/oznaka/${state.linija.oznakaBusa}`
    );
    const data = await response.json();
    setAutobus(data.autobusi);
  };

  useEffect(() => {
    dobavljanjeBrojaMesta();
  }, []);

  //?kada kliknemo dugme da otvori skenerQrCode
  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  //?kada skeniramo qrCode da se kamera sama zatvori
  const handleQRScanSuccess = (message) => {
    console.log("Uspešno skeniranje:", message);
    setShowQRScanner(false);
  };

  return (
    <>
      <div>
        <div className="labela-stanica labela-stanica-naslov red-1">Čekiranje stjuardese</div>
      </div>
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          idLinije={state.linija.id}
        />
      )}

      {!showQRScanner && (
        <button onClick={handleQRScan} className="buttonSwitch"><p className="admin-dugme-slova">Skeniraj QR kod </p></button>
      )}
    </>
  );
};

export default StjuardesaLinija;
