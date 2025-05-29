import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import "./admin.css";
import NeDolazakModal from "../../modal/NeDolasciModal";

import { useTranslation, Trans } from "react-i18next"; // prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";
import apiUrl from "../../apiConfig";
import LanguageSwitcher from "../header/header";

const KorisniciInitial = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [filtriraniKorisnici, setFiltriraniKorisnici] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [korisnikToDelete, setKorisnikToDelete] = useState(null);
  const [filter, setFilter] = useState("all"); // Novo stanje za filter

  const [selectedKorisnik, setSelectedKorisnik] = useState(null); // Za odabranog korisnika
  const [isNeDolazakModalOpen, setIsNeDolazakModalOpen] = useState(false); // Za otvaranje modala

  const getKorisnici = async () => {
    const response = await fetch(`${apiUrl}/korisnik`);
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

  // prevodjenje start
  const lngs = {
    en: { nativeName: "En" },
    sr: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  const handleNesavestniPutnici = () => {
    if (filter === "nesavestni") {
      // Resetujte prikaz svih korisnika
      setFiltriraniKorisnici(korisnici);
      setFilter("all"); // Postavite filter na "svi korisnici"
    } else {
      // Filtrirajte korisnike na osnovu nekog kriterijuma (npr. broja pritužbi)
      const nesavestni = korisnici.filter(
        (korisnik) => korisnik.brojNeDolazaka > 2
      );
      setFiltriraniKorisnici(nesavestni);
      setFilter("nesavestni"); // Postavite filter na "nesavestni putnici"
    }
  };

  const handleNeDolazak = (idKorisnik) => {
    const korisnik = korisnici.find((k) => k.idKorisnik === idKorisnik);
    if (korisnik) {
      setSelectedKorisnik(korisnik);
      setIsNeDolazakModalOpen(true);
    }
  };

  const closeNeDolazakModal = () => {
    setSelectedKorisnik(null);
    setIsNeDolazakModalOpen(false);
  };

  return (
    <>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <div className="red-1">
        <input
          type="text"
          className="input-search"
          placeholder="Pretražite korisnike..."
          onChange={handleSearch}
        />
        <button className="nesavestni-dugme" onClick={handleNesavestniPutnici}>
          {filter === "nesavestni" ? "Svi korisnici" : "Nesavesni putnici"}
        </button>
      </div>

      <div className="stampajLiniju">
        <div className="rowTabela korisniciTabela">
          {filtriraniKorisnici.length > 0 ? (
            <ul>
              {filtriraniKorisnici.map((korisnik) => (
                <li key={korisnik.idKorisnik}>
                  <div className="jedan-red-stanica ">
                    <div className="polje-stanica-3">
                      <Trans i18nKey="description.part44">
                        Korisničko ime{" "}
                      </Trans>
                    </div>
                    <div className="info-stanica-3 sirina-info-7 ">
                      {korisnik.korisnickoIme}
                    </div>
                    <div className="polje-stanica-3">
                      <Trans i18nKey="description.part40">Ime </Trans>
                    </div>
                    <div className="info-stanica-3 sirina-info-7">
                      {korisnik.ime}
                    </div>
                    <div className="polje-stanica-3">
                      <Trans i18nKey="description.part42">Prezime </Trans>
                    </div>
                    <div className="info-stanica-3 sirina-info-7">
                      {korisnik.prezime}
                    </div>
                    <div className="polje-stanica-3">
                      <Trans i18nKey="description.part48">Broj telefona </Trans>
                    </div>
                    <div className="info-stanica-3 sirina-info-10">
                      {korisnik.brojTelefona}
                    </div>
                    <div className="polje-stanica-3"> Email</div>
                    <div className="info-stanica sirina-info-15 email-polje-podesi">
                      {korisnik.email}
                    </div>
                    <div className="polje-stanica-3"> Role</div>
                    <div className="info-stanica-3 sirina-info-7">
                      {korisnik.role}
                    </div>
                    <div className="polje-stanica-3">
                      <Link to={`${korisnik.idKorisnik}/korisnikChange`}>
                        <button className="buttonSwitch">
                          <Trans i18nKey="description.part145">Izmeni</Trans>
                        </button>
                      </Link>
                    </div>

                    <div className="polje-stanica-3">
                      <button
                        className="buttonSwitch"
                        onClick={() => handleNeDolazak(korisnik.idKorisnik)}
                      >
                        <Trans i18nKey="">Ne dolasci</Trans>
                      </button>
                    </div>

                    <div className="polje-stanica-3">
                      <button
                        className="buttonSwitch "
                        onClick={() => brisanjeKorisnika(korisnik.idKorisnik)}
                      >
                        <Trans i18nKey="description.part134">Obriši </Trans>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-passengers-message">
              <Trans i18nKey="description.noUnsavedPassengers">
                Nema nesavesnih putnika.
              </Trans>
            </p>
          )}
        </div>
      </div>

      {/* Modal za prikaz nedolazaka */}
      <NeDolazakModal
        korisnik={selectedKorisnik}
        isOpen={isNeDolazakModalOpen}
        onClose={closeNeDolazakModal}
      />

      <div className="red-1"></div>
      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-box">
              <div className="red-05">
                <Trans i18nKey="description.part155">
                  Da li ste sigurni da želite da obrišete ovog korisnika?{" "}
                </Trans>
              </div>
              <button className="confirm-dialog-yes" onClick={confirmDelete}>
                <Trans i18nKey="description.part153">Da </Trans>
              </button>
              <button className="confirm-dialog-no" onClick={cancelDelete}>
                <Trans i18nKey="description.part154">Ne </Trans>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default KorisniciInitial;
