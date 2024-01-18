import loginApi from "../../api/login.api";
import { useState } from "react";
import { toast } from "react-toastify";

const LoginLogic = () => {
  /* const [korisnikB, setKorisnikB] = useState({}); */
  let [data, setData] = useState({});
  const login = () => {
    loginApi()
      .login(data.korisnickoIme, data.lozinka)
      .then((response) => {
        /* setKorisnikB(response.data.korisnickiPodaci); */
        notifySuccest(); // Prikazuje notifikaciju o uspešnom logovanju
        setTimeout(() => {
          window.location.href = "/pocetna"; // Preusmerava korisnika na pocetna nakon nekoliko sekundi
        }, 1500);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 404 || error.response && error.response.status === 401) {
          notifyWarn(error.response.data.message);
        }
      });
  };

  const notifySuccest = () => {
    toast.success("Uspešno ste se logovali!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyWarn = (message) => {
    toast.warn(message, {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
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
