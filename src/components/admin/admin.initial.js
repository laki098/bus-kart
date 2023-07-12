import React, { useEffect, useState } from "react";
import LinijeApi from "../../api/linije.api";
import AdminLogic from "./admin.logic";
import { Link } from "react-router-dom";
import "./admin.css";
import helpers from "../../helpers/helpers";

//import "../registration/registration.module.css";         // dodala sn
import classes from "../registration/registration.module.css";
import "../login/loginStyle.css";

import '../NavBar/links/i18n'; // za prevodjenje
import '../rezervacije/i18n';
import { useTranslation, Trans } from 'react-i18next';    //prevodjenje

import { useMediaQuery } from 'react-responsive';         // responsive
import MediaQuery from 'react-responsive';


const AdminInitial = () => {
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [val1, setVal1] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [val2, setVal2] = useState("");
  const [polasci, setPolasci] = useState([]);
  const [dolasci, setDolasci] = useState([]);
  /*   const [linije, setLinije] = useState([]); */

  const filterLinija = async () => {
    if (!valueDate) return;

    const response = await LinijeApi().filterLinija(val1, val2, valueDate);
    const data = await response.json();
    setFilteredLinije(data);
  };
  const getLinije = async () => {
    const response = await fetch("http://localhost:5000/linije/linija");
    const data = await response.json();
    const mestoPolaska = data
      .map((item) => item.mestoPolaska)
      .filter(helpers.filterUnique); //filtriranje mesto polaska(da ne bi ispisivao duplo npr:Beograd beograd u selectu)
    const mestoDolaska = data
      .map((item) => item.mestoDolaska)
      .filter(helpers.filterUnique); //filtriranje mesto dolaska(da ne bi ispisivao duplo npr:Beograd beograd u selectu)
    setPolasci(mestoPolaska); // setujemo filtrirano mesto polaska(da ne bi moglo da ispisuje duplo)
    setDolasci(mestoDolaska); // setujemo filtrirano mesto dolaska(da ne bi moglo da ispisuje duplo)
    /* setLinije(data); */
    setVal1(data[0].mestoPolaska);
    setVal2(data[0].mestoDolaska);
  };

  useEffect(() => {
    getLinije();
  }, [filteredLinije]);

  const adminLogic = AdminLogic();

  const [showClass, setShowClass] = useState(false);

  const changer = () => {
    setShowClass(!showClass);
  };

  const clickButton = (event) => {
    filterLinija();
    changer();
  };

  const brisanjeLinije = async (id) => {
    const response = await adminLogic.brisanjeLinije(id); // slanje zahteva za brisanje bas za taj id

    if (!response.statusText === "OK") {
      //
      return; // proverava se da li je izbrisan iz baze
    } //

    setFilteredLinije((filtriraneLinije) => {
      //  ako jeste onda ce da odradi cuvanje linija
      return filtriraneLinije.filter((linija) => linija.id !== id); //  i ponovo filtrirati. (kako bi se refresovalo)
    });
  };

  //prevodjenje
  const lngs = {
    en: { nativeName: 'Engleski' }, 
    de: { nativeName: 'Srpski' }
  };
  const { t, i18n } = useTranslation();
  // prevodjenje

  return (
    <div >                {/*  dodala klasu iz registration komponent*/}
      {/*  header je deo za prevodjenje*/}
      <header>
        <div style={{textAlign:"right", marginRight:"3rem"}}>
          {Object.keys(lngs).map((lng) => (
            <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
        </header> 


      <div className={classes.form}>    {/* className={classes.form}   className="home" */}
        <div style={{textAlign:"center"}}>      {/* className="prvi"  */}
          <label className="labela"><Trans i18nKey="description.part3">Mesto polaska:</Trans></label><br/>
          <select //
            className="position unos" //className="position" bilo je  className="unos"
            value={val1} //
            onChange={(e) => setVal1(e.target.value)} //
          >
            {polasci.map((linija) => {
              // Za ispis iz baze filtrirano mesto polaska
              return (
                //
                <option key={linija} value={linija}>
                  {linija}
                </option> //
              );
            })}
          </select>
        </div>
        <div  style={{textAlign:"center"}}>       {/* className="prvi"  */}
          <label className="labela"><Trans i18nKey="description.part5">Mesto Dolaska:</Trans></label><br/>
          <select //
            className="position unos" // unos sam dopisala dodatno
            value={val2} //
            onChange={(e) => setVal2(e.target.value)} //
          >
            {dolasci.map((linija) => {
              //Za ispis iz  baze filtirano mesto dolaska
              return (
                //
                <option key={linija} value={linija}>
                  {linija}
                </option> //
              ); //
            })}
          </select>
        </div>
        <div style={{textAlign:"center"}}>
          <label className="labela"><Trans i18nKey="description.part9">Datum polaska</Trans></label><br/>
          <input
            type="date"
            className="position unos"
            value={valueDate}
            onChange={(e) => setValueDate(e.target.value)}
          />
        </div> <br/>
        <button className="button-admin" onClick={clickButton}>
        <Trans i18nKey="description.part34">Red vožnje </Trans>
        </button>
        <Link to="/admin.component">
          <button className="button-admin"><Trans i18nKey="description.part37">Dododavanje linije </Trans></button>
        </Link>
      </div>


      {filteredLinije.length > 0 ? (
        <div>
          <ul>
            <div className={`home1 .home1 ${showClass ? "show" : ""}`}>     
              <style>{`
            .home1 {
              display: none;
            }
            .show {
              display: block;
            }
          `}</style>
              {filteredLinije.map((linija) => {
                return (
                  <li key={linija.id}>
                    <div className="home-show">
                    <Trans i18nKey="description.part11">Vreme polaska: </Trans> {linija.vremePolaska}, 
                    <Trans i18nKey="description.part13">Vreme dolaska:</Trans>{" "} {linija.vremeDolaska}, 
                    <Trans i18nKey="description.part131">Prevoznik: </Trans> {linija.prevoznik},
                    <Trans i18nKey="description.part3">Mesto polaska: </Trans> {linija.mestoPolaska}, 
                    <Trans i18nKey="description.part5">Mesto dolaska: </Trans>{" "} {linija.mestoDolaska}
                      &nbsp;&nbsp;<br/>
                      <Link to={`${linija.id}/admin.change.line`}>
                        <button style={{backgroundColor:"lightblue", borderBlockColor: "blue", marginBlock: "0.4rem", borderColor: "blue"}}><Trans i18nKey="description.part133">Zameni</Trans></button>
                      </Link> &emsp;
                      <button onClick={() => brisanjeLinije(linija.id)} style={{backgroundColor:"lightblue", borderBlockColor: "blue"}}>
                      <Trans i18nKey="description.part134">Obriši</Trans>
                      </button>
                    </div>
                  </li>
                );
              })}
            </div>
          </ul>
        </div>
      ) : (
        <p><Trans i18nKey="description.part135">Nema Linije...</Trans></p>
      )}
    </div>
  );
};

export default AdminInitial;
