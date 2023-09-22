import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import KorisnikLogic from "./korisnikLogic";

import "./ListBus.css";

import { useTranslation, Trans } from 'react-i18next';    //prevodjenje
import '../../components/NavBar/links/i18n';
import '../../components/rezervacije/i18n';


const KorisnikChange = () => {
  const [korisnik, setKorisnik] = useState({});
  const { idKorisnik } = useParams();
  const [privremenaRola, setPrivremenaRola] = useState(false);

  useEffect(() => {
    getKorisnik();
  }, []);

  const korisnikLogic = KorisnikLogic();

  /* const back = () => {
    window.history.back();
  }; */

  const back = () => {
    window.history.back();
  };
  
  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      idKorisnik: idKorisnik,
      korisnickoIme: formData.get("korisnickoIme"),
      ime: formData.get("ime"),
      prezime: formData.get("prezime"),
      brojTelefona: formData.get("brojTelefona"),
      email: formData.get("email"),
      role: formData.get("role"), //mesto formdata stavljam userpars.rola
      vremeTrajanjaRole: formData.get("vremeTrajanjaRole"),
      privremenaRola,
    };
    korisnikLogic.editKorisnik(data);
  };

  const handleChange = () => {
    setPrivremenaRola((prev) => !prev);
  };

  const getKorisnik = async () => {
    const response = await KorisnikApi().filterKorisnikId(idKorisnik);
    const data = await response.data;

    setKorisnik(data.korisnik);
  };

  //prevodjenje start
  const lngs = {
      en: { nativeName: 'Engleski' }, 
      de: { nativeName: 'Srpski' }
      };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <div>
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

    <form onSubmit={submitHandler}>
      <div className="stampajLiniju">
      <div className="rowTabela korisniciTabela">
      <div class="column-1 centar-1"><label>Korisničko ime</label></div>
        <div class="column-1 centar-1 podaci "><input
          defaultValue={korisnik.korisnickoIme}
          type="text"
          required
          name="korisnickoIme"
          style={{width: "6rem"}}
          onChange={korisnikLogic.changeHandler}
        ></input></div>
        <div class="column-1 centar-1 "><label>Ime</label></div>
        <div class="column-1 centar-1 podaci">
		    <input
          defaultValue={korisnik.ime}
          type="text"
          required
          name="ime"
          style={{width: "6rem"}}
          className="inputVelicina"
          onChange={korisnikLogic.changeHandler}>
		    </input></div>
        <div class="column-1 centar-1"><label>Prezime</label></div>
        <div class="column-1 centar-1 podaci">
          <input
          defaultValue={korisnik.prezime}
          type="text"
          required
          name="prezime"
          style={{width: "6rem"}}
          onChange={korisnikLogic.changeHandler}>
          </input></div>
        <div class="column-1 centar-1"><label>Broj telefona</label></div>
        <div class="column-1 centar-1 podaci">
          <input
          defaultValue={korisnik.brojTelefona}
          type="text"
          required
          name="brojTelefona"
          style={{width: "6rem"}}
          onChange={korisnikLogic.changeHandler}>
          </input></div>
        <div class="column-1 centar-1"><label>Email</label></div>
        <div class="column-1 centar-1 podaci">
          <input
          defaultValue={korisnik.email}
          type="text"
          required
          name="email"
          style={{width: "10rem"}}
          onChange={korisnikLogic.changeHandler}>
          </input></div>
        <div class="column-1 centar-1 "><label>Privremena rola</label></div>
        <div class="column-1 centar-1 podaci">
        <input type="checkbox" onChange={handleChange} value={privremenaRola} />
        {privremenaRola && (
          <>
            &ensp;  <label>Vreme trajanja role</label> &ensp;
            <input
              type="number"
              name="vremeTrajanjaRole"
              onChange={korisnikLogic.changeHandler}
            />
          </>
        )}
        </div>
        <div class="column-1 centar-1 "><label>Role</label></div>
        <div class="column-1 centar-1 podaci">
        <select
          defaultValue={korisnik.role}
          type="text"
          required
          name="role"
          onChange={korisnikLogic.changeHandler}
        >
          <option value="korisnik">korisnik</option>
          <option value="menadzer">menadzer</option>
          <option value="admin">admin</option>
          <option value="stjuardesa">stjuardesa</option>
          <option value="biletar">biletar</option>
          <option value="vozac">vozac</option>
        </select>
        </div>
        <div className="column-1"><button onClick={back} type="submit" class="buttonSwitch">   {/* bila je klasa dugme */}
          {" "}
          Sačuvaj
        </button></div>
      </div>
      </div>
    </form>
    </div>
  );
};
export default KorisnikChange;
