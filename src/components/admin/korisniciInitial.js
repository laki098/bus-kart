import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import "./admin.css";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";

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

  //prevodjenje start
  const lngs = {
      en: { nativeName: "Engleski" },
      de: { nativeName: "Srpski" },
    };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <>
      <header>
        <div className="jezici">
          {Object.keys(lngs).map((lng) => (
            <button
              key={lng}
              style={{
                fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
              }}
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
      </header>

      <div className="red-1">
    {/*  <Trans i18nKey="description.part156">    */}
        <input
          type="text"
          className="input-search"
          placeholder="Pretražite korisnike..."
          onChange={handleSearch}
        />
    {/*    </Trans> */}
      </div>

      <div className="stampajLiniju">
      <div className="rowTabela korisniciTabela">
        <ul>
          {filtriraniKorisnici.map((korisnik) => (
            <li key={korisnik.idKorisnik}>
              {/* kod podataka nije valjalo sa klasama column-2 centar podaci-sirina */}
              <div className="jedan-red-stanica ">  {/* kod podataka bila je klasa "column podaci" a sada je  "column-2 podaci-sirina"  */}
                {/* bilo class="column centar" i --> class="column-2 centar podaci-sirina"  */}
                <div className="polje-stanica"> 
                <Trans i18nKey="description.part44">Korisničko ime  </Trans>
                </div>
                <div className="info-stanica sirina-info-stanica">{korisnik.korisnickoIme}</div>
                <div className="polje-stanica"> 
                <Trans i18nKey="description.part40">Ime </Trans>
                </div>
                <div className="info-stanica sirina-info-7"> {korisnik.ime}</div>
                <div className="polje-stanica"> 
                <Trans i18nKey="description.part42">Prezime </Trans>
                </div>
                <div className="info-stanica sirina-info-7"> {korisnik.prezime} </div>
                <div className="polje-stanica"> 
                <Trans i18nKey="description.part48">Broj telefona </Trans>
                </div>
                <div className="info-stanica sirina-info-7">{korisnik.brojTelefona}</div>
                <div className="polje-stanica"> Email</div><div className="info-stanica sirina-info-15 email-polje" > {korisnik.email}</div>
                <div className="polje-stanica"> Role</div><div className="info-stanica sirina-info-6">{korisnik.role}</div>
                <div className="polje-stanica"><Link to={`${korisnik.idKorisnik}/korisnikChange`}>
                  <button className="buttonSwitch">
                  <Trans i18nKey="description.part145">Izmeni</Trans>
                  </button>
                </Link>
                </div>
                <div class="polje-stanica">< button className="buttonSwitch"
                  onClick={() => {
                    brisanjeKorisnika(korisnik.idKorisnik);
                  }}
                >
                  <Trans i18nKey="description.part134">Obriši </Trans>
                </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>


      <div className="red-1"></div>
      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-box">
            <div className="red-05">  
            <Trans i18nKey="description.part155">
            Da li ste sigurni da želite da obrišete ovog korisnika? </Trans>
            </div>
            <button className="confirm-dialog-yes" onClick={confirmDelete}>
            <Trans i18nKey="description.part153">Da </Trans>
            </button>
            <button className="confirm-dialog-no" onClick={cancelDelete}>
            <Trans i18nKey="description.part154"> Ne  </Trans>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default KorisniciInitial;