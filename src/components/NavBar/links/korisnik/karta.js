import React, { useEffect, useState, createContext, useContext } from "react";
import cookies from "js-cookie";
import "./still.css";
import "../../../admin/dopuna_stila.css";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../i18n";
import "../../../../components/NavBar/links/i18n";
import apiUrl from "../../../../apiConfig";
import { Link } from "react-router-dom";      //zbog rezervacije sedista povratne karte

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Karta = () => {
  const [sveKarte, setSveKarte] = useState([]);
  const [neiskorisceneKarte, setNeiskorisceneKarte] = useState([]);
  const [iskorisceneKarte, setIskorisceneKarte] = useState([]);

  const [potvrdaP,setPotvrdaP]= useState(false);   //vrsta karta true= jeste povratna; je false= nije povratna
  const [loading, setLoading] = useState(true); // Dodato stanje za praćenje učitavanja

  let predhodnaPovratna = false;


  const [predPovratna, setPredPovratna]=useState(false);
  const [trenutnoOdabranaPovratna, setTrenutnoOdabranaPovratna] = useState(null);

  // Izvlačenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};
  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }

  const userId = { korisnikId: userPars.idKorisnika };
  const userIdP = JSON.stringify(userId);

  const getKarte = async (userId) => {
    const response = await fetch(`${apiUrl}/korisnik/karta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: userIdP,
    });
    const data = await response.json();
    //console.log(data)
    const a1 = data.karte.map((item) => {
      return {
        id: item.id,
        brojMesta: item.brojMesta,
        pocetna: item.polaznaStanicaR,
        krajnja: item.krajnjaStanicaR,
        linijaId: item.linijaId,
        datumP: item.datumPolaska,
        datumD: item.datumDolaska,
        vremeP: item.vremePolaska,
        vremeD: item.vremeDolaska,
        cekiranje: item.cekiran,
        povratna:item.tipKarte,
        tipKarte:item.tipKarte || " ",     // ovaj deo omogucava da se uvek korektno prikaze dugme Povratna 
        pocetnaStanicaId: item.pocetnaStanicaId,    // dodala zbog upisa povratne karte
        krajnjaStanicaId: item.krajnjaStanicaId,    // dodala zbog upisa povratne karte
        email: item.email,                          // dodala jer ga nije bilo

      };
    });
    setSveKarte(a1);
  };

  useEffect(() => {
    getKarte();
  }, []);

  //rezervacija sediste kod povratne karte

  const sedistePovratak = (karte) => {  
    const potvrda = window.confirm("Da li je želite da rezervišete sedište u povratnoj karti?");  
    if (potvrda) {
      alert("Kliknite na dugme Sedište");
      setPotvrdaP(true);     
    } else {
      setPotvrdaP(false);
    }
  };

  const sedistePovratak_1=()=>{
      setPotvrdaP(true); // Postavljanje setPotvrdaP na true kada se klikne na dugme 

  }


  useEffect(() => {
    // Ovde ćete dobiti ažuriranu vrednost potvrdaP
    console.log("Karta.js - potvrdaP:", potvrdaP);
  //  alert('potvrdaP  ' + potvrdaP);
  }, [potvrdaP]);

  // kraj izrade funckija koje treba da omoguce da se samo sediste rezervise kod povratne karte


  //prevodjenje start
  const lngs = {
    en: { nativeName: "En" },
    de: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  // ... preporuka ChatGTP-a ...

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/korisnik/karta`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: userIdP,
        });
        const data = await response.json();
        
        const a1 = data.karte.map((item) => {
          return {
            id: item.id,
            linijaId: item.linijaId,
            brojMesta: item.brojMesta,
            pocetna: item.polaznaStanicaR,
            krajnja: item.krajnjaStanicaR,
            datumP: item.datumPolaska,
            datumD: item.datumDolaska,
            vremeP: item.vremePolaska,
            vremeD: item.vremeDolaska,
            cekiranje: item.cekiran,
            povratna:potvrdaP,          // true = povratna karta, false nije povratna
        //    povratnaPrikaz:povratnaYes, // true = povratna karta, false nije povratna  kod II nacina rada
            tipKarte:item.tipKarte || "",     // dopisala zbog citanja tipa karte   --> bilo je item.tipKarte ali nije stabilno
            potvrdaP: '', // mozda ga ovo stabilizuje 

            pocetnaStanicaId: item.pocetnaStanicaId,    // dodala zbog upisa povratne karte
            krajnjaStanicaId: item.krajnjaStanicaId,    // dodala zbog upisa povratne karte
            email: item.email,                          // dodala jer ga nije bilo
    
          };
        });
        setSveKarte(a1);
        setLoading(false); // Postavi loading na false nakon uspešnog dobijanja podataka
      } catch (error) {
        console.error("Greška prilikom preuzimanja podataka:", error);
        setLoading(false); // Postavi loading na false i u slučaju greške
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Učitavanje...</p>; // Prikazuje se dok se podaci učitavaju
  }

  // Funkcija za prikazivanje notifikacije
  const porukaSediste = () => {
    // Prikazuje notifikaciju kada se klikne na dugme
    toast.success('Ukoliko želite da promenite rezervaciju povratne karte kliknite na Sedište!', {
      position: toast.POSITION.TOP_CENTER
    });
  };


  return (
    <>
      <div>
      
        <header>
          <div className="jezici">
            {Object.keys(lngs).map((lng) => (
              <button
                key={lng}
                className="jezici-dugme-promena"
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

        <div className="labela-stanica labela-stanica-naslov veliki-naslov red-1">
          <Trans i18nKey="description.part186">Moje karte </Trans>
        </div>
        <div>

          <div className="red-1"></div>
          
          <div >
            <div className="labela-stanica labela-stanica-naslov red-1 crveno">
            <Trans i18nKey="description.part187"> Aktivne karte </Trans>
            </div>
            {/* bila className="Grupa"    */}
            <div className="Grupa">
              {sveKarte
                .filter((karte) => karte.cekiranje === false)
                .map((karte, index) => (
                  
                  <div key={karte.id}>
                    <li className="lista-stavka">

                      <div className="naslov">
                        <Trans i18nKey="description.part184">
                          {" "}
                          Broj rezervisanih mesta{" "}                          
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.brojMesta}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part31">
                          {" "}
                          Polazna stanica{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.pocetna}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part32">
                          {" "}
                          Dolazna stanica{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.krajnja}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part33">
                          {" "}
                          Datum polaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.datumP}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part9">
                          {" "}
                          Datum dolaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.datumD}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part11">
                          {" "}
                          Vreme polaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.vremeP}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part13">
                          {" "}
                          Vreme dolaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.vremeD}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part185"> Čekiran </Trans>
                      </div>

                      <div className="vrednost">
                        {karte.cekiranje === false ? (
                          <>
                            {" "}
                            <Trans i18nKey="description.part154">
                              {" "}
                              NE{" "}
                            </Trans>{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <Trans i18nKey="description.part153">
                              {" "}
                              DA{" "}
                            </Trans>{" "}
                          </>
                        )}
                      </div>
                      <button className="dugme-otkazi-kartu"
                              style={{ visibility: new Date(karte.datumP) < new Date() ? 'hidden' : 'visible' }}>
                        <Trans i18nKey="description.part232">Otkaži  </Trans>
                      </button> 

                    </li>        
                    
                    {/*
                    <button className="dugme-otkazi-kartu">
                      <Trans i18nKey="description.part232">Otkaži  </Trans>
                    </button>   
                      
                    <div className="red-05"></div>         
                    */}

                    {/* dole je bilo na onClick={sedistePovratak}  */}
                    {/* (karte.tipKarte === 'Povratna' || karte.tipKarte === 'Return') && !predhodnaPovratna */ karte.tipKarte === 'PrPovratna'  &&   (                                         
                        <button className="dugme-povratna-karta" onClick={sedistePovratak_1 } 
                         >  
                            <Trans i18nKey="description.part25"> Povratna </Trans>
                        </button>                        
                    ) }  

                       
  
                   {/*  {(karte.tipKarte === 'Povratna' || karte.tipKarte === 'Return')?
                    predhodnaPovratna=!predhodnaPovratna : " "} */}

                    
                   {(karte.tipKarte === 'PrPovratna' )?
                    predhodnaPovratna= true : " "}
                                     

                    {/* Idi samo ako je povratna karta na stranicu RezervacijaComponent.js parametri su state */}
                    
                    {(karte.tipKarte === 'PrPovratna' ) && potvrdaP  ? (
                      
                      <Link 
                            to={{
                            pathname: `${karte.linijaId}/rezervacijakarte`,
                            state: {
                              id: karte.id,
                              linijaId: karte.linijaId,
                              vremePolaska: karte.vremeP,
                              pocetnaStanica: karte.pocetna,
                              pocetnaStanicaId: karte.pocetnaStanicaId,
                              krajnjaStanicaId: karte.krajnjaStanicaId,
                              brojSlobodnihMesta: karte.brojSlobodnihMesta,
                              krajnjaStanica: karte.krajnja,
                              vremeDolaska: karte.vremeD,
                              datumPolaska: karte.datumP,
                              datumDolaska: karte.datumD,
                              povratna: potvrdaP,     //ako je tip povratne karte
                              tipKarte: karte.tipKarte,   //dodala 12.02
                              email: karte.email,         //dodala 12.02
                            },
                          }}
                          > 
                           
                          &ensp; 
                          {predhodnaPovratna? 
                          <button className="dugme-sediste-karta">
                          <Trans i18nKey="description.part203">Sedište  </Trans>  </button> 
                          : " "} 
                                    
                      </Link> 
                    ) : null}
                       
                    
                  
                  </div>
                ))}
            </div>
          </div>

          <div className="red-1"></div>

          <div>
            <div className="labela-stanica labela-stanica-naslov red-1 crveno">
              <Trans i18nKey="description.part188">Neaktivne karte </Trans>
            </div>
            <div className="Grupa">
              {sveKarte
                .filter((karte) => karte.cekiranje === true)
                .map((karte) => (
                  <div key={karte.id}>
                    <li className="lista-stavka">
                      <div className="naslov">
                        <Trans i18nKey="description.part184">
                          {" "}
                          Broj rezervisanih mesta{" "}                          
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.brojMesta}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part31">
                          {" "}
                          Polazna stanica{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.pocetna}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part32">
                          {" "}
                          Dolazna stanica{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.krajnja}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part33">
                          {" "}
                          Datum polaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.datumP}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part9">
                          {" "}
                          Datum dolaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.datumD}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part11">
                          {" "}
                          Vreme polaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.vremeP}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part13">
                          {" "}
                          Vreme dolaska{" "}
                        </Trans>
                      </div>
                      <div className="vrednost">{karte.vremeD}</div>
                      <div className="naslov">
                        <Trans i18nKey="description.part185"> Čekiran </Trans>
                      </div>

                      <div className="vrednost">
                        {karte.cekiranje === false ? (
                          <>
                            {" "}
                            <Trans i18nKey="description.part154">
                              {" "}
                              NE{" "}
                            </Trans>{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <Trans i18nKey="description.part153">
                              {" "}
                              DA{" "}
                            </Trans>{" "}
                          </>
                        )}
                      </div>
                    </li>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Karta;
