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
      <div className="rowTabela korisniciTabela" >
        <ul>
        {korisnici.map((korisnik) => {
          return (
            <li key={korisnik.idKorisnik}>
              {/* kod podataka nije valjalo sa klasama column-2 centar podaci-sirina */}
              <div className="jedan-red-stanica ">  {/* kod podataka bila je klasa "column podaci" a sada je  "column-2 podaci-sirina"  */}
                {/* bilo class="column centar" i --> class="column-2 centar podaci-sirina"  */}
                <div className="polje-stanica"> Korisničko ime</div><div className="info-stanica sirina-info-stanica">{korisnik.korisnickoIme}</div>
                <div className="polje-stanica"> Ime</div><div className="info-stanica sirina-info-7"> {korisnik.ime}</div>
                <div className="polje-stanica"> Prezime</div><div className="info-stanica sirina-info-7"> {korisnik.prezime} </div>
                <div className="polje-stanica"> Broj telefona</div><div className="info-stanica sirina-info-7">{korisnik.brojTelefona}</div>
                <div className="polje-stanica"> Email</div><div className="info-stanica sirina-info-15 email-polje" > {korisnik.email}</div>
                <div className="polje-stanica"> Role</div><div className="info-stanica">{korisnik.role}</div>
                <div className="polje-stanica"><Link to={`${korisnik.idKorisnik}/korisnikChange`}>
                  <button className="buttonSwitch">Izmeni</button>
                </Link>
                </div>
                <div class="polje-stanica"><button className="buttonSwitch"
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
        </ul>
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
