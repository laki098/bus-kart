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

    // Razdvojite karte na neiskoriscene i iskoriscene
    const sveKarte = data.karte;
    const neiskorisceneKarte = [];
    const iskorisceneKarte = [];

    sveKarte.forEach((karta) => {
      if (karta.iskoriscena) {
        iskorisceneKarte.push(karta);
      } else {
        neiskorisceneKarte.push(karta);
      }
    });
    console.log(iskorisceneKarte);

    setSveKarte(sveKarte);
    setNeiskorisceneKarte(neiskorisceneKarte); // Postavite neiskoriscene karte
    setIskorisceneKarte(iskorisceneKarte); // Postavite iskoriscene karte
  };

  console.log(neiskorisceneKarte);
  console.log(iskorisceneKarte);

  useEffect(() => {
    getKarte();
  }, []);

  useEffect(() => {
    // Pratite promene u neiskorisceneKarte i ažurirajte iskorisceneKarte
    const updatedIskorisceneKarte = neiskorisceneKarte.filter(
      (karta) => karta.cekiran
    );
    setIskorisceneKarte(updatedIskorisceneKarte);
  }, [neiskorisceneKarte]);

  return (
    <>
      <div>
        <h2>Neiskoriscene karte:</h2>
        <ul>
          {neiskorisceneKarte.map((karte) => (
            <li className="lista-stavka" key={karte.brojMesta}>
              <p className="naslov">Broj rezervisanih mesta</p>
              <div className="vrednost">{karte.brojMesta}</div>
              <p className="naslov">Cekirana karta</p>
              <div className="vrednost">
                {karte.cekiran ? "Da" : karte.cekiran === false ? "Ne" : "N/A"}
              </div>
              <p className="naslov">Polazna stanica</p>
              <div className="vrednost">{karte.polaznaStanicaR}</div>
              <p className="naslov">Dolazna stanica</p>
              <div className="vrednost">{karte.krajnjaStanicaR}</div>
              <p className="naslov">Datum Polaska</p>
              <div className="vrednost">{karte.datumPolaska}</div>
              <p className="naslov">Datum dolaska</p>
              <div className="vrednost">{karte.datumDolaska}</div>
              <p className="naslov">Vreme Polaska</p>
              <div className="vrednost">{karte.vremePolaska}</div>
              <p className="naslov">Vreme dolaska</p>
              <div className="vrednost">{karte.vremeDolaska}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Iskoriscene karte:</h2>
        <ul>
          {iskorisceneKarte.map((karte) => (
            <li className="lista-stavka" key={karte.brojMesta}>
              <p className="naslov">Broj rezervisanih mesta</p>
              <div className="vrednost">{karte.brojMesta}</div>
              <p className="naslov">Cekirana karta</p>
              <div className="vrednost">
                {karte.cekiran ? "Da" : karte.cekiran === false ? "Ne" : "N/A"}
              </div>
              <p className="naslov">Polazna stanica</p>
              <div className="vrednost">{karte.polaznaStanicaR}</div>
              <p className="naslov">Dolazna stanica</p>
              <div className="vrednost">{karte.krajnjaStanicaR}</div>
              <p className="naslov">Datum Polaska</p>
              <div className="vrednost">{karte.datumPolaska}</div>
              <p className="naslov">Datum dolaska</p>
              <div className="vrednost">{karte.datumDolaska}</div>
              <p className="naslov">Vreme Polaska</p>
              <div className="vrednost">{karte.vremePolaska}</div>
              <p className="naslov">Vreme dolaska</p>
              <div className="vrednost">{karte.vremeDolaska}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Karta;
