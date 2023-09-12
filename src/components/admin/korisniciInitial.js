import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";

const KorisniciInitial = () => {
  const [korisnici, setKorisnici] = useState([]);
  useEffect(() => {
    getKorisnici();
  }, []);

  const getKorisnici = async () => {
    const response = await fetch("http://localhost:5000/korisnik");
    const data = await response.json();
    setKorisnici(data.korisnici);
  };
  const brisanjeKorisnika = async (idKorisnik) => {
    const response = await KorisnikApi().brisanjeKorisnika(idKorisnik);
  };
  console.log(korisnici);
  return (
    <>
      <div>
        {korisnici.map((korisnik) => {
          return (
            <li key={korisnik.idKorisnik}>
              <div>
                korisnicko ime: {korisnik.korisnickoIme}, ime: {korisnik.ime},
                prezime: {korisnik.prezime}, brojTelefona :{" "}
                {korisnik.brojTelefona}, email: {korisnik.email}, role:{" "}
                {korisnik.role}
                <Link to={`${korisnik.idKorisnik}/korisnikChange`}>
                  <button>Izmeni</button>
                </Link>
                <button
                  onClick={() => {
                    brisanjeKorisnika(korisnik.idKorisnik);
                  }}
                >
                  Obrisi
                </button>
              </div>
            </li>
          );
        })}
      </div>
    </>
  );
};
export default KorisniciInitial;
