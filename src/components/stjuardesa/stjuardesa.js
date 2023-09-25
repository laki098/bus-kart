import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import QRScanMessage from "./QRScanMessage"; // Dodajte import

const Stjuardesa = () => {
  const [stjuardesaLinija, setStjuardesaLinija] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanMessage, setScanMessage] = useState(null); // Dodajte stanje za poruku

  const getStjuardesaLinija = async () => {
    const response = await fetch("http://localhost:5000/linija");
    const data = await response.json();
    setStjuardesaLinija(data.linija);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleQRScanSuccess = (message) => {
    console.log("Uspešno skeniranje:", message);
    setScanMessage(message); // Postavite poruku kada je skeniranje uspješno
    setShowQRScanner(false);
  };

  const handleScanMessageClose = () => {
    setScanMessage(null); // Zatvorite poruku
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

      {scanMessage && (
        <QRScanMessage message={scanMessage} onClose={handleScanMessageClose} />
      )}

      {!showQRScanner && (
        <button onClick={handleQRScan}>Skeniraj QR kod</button>
      )}
    </>
  );
};

export default Stjuardesa;
