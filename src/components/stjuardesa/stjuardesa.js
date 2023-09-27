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
      <div>
        <h1>Aktivne linije:</h1>
        <ul>
          {stjuardesaLinija.map((linija) => (
            <div key={linija.id}>
              <li>{linija.pocetnaStanica.naziv}</li>
              <li>{linija.krajnjaStanica.naziv}</li>
              <li>{linija.vremePolaska}</li>
              <li>{linija.datumPolaska}</li>
              <Link
                to={{
                  pathname: `${linija.id}/stjuardesaLinija`,
                  state: {
                    linija: linija, // Prosleđujemo ceo objekat linije kao stanje
                  },
                }}
              >
                <button>Cekiranje</button>
              </Link>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Stjuardesa;
