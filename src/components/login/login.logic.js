import loginApi from "../../api/login.api";
import { useState } from "react";

const LoginLogic = () => {
  /* const [korisnikB, setKorisnikB] = useState({}); */
  let [data, setData] = useState({});
  const login = () => {
    loginApi()
      .login(data.korisnickoIme, data.lozinka)
      .then((response) => {
        /* setKorisnikB(response.data.korisnickiPodaci); */
        alert("Konacccno");
        window.location.href = "pocetna";
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeHandler = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  return { setData, login, changeHandler };
};

export default LoginLogic;
