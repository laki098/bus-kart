import React from "react";
import { useState } from "react";

import "../index1.css";
import classes from "../RezervacijaKarte.module.css";

const Poppup = props => {
  


   

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }

  
  



  return (
    <div className={classes.form}>
      <div className="app">
        <div className="tableNova11" >
          <h2>Vrsta karte:</h2>
          <div>
      <label>
        <input
          type="radio"
          value="Jednosmerna"
          checked={selectedValue === 'Jednosmerna'}
          onChange={handleChange}
        />
        Jednosmerna
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="Povratna"
          checked={selectedValue === 'Povratna'}
          onChange={handleChange}
        />
        Povratna
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="Besplatna"
          checked={selectedValue === 'Besplatna'}
          onChange={handleChange}
        />
        Besplatna
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="Studentska"
          checked={selectedValue === 'Studentska'}
          onChange={handleChange}
        />
        Studentska
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="Vikend"
          checked={selectedValue === 'Vikend'}
          onChange={handleChange}
        />
        Vikend
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="Nedeljna"
          checked={selectedValue === 'Nedeljna'}
          onChange={handleChange}
        />
        Nedeljna
      </label>
      <p>Izabrali ste kartu: {selectedValue}</p>
    </div>
        </div>
        <button className={classes.submit} >Potvrdi kartu</button>
        {" "}
          &emsp;&emsp;
        <button className={classes.submit} onClick={props.handleClose}>Zatvori</button>
        {props.content}
      
    </div>
    </div>
  );
};

export default Poppup;


/* 
<input
type="button"
value="Vrsta karte"
onClick={togglePopup}
className={classes.submit}
/>

{isOpen && (
<Poppup content={
<div>
  data from popup:{data}
</div>} 
pickCard={handleData}
handleClose={togglePopup} />
)} */ /* za otvaranje popup */


/* const [isOpen, setIsOpen] = useState(false);

const togglePopup = () => {
  setIsOpen(!isOpen);
} */ /* na drugoj stranici kada se poziva pop */