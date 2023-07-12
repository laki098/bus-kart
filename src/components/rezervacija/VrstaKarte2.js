import React, { useState } from "react";
//import ReactDOM from "react-dom";
import "../rezervacije/index1.css";
import classes from "../rezervacije/RezervacijaKarte.module.css";

const VrstaKarte2 = () => {
  // State with list of all checked item
  const [checked, setChecked] = useState([]);
  const checkList = [
    "Jednosmerna",
    "Povratna",
    "Besplatna",
    "Studentska",
    "Nedeljna",
    "Vikend",
  ];

  const [pom, setPom] = useState();

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

  // Return classes based on whether item is checked
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const handleOnChange = (event) => {
    // alert('prenesi parametreee');
    // console.log('prenesi parametreeeeee');

    <div>
      console.log('prenesi parametreeeeee'); alert('prenesi parametreee');
      {checkedItems}
    </div>;
  };

  return (
    <div className={classes.form}>
      {" "}
      {/* className={classes.form} */}
      <div className="app">
        <div className="tableNova11" style={{ textAlign: "left" }}>
          {" "}
          {/* className="tableNova" */}
          <h2>Vrsta karte:</h2>
          <div className="list-container">
            {checkList.map((item, index) => (
              <div key={index}>
                <input value={item} type="checkbox" onChange={handleCheck} />
                <span className={isChecked(item)}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "left" }}>
          <button className={classes.submit} onClick={handleOnChange}>
            Potvrđujem
          </button>{" "}
          &emsp;&emsp;
          <button className={classes.submit}> Odustajem</button>
        </div>
        <div>
          <br />
          {`Odabrali ste: ${checkedItems}`}

          {/*  {setPom}={checkedItems};   */}
        </div>
      </div>
    </div>
  );
};

export default VrstaKarte2;
