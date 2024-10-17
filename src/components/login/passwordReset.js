import { useState } from "react";
import { useParams } from "react-router-dom";
import "./reset.css";
import apiUrl from "../../apiConfig";
import { toast, ToastContainer } from "react-toastify";
import ToastNotification from "../../toastNotification/ToastNotification";

const PasswordReset = () => {
  const [novaSifra, setNovaSifra] = useState("");
  const [potvrdaNoveSifre, setPotvrdaNoveSifre] = useState("");
  const { notifySuccess, notifyWarn } = ToastNotification();
  const { token } = useParams();

  const getResetPassword = async () => {
    const response = await fetch(`${apiUrl}/korisnik/reset-sifra/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        novaSifra: novaSifra,
        potvrdaSifre: potvrdaNoveSifre,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      console.log(response.status);
      if (response.status == 200) {
        console.log(data);
        notifySuccess(data.message);
        setTimeout(() => {
          window.location.href = "/login.component";
        }, 2500);
      }
    } else {
      if (response.status == 404 || response.status == 400) {
        notifyWarn(data.message);
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [showNovaSifra, setShowNovaSifra] = useState(false);
  const [showPotvrdaNoveSifre, setShowPotvrdaNoveSifre] = useState(false);

  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleToggleClickNovaSifra = () => {
    setShowNovaSifra(!showNovaSifra);
    setShowPotvrdaNoveSifre(false); // Postavljanje za drugu sifru na false
  };

  const handleToggleClickPotvrdaNoveSifre = () => {
    setShowPotvrdaNoveSifre(!showPotvrdaNoveSifre);
    setShowNovaSifra(false); // Postavljanje za prvu sifru na false
  };

  return (
    <div className="container-reset">
      <form onSubmit={handleSubmit} className="form-reset">
        <label className="label-reset">Nova Sifra</label>
        <div className="passwordContainer">
          <input
            className="input-reset"
            type={showNovaSifra ? "text" : "password"}
            onChange={(e) => setNovaSifra(e.target.value)}
          />
          <span
            className="passwordToggleReset"
            onClick={handleToggleClickNovaSifra}
          >
            {showNovaSifra ? (
              <i className="fa-regular fa-eye"></i>
            ) : (
              <i className="fa-regular fa-eye-slash"></i>
            )}
          </span>
        </div>
        <label className="label-reset">Potvrda nove sifre</label>
        <div className="passwordContainer">
          <input
            className="input-reset"
            type={showPotvrdaNoveSifre ? "text" : "password"}
            onChange={(e) => setPotvrdaNoveSifre(e.target.value)}
          />
          <span
            className="passwordToggleReset"
            onClick={handleToggleClickPotvrdaNoveSifre}
          >
            {showPotvrdaNoveSifre ? (
              <i className="fa-regular fa-eye"></i>
            ) : (
              <i className="fa-regular fa-eye-slash"></i>
            )}
          </span>
        </div>
        <button className="button-reset" onClick={getResetPassword}>
          Resetuj lozinku
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PasswordReset;
