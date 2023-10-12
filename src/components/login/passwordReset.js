import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  return (
    <div>
      <label>Nova Sifra</label>
      <input onChange={(e) => setNovaSifra(e.target.value)}></input>
      <label>Potvrda nove sifre</label>
      <input onChange={(e) => setPotvrdaNoveSifre(e.target.value)}></input>
      <button onClick={getResetPassword}>Resetuj lozinku</button>
    </div>
  );
};

export default PasswordReset;
