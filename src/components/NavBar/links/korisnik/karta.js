import { useEffect, useState } from "react";
import cookies from "js-cookie";
import "./still.css";

const Karta = () => {
  const [sveKarte, setSveKarte] = useState([]);
  //? izvlacenje korisnika koji je prijavljen
  let userData = cookies.get("userData");
  let userPars = {};
  if (userData != undefined) {
    userPars = JSON.parse(userData);
  } 

  const userId = { korisnikId: userPars.idKorisnika };
  const userIdP = JSON.stringify(userId);

  const getKarte = async (userId) => {
    const response = await fetch("http://localhost:5000/korisnik/karta", {
      method: "POST", // Postavite HTTP metod na POST
      headers: {
        "Content-Type": "application/json", // Postavite Content-Type na JSON
      },
      body: userIdP, // Postavite telo zahteva na JSON podatke
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
      };
    });

    setSveKarte(a1);
  };

  console.log(sveKarte);
  useEffect(() => {
    getKarte();
  }, []);
  return (
    <>
      <div>Moje karte</div>
      <div>
        {sveKarte.map((karte) => {
          return (
            <li className="lista-stavka">
              <p className="naslov">Broj rezervisanih mesta</p>
              <div className="vrednost">{karte.brojMesta}</div>
              <p className="naslov">Polazna stanica</p>
              <div className="vrednost">{karte.pocetna}</div>
              <p className="naslov">Dolazna stanica</p>
              <div className="vrednost">{karte.krajnja}</div>
              <p className="naslov">Datum Polaska</p>
              <div className="vrednost">{karte.datumP}</div>
              <p className="naslov">Datum dolaska</p>
              <div className="vrednost">{karte.datumD}</div>
              <p className="naslov">Vreme Polaska</p>
              <div className="vrednost">{karte.vremeP}</div>
              <p className="naslov">Vreme dolaska</p>
              <div className="vrednost">{karte.vremeD}</div>
            </li>
          );
        })}
      </div>
    </>
  );
};

export default Karta;
