import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import "./admin.css";


const KorisniciInitial = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [korisnikToDelete, setKorisnikToDelete] = useState(null);

  const getKorisnici = async () => {
    const response = await fetch("http://localhost:5000/korisnik");
    const data = await response.json();
    setKorisnici(data.korisnici);
  };

  useEffect(() => {
    getKorisnici();
  }, []);

  const brisanjeKorisnika = (idKorisnik) => {
    setKorisnikToDelete(idKorisnik);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (korisnikToDelete !== null) {
      const response = await KorisnikApi().brisanjeKorisnika(korisnikToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setKorisnikToDelete(null);
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <div>
        {korisnici.map((korisnik) => {
          return (
            <li key={korisnik.idKorisnik}>
              <div>
                korisnicko ime: {korisnik.korisnickoIme}, ime: {korisnik.ime},
                prezime: {korisnik.prezime}, brojTelefona :{" "}
                {korisnik.brojTelefona}, email: {korisnik.email}, role:{" "}
                {korisnik.role}
                <Link to={`${korisnik.idKorisnik}/korisnikChange`}>
                  <button>Izmeni</button>
                </Link>
                <button
                  onClick={() => {
                    brisanjeKorisnika(korisnik.idKorisnik);
                  }}
                >
                  Obrisi
                </button>
              </div>
            </li>
          );
        })}
      </div>

      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-box">
            <p>Da li ste sigurni da želite da obrišete ovog korisnika?</p>
            <button className="confirm-dialog-yes" onClick={confirmDelete}>
              Da
            </button>
            <button className="confirm-dialog-no" onClick={cancelDelete}>
              Ne
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default KorisniciInitial;
