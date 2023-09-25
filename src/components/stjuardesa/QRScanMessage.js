import React from "react";

const QRScanMessage = ({ message, onClose }) => {
  return (
    <div className="qr-scan-message">
      <p>{message}</p>
      <button onClick={onClose}>Zatvori</button>
    </div>
  );
};

export default QRScanMessage;
