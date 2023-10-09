import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import "./still.css";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../i18n";
import "../../../../components/NavBar/links/i18n";

const Karta = () => {
  const [sveKarte, setSveKarte] = useState([]);
  const [neiskorisceneKarte, setNeiskorisceneKarte] = useState([]);
  const [iskorisceneKarte, setIskorisceneKarte] = useState([]);

  // Izvlačenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};
  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }

  const userId = { korisnikId: userPars.idKorisnika };
  const userIdP = JSON.stringify(userId);

  const getKarte = async (userId) => {
    const response = await fetch("http://localhost:5000/korisnik/karta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: userIdP,
    });
    const data = await response.json();

    const a1 = data.karte.map((item) => {
      console.log(item.polaznaStanicaR);
      return {
        brojMesta: item.brojMesta,
        pocetna: item.polaznaStanicaR,
        krajnja: item.krajnjaStanicaR,
        datumP: item.datumPolaska,
        datumD: item.datumDolaska,
        vremeP: item.vremePolaska,
        vremeD: item.vremeDolaska,
        cekiranje: item.cekiran,
      };
    });
    setSveKarte(a1);
  };

  console.log(neiskorisceneKarte);
  console.log(iskorisceneKarte);

  useEffect(() => {
    getKarte();
  }, []);

  //prevodjenje start
  const lngs = {
      en: { nativeName: "Engleski" },
      de: { nativeName: "Srpski" },
    };
  const { t, i18n } = useTranslation();
  // prevodjenje end

  return (
    <>
      <div>
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


        <div className="labela-stanica labela-stanica-naslov veliki-naslov red-1">Moje karte</div>
        <div>
          <div>
            <div className="labela-stanica labela-stanica-naslov red-1">Aktivne karte</div>
            <div className="stampajLiniju">   {/* Grupa   */}
              <div className="rowTabela rowTabela-dorada-1" >
              {sveKarte
                .filter((karte) => karte.cekiranje === false)
                .map((karte) => (
                  <div key={karte.id}>
                    
                    <li className="admin-jedan-red">    {/* lista-stavka">    */}
                      <div className="polje-stanica sirina-info-7 email-polje">
                      <Trans i18nKey="description.part184">  Broj rezervisanih mesta   </Trans>
                      </div>    {/* className="naslov"  */}
                      <div className="info-stanica sirina-info-2">{karte.brojMesta}</div>           {/* className="vrednost"  */}
                      <div className="polje-stanica sirina-info-5 email-polje">
                      <Trans i18nKey="description.part31"> Početna stanica </Trans>
                      </div>
                      <div className="info-stanica sirina-info-10 email-polje">{karte.pocetna}</div>
                      <div className="polje-stanica sirina-info-5 email-polje">
                      <Trans i18nKey="description.part32">  Dolazna stanica </Trans>
                      </div>
                      <div className="info-stanica sirina-info-10 email-polje">{karte.krajnja}</div>
                      <div className="polje-stanica sirina-info-6 email-polje">
                      <Trans i18nKey="description.part33"> Datum polaska  </Trans>
                      </div>
                      <div className="info-stanica sirina-info-7">{karte.datumP}</div>
                      <div className="polje-stanica sirina-info-6 email-polje">
                      <Trans i18nKey="description.part9"> Datum dolaska  </Trans>
                      </div>
                      <div className="info-stanica sirina-info-7">{karte.datumD}</div>
                      <div className="polje-stanica sirina-info-6 email-polje">
                      <Trans i18nKey="description.part11"> Vreme polaska  </Trans>
                      </div>
                      <div className="info-stanica">{karte.vremeP}</div>
                      <div className="polje-stanica sirina-info-5 email-polje">
                      <Trans i18nKey="description.part13"> Vreme dolaska  </Trans>
                      </div>
                      <div className="info-stanica">{karte.vremeD}</div>
                      <div className="polje-stanica sirina-info-5">
                      <Trans i18nKey="description.part185">  Čekiran  </Trans>
                      </div>
                      <div className="info-stanica sirina-info-3">
                        {karte.cekiranje === false ? 
                          <div>
                          <Trans i18nKey="description.part154"> Ne </Trans>
                          </div> : <div>
                          <Trans i18nKey="description.part153"> Da  </Trans>
                          </div>}
                      </div>
                    </li>
                    
                  </div>
                ))}
              </div>  
            </div>
          </div>
          <div>
            <div className="labela-stanica labela-stanica-naslov red-1">Neaktivne karte</div>
            <div className="Grupa">
              {sveKarte
                .filter((karte) => karte.cekiranje === true)
                .map((karte) => (
                  <div key={karte.id}>
                    <li className="lista-stavka">
                      <div className="naslov">
                        Broj rezervisanih mesta
                      </div>
                      <div className="vrednost">{karte.brojMesta}</div>
                      <div className="naslov">
                        Polazna stanica
                      </div>
                      <div className="vrednost">{karte.pocetna}</div>
                      <div className="naslov">
                        Dolazna stanica
                      </div>
                      <div className="vrednost">{karte.krajnja}</div>
                      <div className="naslov">
                        Datum polaska
                      </div>
                      <div className="vrednost">{karte.datumP}</div>
                      <div className="naslov">
                        Datum dolaska
                      </div>
                      <div className="vrednost">{karte.datumD}</div>
                      <div className="naslov">
                        Vreme polaska
                      </div>
                      <div className="vrednost">{karte.vremeP}</div>
                      <div className="naslov">
                        Vreme dolaska
                      </div>
                      <div className="vrednost">{karte.vremeD}</div>
                      <div className="naslov">
                        Čekiran
                      </div>
                      <div className="vrednost">
                        {karte.cekiranje === false ? <p>NE</p> : <>DA</>}
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
