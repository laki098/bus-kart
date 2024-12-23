import React, { useEffect, useState } from "react";
import "./NeDolazakModal.css";
import apiUrl from "../apiConfig";
import ToastNotification from "../toastNotification/ToastNotification";

const NeDolazakModal = ({ korisnik, isOpen, onClose }) => {
  const [korisnikU, setKorisnikU] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Stanje za modal potvrde

  // Inicijalizuj notifySuccess i notifyWarn
  const { notifySuccess, notifyWarn } = ToastNotification();

  useEffect(() => {
    if (isOpen && korisnik) {
      setLoading(true);
      setError(null);
      fetch(`${apiUrl}/korisnik/neDolasci/${korisnik.idKorisnik}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Greška pri učitavanju podataka");
          }
          return response.json();
        })
        .then((data) => {
          setKorisnikU(data.polasci); // Očekujemo da polasci bude deo odgovora
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [isOpen, korisnik]);

  if (!isOpen) return null;

  const handleDelete = () => {
    setShowConfirmModal(true); // Prikaz modal za potvrdu
  };

  const confirmDelete = () => {
    fetch(`${apiUrl}/korisnik/obrisiNeDolaske/${korisnik.idKorisnik}`, {
      method: "PUT",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Greška pri brisanju nedolazaka");
        }
        return response.json();
      })
      .then((data) => {
        setShowConfirmModal(false);
        onClose(); // Zatvori modal nakon brisanja

        // Prikazivanje poruke iz odgovora servera
        const successMessage = data.message || "Nedolazak je uspešno obrisan!";
        notifySuccess(successMessage); // Pozovi notifySuccess
      })
      .catch((error) => {
        setError(error.message);
        setShowConfirmModal(false);

        // Prikazivanje greške
        notifyWarn("Došlo je do greške pri brisanju!"); // Pozovi notifyWarn
      });
  };

  const cancelDelete = () => {
    setShowConfirmModal(false); // Zatvori modal za potvrdu bez akcije
    notifyWarn("Brisanje nedolazaka je otkazano!"); // Pozovi notifyWarn
  };

  // Funkcija koja se poziva kada kliknemo van glavnog modala
  const handleMainModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Zatvori glavni modal
    }
  };

  // Funkcija koja se poziva kada kliknemo van modala za potvrdu
  const handleOverlayClick = (e) => {
    // Zatvori samo modal za potvrdu ako klikneš van njega
    if (
      e.target === e.currentTarget &&
      e.target.classList.contains("confirm-modal-overlay")
    ) {
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleMainModalOverlayClick}>
      <div className="modal-content">
        <h2>Detalji korisnika</h2>
        <div className="user-details">
          <p>
            <strong>Ime:</strong> {korisnik.ime}
          </p>
          <p>
            <strong>Prezime:</strong> {korisnik.prezime}
          </p>
          <p>
            <strong>Mejl:</strong> {korisnik.email}
          </p>
          <p>
            <strong>Broj telefona:</strong> {korisnik.brojTelefona}
          </p>
        </div>
        {loading && <p>Učitavanje...</p>}
        {error && <p style={{ color: "red" }}>Greška: {error}</p>}
        {korisnikU !== null && (
          <div>
            {korisnikU.length === 0 ? (
              <p>Nema nedolazaka za ovog korisnika.</p>
            ) : (
              korisnikU.map((polazak, index) => (
                <div key={polazak.rezervacijaId} className="nedolazak-item">
                  <p>
                    <strong>Nedolazak {index + 1}:</strong>
                  </p>
                  <p>
                    <strong>Datum polaska:</strong> {polazak.datumPolaska}
                  </p>
                  <p>
                    <strong>Vreme polaska:</strong> {polazak.vremePolaska}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
        <div className="modal-buttons">
          <button className="close-modal-button" onClick={onClose}>
            Zatvori
          </button>
          <button className="delete-modal-button" onClick={handleDelete}>
            Obriši nedolazke
          </button>
        </div>
      </div>

      {/* Modal za potvrdu brisanja */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
          <div className="confirm-modal-content">
            <p>Da li ste sigurni da želite da obrišete sve nedolaske?</p>
            <div className="confirm-modal-buttons">
              <button onClick={confirmDelete}>Da</button>
              <button onClick={cancelDelete}>Ne</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeDolazakModal;
