import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import { useLocation, useParams } from "react-router-dom";

const StjuardesaLinija = ({}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);

  //?dobijanje id-a preko url-a
  const { id } = useParams();

  //?primanje podataka sa pocetne za bas odredjenu liniju
  const location = useLocation();
  const state = location.state;

  console.log(state.linija.id);

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
        <>RADIIII</>
      </div>
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
