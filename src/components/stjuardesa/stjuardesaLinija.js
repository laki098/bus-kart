import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import { useLocation } from "react-router-dom";
import Autobus from "../rezervacije/sedista/autobus";
import AdminLogic from "../admin/admin.logic";

import { useTranslation, Trans } from "react-i18next"; //prevodjenje
import "../NavBar/links/i18n";
import "../../components/NavBar/links/i18n";

const StjuardesaLinija = ({}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [autobus, setAutobus] = useState([]);
  const [linija, setLinija] = useState([]);

  //? dobavljanje liniju koja se koristi direktno ovde
  const dobavljanjeLinije = async () => {
    const response = await fetch(
      `http://localhost:5000/stjuardesa/filterLinija/${linijaId}`
    );
    const data = await response.json();
    setLinija(data.izvlacenjeLinija);
    console.log("-------------------------------------------11-1-1-1");
  };

  //?primanje podataka sa stjuardese za baš odredjenu liniju
  const location = useLocation();
  const state = location.state;

  const linijaId = location.state.linija.id;

  //? dobavljanje autobusa koji je postavljen na toj liniji. kako bi prikayali sedista stjuardesi
  const dobavljanjeBrojaMesta = async () => {
    const response = await fetch(
      `http://localhost:5000/autobusi/oznaka/${state.linija.oznakaBusa}`
    );
    const data = await response.json();
    setAutobus(data.autobusi);
  };

  console.log(linija?.Stanicas);
  useEffect(() => {
    dobavljanjeLinije();
    dobavljanjeBrojaMesta();
  }, []);

  //?kada kliknemo dugme da otvori skenerQrCode
  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  //?kada skeniramo qrCode da se kamera sama zatvori
  const handleQRScanSuccess = (message) => {
    console.log("Uspešno skeniranje:", message);
    setShowQRScanner(false);
  };

  const adminLogic = AdminLogic();

  const medjustanice = [];

  //? Funkcija za ažuriranje linije kraj linije (datum i vreme azurira)
  const handleDatumAkcije = (akcija) => {
    const trenutniDatum = new Date();
    const formattedDatum = trenutniDatum.toISOString();
    const dataToUpdate = {
      pocetnaStanica: state.linija.pocetnaStanica.naziv,
      medjustanice: medjustanice,
      krajnjaStanica: state.linija.krajnjaStanica.naziv,
      vremePolaska: state.linija.vremePolaska,
      vremeDolaska: state.linija.vremeDolaska,
      datumPolaska: state.linija.datumPolaska,
      datumDolaska: state.linija.datumDolaska,
      oznakaBusa: state.linija.oznakaBusa,
      [`${akcija}Rute`]: formattedDatum, //? prosledjujem preko dugmeta akciju
      vozac: state.linija.vozac,
      stjuardesa: state.linija.stjuardesa,
    };

    adminLogic.editLinije(dataToUpdate, state.linija.id);
  };

  // Funkcija za ažuriranje vremena polaska medjustanice
  const updateMedjustanicaVremePolaska = async (medjustanicaId) => {
    const trenutniDatum = new Date();
    const trenutnoVreme = trenutniDatum.toISOString();

    // Pripremite podatke za ažuriranje u bazi podataka

    const dataToUpdate = {
      pocetnaStanica: state.linija.pocetnaStanica.naziv,
      medjustanice: state.linija.Stanicas.map((stanica) => {
        if (stanica.id === medjustanicaId) {
          return {
            ...stanica.Medjustanica,
            pocetakRute: trenutnoVreme,
          };
        }
        return stanica.Medjustanica;
      }),
      krajnjaStanica: state.linija.krajnjaStanica.naziv,
      vremePolaska: state.linija.vremePolaska,
      vremeDolaska: state.linija.vremeDolaska,
      datumPolaska: state.linija.datumPolaska,
      datumDolaska: state.linija.datumDolaska,
      oznakaBusa: state.linija.oznakaBusa,
      pocetakRute: state.linija.pocetakRute,
      krajRute: state.linija.krajRute,
      vozac: state.linija.vozac,
      stjuardesa: state.linija.stjuardesa,
    };

    // Pozovite funkciju za ažuriranje linije
    adminLogic.editLinije(dataToUpdate, state.linija.id);

    // Nakon ažuriranja u bazi podataka, dohvatite ažurirane podatke ponovo
    const updatedData = await fetch(
      `http://localhost:5000/autobusi/oznaka/${state.linija.oznakaBusa}`
    );
    const updatedAutobusData = await updatedData.json();
    setAutobus(updatedAutobusData.autobusi);
  };

  return (
    <>
      <div>
        <h2>Informacije o Ruti</h2>
        <div>
          <p>Polazna Tačka: {linija?.pocetnaStanica?.naziv}</p>
          <button onClick={() => handleDatumAkcije("pocetak")}>Krenuli</button>
        </div>

        <div className="labela-stanica labela-stanica-naslov red-1">
          Informacije o ruti
        </div>
        <div className="stampajLiniju">
          <div className="rowTabela sirina-39">
            <div className="admin-jedan-red ">
              <div className="polje-stanica sirina-info-10">Polazna tačka</div>
              <div className="info-stanica sirina-info-10">
                {" "}
                {state.linija.pocetnaStanica.naziv}
              </div>
              <div className="polje-stanica sirina-info-8">
                <button
                  onClick={() => handleDatumAkcije("pocetak")}
                  className="buttonSwitch"
                >
                  Krenuli
                </button>
              </div>
            </div>
            <div className="admin-jedan-red ">
              <div className="polje-stanica sirina-info-10">Krajnja tačka</div>
              <div className="info-stanica sirina-info-10">
                {" "}
                {state.linija.krajnjaStanica.naziv}
              </div>
              <div className="polje-stanica sirina-info-8">
                <button
                  onClick={() => handleDatumAkcije("kraj")}
                  className="buttonSwitch"
                >
                  Stigli
                </button>
              </div>
            </div>
            {/*
        <div>
          <p>Krajnja Tačka: {linija?.krajnjaStanica?.naziv}</p>
          <button onClick={() => handleDatumAkcije("kraj")}>Stigli</button>
        </div>
        */}
            <div className="admin-jedan-red ">
              <div className="polje-stanica sirina-info-10">Međustanice</div>
              <ul>
                {linija?.Stanicas?.map((stanica) => (
                  <div key={stanica.id}>
                    <div className="stampajLiniju">
                      <li className="info-stanica sirina-info-10">
                        {stanica.naziv}
                      </li>
                      <div className="polje-stanica sirina-info-8">
                        <button
                          onClick={() => {
                            updateMedjustanicaVremePolaska(stanica.id);
                            dobavljanjeLinije();
                            console.log("-------------------");
                          }}
                          className="buttonSwitch"
                        >
                          Krenuli
                        </button>
                      </div>
                      <div className="polje-stanica sirina-info-8">
                        <button className="buttonSwitch">
                          &nbsp; Stigli &nbsp;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Autobus autobusData={autobus} />
      <div className="red-1"></div>
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          idLinije={state.linija.id}
        />
      )}

      {!showQRScanner && (
        <button onClick={handleQRScan} className="buttonSwitch">
          <p className="admin-dugme-slova">Skeniraj QR kod </p>
        </button>
      )}
    </>
  );
};

export default StjuardesaLinija;
