import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";

const Stjuardesa = () => {
  const [stjuardesaLinija, setStjuardesaLinija] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const getStjuardesaLinija = async () => {
    const response = await fetch("http://localhost:5000/linija");
    const data = await response.json();
    setStjuardesaLinija(data.linija);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleQRScanSuccess = () => {
    console.log("Uspješno ste skenirali QR kod.");
    setShowQRScanner(false);
  };

  useEffect(() => {
    getStjuardesaLinija();
  }, []);

  return (
    <>
      <div>
        <h1>Aktivne linije:</h1>
        <ul>
          {stjuardesaLinija.map((linija) => (
            <div key={linija.id}>
              <li>{linija.stjuardesa}</li>
            </div>
          ))}
        </ul>
      </div>

      {showQRScanner && <QRScanner onScanSuccess={handleQRScanSuccess} />}
      {!showQRScanner && (
        <button onClick={handleQRScan}>Skeniraj QR kod</button>
      )}
    </>
  );
};

export default Stjuardesa;
