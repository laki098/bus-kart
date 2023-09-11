import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import KorisnikApi from "../../api/korisnikApi";
import KorisnikLogic from "./korisnikLogic";

const KorisnikChange = () => {
  const [korisnik, setKorisnik] = useState({});
  const { idKorisnik } = useParams();

  useEffect(() => {
    getKorisnik();
  }, []);

  const korisnikLogic = KorisnikLogic();

  const back = () => {
    window.history.back();
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      idKorisnik: idKorisnik,
      korisnickoIme: formData.get("korisnickoIme"),
      ime: formData.get("ime"),
      prezime: formData.get("prezime"),
      brojTelefona: formData.get("brojTelefona"),
      email: formData.get("email"),
      role: formData.get("role"),
    };
    korisnikLogic.editKorisnik(data);
  };

  const getKorisnik = async () => {
    const response = await KorisnikApi().filterKorisnikId(idKorisnik);
    const data = await response.data;

    setKorisnik(data.korisnik);
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>KorisnickoIme:</label>
        <input
          defaultValue={korisnik.korisnickoIme}
          type="text"
          required
          name="korisnickoIme"
          onChange={korisnikLogic.changeHandler}
        ></input>
        <label>ime:</label>
        <input
          defaultValue={korisnik.ime}
          type="text"
          required
          name="ime"
          onChange={korisnikLogic.changeHandler}
        ></input>
        <label>Prezime:</label>
        <input
          defaultValue={korisnik.prezime}
          type="text"
          required
          name="prezime"
          onChange={korisnikLogic.changeHandler}
        ></input>
        <label>Broj Telefona:</label>
        <input
          defaultValue={korisnik.brojTelefona}
          type="text"
          required
          name="brojTelefona"
          onChange={korisnikLogic.changeHandler}
        ></input>
        <label>email:</label>
        <input
          defaultValue={korisnik.email}
          type="text"
          required
          name="email"
          onChange={korisnikLogic.changeHandler}
        ></input>
        <label>role:</label>
        <select
          defaultValue={korisnik.role}
          type="text"
          required
          name="role"
          onChange={korisnikLogic.changeHandler}
        >
          <option value="korisnik">korisnik</option>
          <option value="menadzer">menadzer</option>
          <option value="admin">admin</option>
          <option value="admin">stjuardesa</option>
        </select>
        <button onClick={back} type="submit">
          {" "}
          Sacuvaj
        </button>
      </div>
    </form>
  );
};
export default KorisnikChange;
