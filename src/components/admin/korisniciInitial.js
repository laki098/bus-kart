import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import "./admin.css";

import "./ListBus.css";

import { useTranslation, Trans } from 'react-i18next';    //prevodjenje
import '../../components/NavBar/links/i18n';
import '../../components/rezervacije/i18n';


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

  //prevodjenje start
    const lngs = {
      en: { nativeName: 'Engleski' }, 
      de: { nativeName: 'Srpski' }
      };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <>

      <header>
          <div className="jezici">
          {Object.keys(lngs).map((lng) => (
            <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)} >
              {lngs[lng].nativeName}
            </button>
          ))}
          </div>
      </header> 

      <div className="red-1"></div>  
      <div className="stampajLiniju">    
      <div className="rowTabela korisniciTabela">
        {korisnici.map((korisnik) => {
          return (
            <li key={korisnik.idKorisnik}>
              <div>
                <div class="column centar"> Korisničko ime:</div><div class="column centar podaci">{korisnik.korisnickoIme}</div>
                <div class="column centar"> Ime: </div><div class="column centar podaci"> {korisnik.ime}</div>
                <div class="column centar"> Prezime: </div><div class="column centar podaci"> {korisnik.prezime} </div>
                <div class="column centar"> Broj telefona:{" "}</div><div class="column centar podaci">{korisnik.brojTelefona}</div>
                <div class="column centar"> Email:</div><div class="column centar podaci"> {korisnik.email}</div>
                <div class="column centar"> Role:{" "} </div><div class="column centar podaci">{korisnik.role}</div>
                <div class="column"><Link to={`${korisnik.idKorisnik}/korisnikChange`}>
                  <button className="buttonSwitch">Izmeni</button>
                </Link>
                </div>
                <div class="column"><button className="buttonSwitch"
                  onClick={() => {
                    brisanjeKorisnika(korisnik.idKorisnik);
                  }}
                >
                  Obriši
                </button>
                </div>
              </div>
            </li>
            
          );
        })}
      </div>
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
