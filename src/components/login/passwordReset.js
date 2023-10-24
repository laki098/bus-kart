import { useState } from "react";
import { useParams } from "react-router-dom";
import "./reset.css";

const PasswordReset = () => {
  const [novaSifra, setNovaSifra] = useState();
  const [potvrdaNoveSifre, setPotvrdaNoveSifre] = useState();

  const { token } = useParams();

  const getResetPassword = async () => {
    const response = await fetch(
      `http://localhost:5000/korisnik/reset-sifra/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          novaSifra: novaSifra,
          potvrdaSifre: potvrdaNoveSifre,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      if (response.status == 200) {
        console.log(data);
        alert("Uspesno promenjena sifra");
        window.location.href = "/login.component";
        // Ovde nastavite sa vašom logikom za proveru odgovora.
      }
    } else {
      if (response.status == 404 || response.status == 400) {
        alert(data.message);
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="container-reset">
      <form onSubmit={handleSubmit} className="form-reset">
        <label className="label-reset">Nova Sifra</label>
        <input  className="input-reset" onChange={(e) => setNovaSifra(e.target.value)}></input>
        <label className="label-reset">Potvrda nove sifre</label>
        <input className="input-reset" onChange={(e) => setPotvrdaNoveSifre(e.target.value)}></input>
        <button className="button-reset" onClick={getResetPassword}>Resetuj lozinku</button>
      </form>
    </div>
  );
};

export default PasswordReset;
