import React, { useState } from "react";
import "./Modal.css"; // Stilovi za modal
import S2 from "../components/rezervacije/proba/s2";
import MAN from "../components/rezervacije/proba/man";
import VH from "../components/rezervacije/proba/vh";
import MB1 from "../components/rezervacije/proba/mb1";
import MB3 from "../components/rezervacije/proba/mb3";
import MB4 from "../components/rezervacije/proba/mb4";
import VL from "../components/rezervacije/proba/vl";
import S1 from "../components/rezervacije/proba/s1";

const Modal = ({
  onReservationReturn,
  isOpen,
  onClose,
  povLinijaId,
  povratnaKrajnjaStanicaId,
  povratnaPocetnaStanicaId,
  oznakaBusa,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  if (!isOpen) return null; //? Ako modal nije otvoren, ne renderuj ništa

  const handleReservation = (selectedSeats) => {
    //? Ovde mozemo izvrsiti akcije sa selektovanim sedistima
    setSelectedSeats(selectedSeats);
    onReservationReturn(selectedSeats);
  };

  const handleConfirm = () => {
    // Otvori modal za potvrdu
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmYes = () => {
    // Ovde dodaj logiku za potvrdu selekcije
    console.log("Sedište potvrđeno:", selectedSeats);
    handleCloseConfirmationModal();
    onClose(); // Zatvori originalni modal
  };

  const handleConfirmNo = () => {
    // Zatvori modal bez potvrde
    handleCloseConfirmationModal();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          <div className="modal-section">
            <p className="modal-text">Izaberite sedište za povratak</p>
          </div>
          <div className="modal-section">
            {(oznakaBusa === "S2" && (
              <S2
                onReservation={handleReservation}
                linijaId={povLinijaId}
                pocetnaStanicaId={povratnaPocetnaStanicaId}
                krajnjaStanicaId={povratnaKrajnjaStanicaId}
              />
            )) ||
              (oznakaBusa === "MAN" && (
                <MAN
                  onReservation={handleReservation}
                  linijaId={povLinijaId}
                  pocetnaStanicaId={povratnaPocetnaStanicaId}
                  krajnjaStanicaId={povratnaKrajnjaStanicaId}
                />
              )) ||
              (oznakaBusa === "VH" && (
                <VH
                  onReservation={handleReservation}
                  linijaId={povLinijaId}
                  pocetnaStanicaId={povratnaPocetnaStanicaId}
                  krajnjaStanicaId={povratnaKrajnjaStanicaId}
                />
              )) ||
              (oznakaBusa === "MB1" && (
                <MB1
                  onReservation={handleReservation}
                  linijaId={povLinijaId}
                  pocetnaStanicaId={povratnaPocetnaStanicaId}
                  krajnjaStanicaId={povratnaKrajnjaStanicaId}
                />
              )) ||
              (oznakaBusa === "MB3" && (
                <MB3
                  onReservation={handleReservation}
                  linijaId={povLinijaId}
                  pocetnaStanicaId={povratnaPocetnaStanicaId}
                  krajnjaStanicaId={povratnaKrajnjaStanicaId}
                />
              )) ||
              (oznakaBusa === "MB4" && (
                <MB4
                  onReservation={handleReservation}
                  linijaId={povLinijaId}
                  pocetnaStanicaId={povratnaPocetnaStanicaId}
                  krajnjaStanicaId={povratnaKrajnjaStanicaId}
                />
              )) ||
              (oznakaBusa === "VL" && (
                <VL
                  onReservation={handleReservation}
                  linijaId={povLinijaId}
                  pocetnaStanicaId={povratnaPocetnaStanicaId}
                  krajnjaStanicaId={povratnaKrajnjaStanicaId}
                />
              )) ||
              (oznakaBusa === "S1" && (
                <S1
                  onReservation={handleReservation}
                  linijaId={povLinijaId}
                  pocetnaStanicaId={povratnaPocetnaStanicaId}
                  krajnjaStanicaId={povratnaKrajnjaStanicaId}
                />
              ))}
          </div>
          {selectedSeats.length > 0 && (
            <button className="buttonModal" onClick={handleConfirm}>
              Potvrda za izabrano sediste u povratku
            </button>
          )}
        </div>
      </div>

      {/* Novi modal za potvrdu */}
      {isConfirmationModalOpen && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal-content">
            <p className="confirmation-modal-p">
              Da li želite da potvrdite izbor sedišta?
            </p>
            <button
              className="confirmation-button yes"
              onClick={handleConfirmYes}
            >
              Da
            </button>
            <button
              className="confirmation-button no"
              onClick={handleConfirmNo}
            >
              Ne
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
