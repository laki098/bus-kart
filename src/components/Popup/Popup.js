/* https://medium.com/@byron.skoutaris/simple-popup-example-in-react-281a949bc3df  */

import React from "react";
import VrstaKarte2 from "../rezervacija/VrstaKarte2";
import "./Popup.css";
export const Popup = ({ text, closePopup }) => {
  return (
    <div className="popup-container">
     <div className="popup-body">
      {/* h1>{text}</h1>        */}
      <VrstaKarte2/>
      {/* <button onClick={closePopup}>Zatvori </button>    */}
     </div>
    </div>
  );
};