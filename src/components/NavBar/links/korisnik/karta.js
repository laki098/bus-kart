import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import "./still.css";

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

  return (
    <>
      <div>
        <div className="labela-stanica labela-stanica-naslov veliki-naslov red-1">Moje karte</div>
        <div>
          <div>
            <div className="labela-stanica labela-stanica-naslov red-1">Aktivne karte</div>
            <div className="stampajLiniju">   {/* Grupa   */}
              <div className="rowTabela rowTabela-dorada" >
              {sveKarte
                .filter((karte) => karte.cekiranje === false)
                .map((karte) => (
                  <div key={karte.id}>
                    
                    <li className="admin-jedan-red">    {/* lista-stavka">    */}
                      <div className="polje-stanica sirina-info-7 email-polje">Broj rezervisanih mesta</div>    {/* className="naslov"  */}
                      <div className="info-stanica sirina-info-3">{karte.brojMesta}</div>           {/* className="vrednost"  */}
                      <div className="polje-stanica sirina-info-5 email-polje">Polazna stanica</div>
                      <div className="info-stanica sirina-info-10">{karte.pocetna}</div>
                      <div className="polje-stanica sirina-info-5 email-polje">Dolazna stanica</div>
                      <div className="info-stanica sirina-info-10">{karte.krajnja}</div>
                      <div className="polje-stanica sirina-info-5 email-polje">Datum polaska</div>
                      <div className="info-stanica sirina-info-7">{karte.datumP}</div>
                      <div className="polje-stanica sirina-info-5 email-polje">Datum dolaska</div>
                      <div className="info-stanica sirina-info-7">{karte.datumD}</div>
                      <div className="polje-stanica sirina-info-5 email-polje">Vreme polaska</div>
                      <div className="info-stanica">{karte.vremeP}</div>
                      <div className="polje-stanica sirina-info-5 email-polje">Vreme dolaska</div>
                      <div className="info-stanica">{karte.vremeD}</div>
                      <div className="polje-stanica">Čekiran</div>
                      <div className="info-stanica sirina-info-3">
                        {karte.cekiranje === false ? <p>NE</p> : <>da</>}
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
                      <p className="naslov">Broj rezervisanih mesta</p>
                      <div className="vrednost">{karte.brojMesta}</div>
                      <p className="naslov">Polazna stanica</p>
                      <div className="vrednost">{karte.pocetna}</div>
                      <p className="naslov">Dolazna stanica</p>
                      <div className="vrednost">{karte.krajnja}</div>
                      <p className="naslov">Datum polaska</p>
                      <div className="vrednost">{karte.datumP}</div>
                      <p className="naslov">Datum dolaska</p>
                      <div className="vrednost">{karte.datumD}</div>
                      <p className="naslov">Vreme polaska</p>
                      <div className="vrednost">{karte.vremeP}</div>
                      <p className="naslov">Vreme dolaska</p>
                      <div className="vrednost">{karte.vremeD}</div>
                      <p className="naslov">Čekiran</p>
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
