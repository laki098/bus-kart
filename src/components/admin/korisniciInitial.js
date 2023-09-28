import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import "./admin.css";

const KorisniciInitial = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [filtriraniKorisnici, setFiltriraniKorisnici] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [korisnikToDelete, setKorisnikToDelete] = useState(null);

  const getKorisnici = async () => {
    const response = await fetch("http://localhost:5000/korisnik");
    const data = await response.json();
    setKorisnici(data.korisnici);
    setFiltriraniKorisnici(data.korisnici); // Inicijalno prikaži sve korisnike
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

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();

    // Filtrirajte korisnike prema pretrazi
    const filteredKorisnici = korisnici.filter((korisnik) => {
      return (
        korisnik.korisnickoIme.toLowerCase().includes(searchQuery) ||
        korisnik.ime.toLowerCase().includes(searchQuery) ||
        korisnik.role.toLowerCase().includes(searchQuery) ||
        korisnik.email.toLowerCase().includes(searchQuery) ||
        korisnik.brojTelefona.toLowerCase().includes(searchQuery) ||
        korisnik.prezime.toLowerCase().includes(searchQuery)
      );
    });

    // Postavite filtrirane korisnike kao stanje
    setFiltriraniKorisnici(filteredKorisnici);
  };

  return (
    <>
      <div>
        <input
          type="text"
          className="input-search"
          placeholder="Pretraži korisnike..."
          onChange={handleSearch}
        />
      </div>

      <div className="rowTabela korisniciTabela">
        <ul>
          {filtriraniKorisnici.map((korisnik) => (
            <li key={korisnik.idKorisnik}>
              {/* Prikazivanje podataka o korisnicima */}
              <div className="jedan-red-stanica">
                <div class="column centar">Korisničko ime</div>
                <div class="column-2 centar podaci-sirina">
                  {korisnik.korisnickoIme}
                </div>
                <div class="column centar">Ime</div>
                <div class="column-2 centar podaci-sirina">{korisnik.ime}</div>
                <div class="column centar">Prezime</div>
                <div class="column-2 centar podaci-sirina">
                  {korisnik.prezime}
                </div>
                <div class="column centar">Broj telefona</div>
                <div class="column-2 centar podaci-sirina">
                  {korisnik.brojTelefona}
                </div>
                <div class="column centar">Email</div>
                <div class="column-2 centar podaci-sirina" style={{ width: "17rem" }}>
                  {korisnik.email}
                </div>
                <div class="column centar">Role</div>
                <div class="column-2 centar podaci-sirina">
                  {korisnik.role}
                </div>
                <div class="column">
                  <Link to={`${korisnik.idKorisnik}/korisnikChange`}>
                    <button className="buttonSwitch">Izmeni</button>
                  </Link>
                </div>
                <div class="column">
                  <button
                    className="buttonSwitch"
                    onClick={() => {
                      brisanjeKorisnika(korisnik.idKorisnik);
                    }}
                  >
                    Obriši
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
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