import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cookies from "js-cookie";

const Stjuardesa = () => {
  const [stjuardesaLinija, setStjuardesaLinija] = useState([]);

  //? izvlacenje korisnika iz cookisa
  let userData = cookies.get("userData");
  let userPars = {};

  //? pitamo ga da li je prijvljen, ako nije da ne odradi to parsiranje u json.
  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }
  console.log(userPars);

  const getStjuardesaLinija = async () => {
    const response = await fetch(
      `http://localhost:5000/stjuardesa/${userPars.idKorisnika}`
    );
    const data = await response.json();
    console.log(data.izvlacenjeLinija);
    setStjuardesaLinija(data.izvlacenjeLinija);
  };

  useEffect(() => {
    getStjuardesaLinija();
  }, []);

  return (
    <>
      <div className="labela-stanica labela-stanica-naslov red-1">Aktivne linije</div>
      <div className="stampajLiniju">
      <div class="rowTabela korisniciStjuardesa">
        <ul>
          {stjuardesaLinija.map((linija) => (
            <div key={linija.id}>
              <li class="column centar">Početna stanica</li>
              <li className="column podaci centar">{linija.pocetnaStanica.naziv}</li>
              <li class="column centar">Krajnja stanica</li>
              <li className="column podaci centar">{linija.krajnjaStanica.naziv}</li>
              <li class="column centar">Vreme polaska</li>
              <li className="column podaci centar">{linija.vremePolaska}</li>
              <li class="column centar">Datum polaska</li>
              <li className="column podaci centar">{linija.datumPolaska}</li>
              <li class="column centar">
              <Link
                to={{
                  pathname: `${linija.id}/stjuardesaLinija`,
                  state: {
                    linija: linija, // Prosleđujemo ceo objekat linije kao stanje
                  },
                }}
              >
                <button className="buttonSwitch"><p >Čekiranje </p></button>
              </Link>
              </li>
            </div>
          ))}
        </ul>
      </div>
      </div>
    </>
  );
};

export default Stjuardesa;
