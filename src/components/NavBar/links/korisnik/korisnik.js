import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import KorisnikApi from "../../../../api/korisnikApi";
import KorisnikLogic from "../../../admin/korisnikLogic";
import "../korisnik/korisnik.css";

import cookies from "js-cookie";

const Korisnik = () => {

  const [korisnik, setKorisnik] = useState({});

   //? izvlacenje korisnika iz cookisa
   let userData = cookies.get("userData");
   let userPars = {};
   
   //? pitamo ga da li je prijvljen, ako nije da ne odradi to parsiranje u json.
   if (userData != undefined) {
     userPars = JSON.parse(userData);
   }

   

  useEffect(() => {
    getKorisnik();
  }, []);
  const korisnikLogic = KorisnikLogic();

  
  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      idKorisnik: userPars.idKorisnika,
      korisnickoIme: formData.get("korisnickoIme"),
      ime: formData.get("ime"),
      prezime: formData.get("prezime"),
      brojTelefona: formData.get("brojTelefona"),
      email: formData.get("email"),
      role: userPars.rola,
    };
    korisnikLogic.editKorisnik(data);
  };

  
  const getKorisnik = async () => {
    const response = await KorisnikApi().filterKorisnikId(userPars.idKorisnika);
    const data = await response.data;

    setKorisnik(data.korisnik);
  };


    return ( 
      <form onSubmit={submitHandler} className="form-user">
      
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
         <button  type="submit">
          Sacuvaj
        </button>
    </form>
     );
}
 
export default Korisnik;