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

  const [aktivniNedolasci, setAktivniNedolasci] = useState([]);
  const [stariNedolasci, setStariNedolasci] = useState([]);

  const [showStariNedolasci, setShowStariNedolasci] = useState(false);

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
          console.log(data);
          setAktivniNedolasci(data.aktivniNedolasci || []);
          setStariNedolasci(data.stariNedolasci || []);
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

        {/* Prikaz aktivnih nedolazaka */}
        <div>
          <h3>Aktivni ne dolasci</h3>
          {aktivniNedolasci.length === 0 ? (
            <p>Nema aktivnih ne dolazaka.</p>
          ) : (
            aktivniNedolasci.map((nedolazak, index) => (
              <div key={nedolazak.rezervacijaId} className="nedolazak-item">
                <p>
                  <strong>Ne dolazak {index + 1}:</strong>
                </p>
                <p>
                  <strong>Datum polaska:</strong> {nedolazak.datumPolaska}
                </p>
                <p>
                  <strong>Vreme polaska:</strong> {nedolazak.vremePolaska}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Dugme za prikaz starih nedolazaka kao accordion */}
        {stariNedolasci.length > 0 && (
          <div className="accordion">
            <button
              className="accordion-button"
              onClick={() => setShowStariNedolasci(!showStariNedolasci)}
            >
              {showStariNedolasci
                ? "▲ Sakrij stare ne dolaske"
                : "▼ Stari ne dolasci"}
            </button>
            <div
              className={`accordion-content ${
                showStariNedolasci ? "show" : ""
              }`}
            >
              {stariNedolasci.map((nedolazak, index) => (
                <div key={nedolazak.rezervacijaId} className="nedolazak-item">
                  <p>
                    <strong>Ne dolazak {index + 1}:</strong>
                  </p>
                  <p>
                    <strong>Datum polaska:</strong> {nedolazak.datumPolaska}
                  </p>
                  <p>
                    <strong>Vreme polaska:</strong> {nedolazak.vremePolaska}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-buttons">
          <button className="close-modal-button" onClick={onClose}>
            Zatvori
          </button>
          <button className="delete-modal-button" onClick={handleDelete}>
            Obriši ne dolaske
          </button>
        </div>
      </div>

      {/* Modal za potvrdu brisanja */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
          <div className="confirm-modal-content">
            <p>Da li ste sigurni da želite da obrišete sve ne dolaske?</p>
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
