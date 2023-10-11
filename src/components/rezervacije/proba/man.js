import "./seat.css";
import React, { useState, useEffect } from 'react';

import volan from './../../images/volan.png';
import ulaz from './../../images/ulaz.jpg';
import stepenice from './../../images/stepenice.jpg';




const MAN = ({ onReservation, linijaId })=> {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [rezervacija, setRezervacija] = useState([]);
 
  const getLinije = async () => {
   const response = await fetch(
     `http://localhost:5000/rezervacije/linija/${linijaId}`
   );
   const data = await response.json();
   setRezervacija(data.rezervacije)
   
 };
 
 
 useEffect(() => {
   getLinije();
 }, []);
 
 const handleSeatClick = (seatNumber) => {
  if (isSeatReserved(seatNumber)) {
    alert("Ovo sedište je već rezervisano. Molimo izaberite drugo sedište.");
    return;
  }

  // Proverite da li korisnik već ima selektovano sedište
  if (selectedSeats.length > 0) {
    alert("Već ste izabrali sedište. Možete rezervisati samo jedno sedište po putovanju.");
    return;
  }
   const updatedSelectedSeats = [...selectedSeats];
   if (selectedSeats.includes(seatNumber)) {
     updatedSelectedSeats.splice(updatedSelectedSeats.indexOf(seatNumber), 1);
   } else {
     updatedSelectedSeats.push(seatNumber);
   }
   setSelectedSeats(updatedSelectedSeats);
   // Pozivamo onReservation sa novim selektovanim sedištima
   onReservation(updatedSelectedSeats);
 };
 const isSeatSelected = (seatNumber) => {
   return selectedSeats.includes(seatNumber);
 };
 
 
 
 const isSeatReserved = (seatNumber) => {
   
   // Proverite da li rezervacija niz ima podatke
   return (
     rezervacija &&  
     rezervacija.length > 0 &&
     rezervacija.some((r) =>   r.oznakaSedista == seatNumber  )
   );
 };
  
  return (
    <div className="container-seat">
      <div className="row">
        <img src={volan} alt="volan" className="volan"/>

        </div>
        <div className="row">
        <div
          className={`seat ${isSeatSelected(1) || isSeatReserved(1) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(1)}
          style={{ pointerEvents: isSeatReserved(1) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(1) ? "" : "1"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(2) || isSeatReserved(2) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(2)}
          style={{ pointerEvents: isSeatReserved(2) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(2) ? "" : "2"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(3) || isSeatReserved(3)  ? "disabled" : ""}`}
          onClick={() => handleSeatClick(3)}
          style={{ pointerEvents: isSeatReserved(3) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(3) ? "" : "3"}</span>
        </div>
        <div
          className={`seat ${ isSeatSelected(4) || isSeatReserved(4)  ? "disabled" : ""}`}
          onClick={() => handleSeatClick(4)}
          style={{ pointerEvents: isSeatReserved(4) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(4) ? "" : "4"}</span>
        </div>
      </div>
      <div className="row">
        <div
          className={`seat ${isSeatSelected(5) || isSeatReserved(5) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(5)}
          style={{ pointerEvents: isSeatReserved(5) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(5) ? "" : "5"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(6) || isSeatReserved(6) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(6)}
          style={{ pointerEvents: isSeatReserved(6) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(6) ? "" : "6"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(7) || isSeatReserved(7) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(7)}
          style={{ pointerEvents: isSeatReserved(7) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(7) ? "" : "7"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(8) || isSeatReserved(8) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(8)}
          style={{ pointerEvents: isSeatReserved(8) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(8) ? "" : "8"}</span>
        </div>
      </div>

      <div className="row">
        <div
          className={`seat ${isSeatSelected(9) || isSeatReserved(9) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(9)}
          style={{ pointerEvents: isSeatReserved(9) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(9) ? "" : "9"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(10) || isSeatReserved(10) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(10)}
          style={{ pointerEvents: isSeatReserved(10) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(10) ? "" : "10"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(11) || isSeatReserved(11) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(11)}
          style={{ pointerEvents: isSeatReserved(11) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(11) ? "" : "11"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(12) || isSeatReserved(12) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(12)}
          style={{ pointerEvents: isSeatReserved(12) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(12) ? "" : "12"}</span>
        </div>
      </div>

      <div className="row">
        <div
          className={`seat ${isSeatSelected(13) || isSeatReserved(13) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(13)}
          style={{ pointerEvents: isSeatReserved(13) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(13) ? "" : "13"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(14) || isSeatReserved(14) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(14)}
          style={{ pointerEvents: isSeatReserved(14) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(14) ? "" : "14"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(15) || isSeatReserved(15) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(15)}
          style={{ pointerEvents: isSeatReserved(15) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(15) ? "" : "15"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(16) || isSeatReserved(16) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(16)}
          style={{ pointerEvents: isSeatReserved(16) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(16) ? "" : "16"}</span>
        </div>
      </div>

      <div className="row">
        <div
         className={`seat ${isSeatSelected(17) || isSeatReserved(17) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(17)}
          style={{ pointerEvents: isSeatReserved(17) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(17) ? "" : "17"}</span>
        </div>
        <div
         className={`seat ${isSeatSelected(18) || isSeatReserved(18) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(18)}
          style={{ pointerEvents: isSeatReserved(18) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(18) ? "" : "18"}</span>
        </div>
        <div
         className={`seat ${isSeatSelected(19) || isSeatReserved(19) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(19)}
          style={{ pointerEvents: isSeatReserved(19) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(19) ? "" : "19"}</span>
        </div>
        <div
        className={`seat ${isSeatSelected(20) || isSeatReserved(20) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(20)}
          style={{ pointerEvents: isSeatReserved(20) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(20) ? "" : "20"}</span>
        </div>
      </div>

      <div className="row">
      <div
          className={`seat1 ${isSeatSelected(21) || isSeatReserved(21) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(21)}
          style={{ pointerEvents: isSeatReserved(21) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(21) ? "" : "21"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(22) || isSeatReserved(22) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(22)}
          style={{ pointerEvents: isSeatReserved(22) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(22) ? "" : "22"}</span>
        </div>
        <div
         className={`seat ${isSeatSelected(23) || isSeatReserved(23) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(23)}
          style={{ pointerEvents: isSeatReserved(23) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(23) ? "" : "23"}</span>
        </div>
        <div
          className={`seat  ${isSeatSelected(24) || isSeatReserved(24) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(24)}
          style={{ pointerEvents: isSeatReserved(24) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(24) ? "" : "24"}</span>
        </div>
      </div>
      <div className="row">
      <div
         className={`seat1 ${isSeatSelected(25) || isSeatReserved(25) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(25)}
          style={{ pointerEvents: isSeatReserved(25) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(25) ? "" : "25"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(26) || isSeatReserved(26) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(26)}
          style={{ pointerEvents: isSeatReserved(26) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(26) ? "" : "26"}</span>
        </div>
      </div>
      <div className="row">
      <div
         className={`seat ${isSeatSelected(27) || isSeatReserved(27) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(27)}
          style={{ pointerEvents: isSeatReserved(27) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(27) ? "" : "27"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(28) || isSeatReserved(28) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(28)}
          style={{ pointerEvents: isSeatReserved(28) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(28) ? "" : "28"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(29) || isSeatReserved(29) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(29)}
          style={{ pointerEvents: isSeatReserved(29) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(29) ? "" : "29"}</span>
        </div>
        <div
         className={`seat ${isSeatSelected(30) || isSeatReserved(30) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(30)}
          style={{ pointerEvents: isSeatReserved(30) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(30) ? "" : "30"}</span>
        </div>
      </div>
      <div className="row">
      <div
          className={`seat ${isSeatSelected(31) || isSeatReserved(31) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(31)}
          style={{ pointerEvents: isSeatReserved(31) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(31) ? "" : "31"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(32) || isSeatReserved(32) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(32)}
          style={{ pointerEvents: isSeatReserved(32) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(32) ? "" : "32"}</span>
        </div>
        <div
         className={`seat ${isSeatSelected(33) || isSeatReserved(33) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(33)}
          style={{ pointerEvents: isSeatReserved(33) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(33) ? "" : "33"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(34) || isSeatReserved(34) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(34)}
          style={{ pointerEvents: isSeatReserved(34) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(34) ? "" : "34"}</span>
        </div>
      </div>
      <div className="row">
      <div
          className={`seat ${isSeatSelected(35) || isSeatReserved(35) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(35)}
          style={{ pointerEvents: isSeatReserved(35) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(35) ? "" : "35"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(36) || isSeatReserved(36) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(36)}
          style={{ pointerEvents: isSeatReserved(36) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(36) ? "" : "36"}</span>
        </div>
        <div
         className={`seat ${isSeatSelected(37) || isSeatReserved(37) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(37)}
          style={{ pointerEvents: isSeatReserved(37) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(37) ? "" : "37"}</span>
        </div>
        <div
           className={`seat ${isSeatSelected(38) || isSeatReserved(38) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(38)}
          style={{ pointerEvents: isSeatReserved(38) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(38) ? "" : "38"}</span>
        </div>
      </div>
      <div className="row">
      <div
          className={`seat ${isSeatSelected(39) || isSeatReserved(39) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(39)}
          style={{ pointerEvents: isSeatReserved(39) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(39) ? "" : "39"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(40) || isSeatReserved(40) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(40)}
          style={{ pointerEvents: isSeatReserved(40) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(40) ? "" : "40"}</span>
        </div>
        <div
           className={`seat ${isSeatSelected(41) || isSeatReserved(41) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(41)}
          style={{ pointerEvents: isSeatReserved(41) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(41) ? "" : "41"}</span>
        </div>
        <div
           className={`seat ${isSeatSelected(42) || isSeatReserved(42) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(42)}
          style={{ pointerEvents: isSeatReserved(42) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(42) ? "" : "42"}</span>
        </div>
      </div>
      <div className="row">
      <div
           className={`seat ${isSeatSelected(43) || isSeatReserved(43) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(43)}
          style={{ pointerEvents: isSeatReserved(43) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(43) ? "" : "43"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(44) || isSeatReserved(44) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(44)}
          style={{ pointerEvents: isSeatReserved(44) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(44) ? "" : "44"}</span>
        </div>
        <div
         className={`seat ${isSeatSelected(45) || isSeatReserved(45) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(45)}
          style={{ pointerEvents: isSeatReserved(45) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(45) ? "" : "45"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(46) || isSeatReserved(46) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(46)}
          style={{ pointerEvents: isSeatReserved(46) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(46) ? "" : "46"}</span>
        </div>
      </div>
      <div className="row">
      <div
          className={`seat ${isSeatSelected(47) || isSeatReserved(47) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(47)}
          style={{ pointerEvents: isSeatReserved(47) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(47) ? "" : "47"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(48) || isSeatReserved(48) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(48)}
          style={{ pointerEvents: isSeatReserved(48) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(48) ? "" : "48"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(49) || isSeatReserved(49) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(49)}
          style={{ pointerEvents: isSeatReserved(49) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(49) ? "" : "49"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(50) || isSeatReserved(50) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(50)}
          style={{ pointerEvents: isSeatReserved(50) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(50) ? "" : "50"}</span>
        </div>
      </div>
      <div className="row">
      <div
          className={`seat1 ${isSeatSelected(51) || isSeatReserved(51) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(51)}
          style={{ pointerEvents: isSeatReserved(51) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(51) ? "" : "51"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(52) || isSeatReserved(52) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(52)}
          style={{ pointerEvents: isSeatReserved(52) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(52) ? "" : "52"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(53) || isSeatReserved(53) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(53)}
          style={{ pointerEvents: isSeatReserved(53) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(53) ? "" : "53"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(54) || isSeatReserved(54) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(54)}
          style={{ pointerEvents: isSeatReserved(54) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(54) ? "" : "54"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(55) || isSeatReserved(55) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(55)}
          style={{ pointerEvents: isSeatReserved(55) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(55) ? "" : "55"}</span>
        </div>
      </div>
      {selectedSeats.length > 0 && (
        <div>
          <p>Korisnik je izabrao sedište broj: {selectedSeats.join(", ")}</p>
        </div>
      )}
      <img src={ulaz} alt="ulaz-bus2 " className="ulaz-bus2 "/>
      <img src={ulaz} alt="ulaz-bus22" className="ulaz-bus22"/>
      <img src={stepenice} alt="stepenice-bus2" className="stepenice-bus2"/>
    </div>
  );
}
 
export default MAN;
