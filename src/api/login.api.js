import axios from "axios";

const loginApi = () => {
  const getKorisnik = async () => {
    return await fetch("http://localhost:5000/korisnik");
  };

  const login = async (korisnickoIme, lozinka, ime) => {
    console.log({ korisnickoIme: korisnickoIme, lozinka: lozinka, ime });
    /* return await fetch("http://localhost:5000/korisnik/login", {"method":"POST", "body":{korisnickoIme:korisnickoIme, lozinka:lozinka}}); */
    return await axios.post("http://localhost:5000/korisnik/login", {
      korisnickoIme: korisnickoIme,
      lozinka: lozinka,
    });
  };

  return { getKorisnik, login };
};

export default loginApi;
