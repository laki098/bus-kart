import React, { useState, useEffect } from "react";
import "../korisnik/korisnik.css";

const Korisnik = () => {

    

    return ( 
      <form className="form-user">
      
        <label>Ime:</label>
        <input
          type="text"
          name="ime"
      />
        <label>Prezime:</label>
        <input
          type="text"
          name="prezime"
        />
        <label>Koriscko ime:</label>
        <input
          type="text"
          name="korisnickoIme"
       />
      
        <label>Lozinka:</label>
        <input
          type="password"
          name="lozinka"
        />
        <label>Broj telefona:</label>
        <input
          type="text"
          name="brojTelefona"
         />
      
        <label>Email:</label>
        <input
          type="email"
          name="email"
         />
         <button>Izmeni</button>
    </form>
     );
}
 
export default Korisnik;