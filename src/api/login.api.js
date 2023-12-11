import axios from "axios";
import apiUrl from "../apiConfig";

const loginApi = () => {
  const getKorisnik = async () => {
    return await fetch(`${apiUrl}/korisnik`);
  };

  const login = async (korisnickoIme, lozinka) => {
    return await axios.post(
      `${apiUrl}/korisnik/login`,
      {
        korisnickoIme: korisnickoIme,
        lozinka: lozinka,
      },
      {
        withCredentials: true,
      }
    );
  };

  const logout = async () => {
    return await axios.post(
      `${apiUrl}/korisnik/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  };
  return { getKorisnik, login, logout };
};

export default loginApi;
