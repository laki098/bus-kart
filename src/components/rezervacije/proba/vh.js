import "./seat.css";
import React, { useState, useEffect } from "react";

import volan from "./../../images/volan.png";
import ulaz from "./../../images/ulaz.jpg";
import stepenice from "./../../images/stepenice.jpg";
import sto from "./../../images/sto.jpg";
import wc from "./../../images/wc.jpg";

const VH =  ({ onReservation, linijaId,pocetnaStanicaId,
  krajnjaStanicaId, })=> {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [trenutniSprat, setTrenutniSprat] = useState("gornji");
  const [rezervacija, setRezervacija] = useState([]);


  const getLinije = async () => {
    const response = await fetch(
      `http://localhost:5000/rezervacije/linija/${linijaId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pocetnaStanicaId, krajnjaStanicaId }),
      }
    );
    const data = await response.json();
    setRezervacija(data.rezervacije);
  };
  
  console.log(rezervacija)
  useEffect(() => {
    getLinije();
  }, []);
  
  const handleSeatClick = (seatNumber) => {
     
  
   // Proverite da li korisnik već ima selektovano sedište
   if (selectedSeats.length > 0) {
    if(selectedSeats != seatNumber) {
      alert("Već ste izabrali sedište. Možete rezervisati samo jedno sedište po putovanju.");
    return;
    }
    
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
  
  const handlePromeniSprat = (sprat) => {
    setTrenutniSprat(sprat);
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
    <>
      <div className="dugma-spratovi">
        <button
          className={trenutniSprat === "gornji" ? "aktivan" : ""}
          onClick={() => handlePromeniSprat("gornji")}
        >
          Gornji sprat
        </button>
        <button
          className={trenutniSprat === "donji" ? "aktivan" : ""}
          onClick={() => handlePromeniSprat("donji")}
        >
          Donji sprat
        </button>
      </div>
      {trenutniSprat === "gornji" && (
        <div className="container-seat">
          <div className="row">
          <div
          className={`seat ${ isSeatSelected(4) || isSeatReserved(4)  ? "disabled" : ""}`}
          onClick={() => handleSeatClick(4)}
          style={{ pointerEvents: isSeatReserved(4) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(4) ? "" : "4"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(3) || isSeatReserved(3)  ? "disabled" : ""}`}
          onClick={() => handleSeatClick(3)}
          style={{ pointerEvents: isSeatReserved(3) ? "none" : "auto" }}
        >
          <span className="seat-number2">{isSeatSelected(3) ? "" : "3"}</span>
        </div>
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
          className={`seat1 ${isSeatSelected(6) || isSeatReserved(6) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(6)}
          style={{ pointerEvents: isSeatReserved(6) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(6) ? "" : "6"}</span>
        </div>
            <div></div>
          </div>

          <div className="row">
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
          </div>

          <div className="row">
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
          </div>

          <div className="row">
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
          </div>

          <div className="row">
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
        <div
          className={`seat ${isSeatSelected(21) || isSeatReserved(21) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(21)}
          style={{ pointerEvents: isSeatReserved(21) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(21) ? "" : "21"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(22) || isSeatReserved(22) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(22)}
          style={{ pointerEvents: isSeatReserved(22) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(22) ? "" : "22"}</span>
        </div>
          </div>
          <div className="row">
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
        <div
         className={`seat ${isSeatSelected(25) || isSeatReserved(25) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(25)}
          style={{ pointerEvents: isSeatReserved(25) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(25) ? "" : "25"}</span>
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
          className={`seat1 ${isSeatSelected(39) || isSeatReserved(39) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(39)}
          style={{ pointerEvents: isSeatReserved(39) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(39) ? "" : "39"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(40) || isSeatReserved(40) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(40)}
          style={{ pointerEvents: isSeatReserved(40) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(40) ? "" : "40"}</span>
        </div>
          </div>
          <div className="row">
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
          </div>
          <div className="row">
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
          </div>
          <div className="row">
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
        <div
          className={`seat ${isSeatSelected(51) || isSeatReserved(51) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(51)}
          style={{ pointerEvents: isSeatReserved(51) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(51) ? "" : "51"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(52) || isSeatReserved(52) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(52)}
          style={{ pointerEvents: isSeatReserved(52) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(52) ? "" : "52"}</span>
        </div>
          </div>
          <div className="row">
          <div
          className={`seat ${isSeatSelected(53) || isSeatReserved(53) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(53)}
          style={{ pointerEvents: isSeatReserved(53) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(53) ? "" : "53"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(54) || isSeatReserved(54) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(54)}
          style={{ pointerEvents: isSeatReserved(54) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(54) ? "" : "54"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(55) || isSeatReserved(55) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(55)}
          style={{ pointerEvents: isSeatReserved(55) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(55) ? "" : "55"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(56) || isSeatReserved(56) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(56)}
          style={{ pointerEvents: isSeatReserved(56) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(56) ? "" : "56"}</span>
        </div>
          </div>
          <div className="row">
          <div
          className={`seat ${isSeatSelected(57) || isSeatReserved(57) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(57)}
          style={{ pointerEvents: isSeatReserved(57) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(57) ? "" : "57"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(58) || isSeatReserved(58) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(58)}
          style={{ pointerEvents: isSeatReserved(58) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(58) ? "" : "58"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(59) || isSeatReserved(59) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(59)}
          style={{ pointerEvents: isSeatReserved(59) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(59) ? "" : "59"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(60) || isSeatReserved(60) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(60)}
          style={{ pointerEvents: isSeatReserved(60) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(60) ? "" : "60"}</span>
        </div>
          </div>
          <div className="row">
          <div
          className={`seat1 ${isSeatSelected(61) || isSeatReserved(61) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(61)}
          style={{ pointerEvents: isSeatReserved(61) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(61) ? "" : "61"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(62) || isSeatReserved(62) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(62)}
          style={{ pointerEvents: isSeatReserved(62) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(62) ? "" : "62"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(65) || isSeatReserved(65) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(65)}
          style={{ pointerEvents: isSeatReserved(65) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(65) ? "" : "65"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(63) || isSeatReserved(63) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(63)}
          style={{ pointerEvents: isSeatReserved(63) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(63) ? "" : "63"}</span>
        </div>
        <div
          className={`seat1 ${isSeatSelected(64) || isSeatReserved(64) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(64)}
          style={{ pointerEvents: isSeatReserved(64) ? "none" : "auto" }}
        >
          <span className="seat-number1">{isSeatSelected(64) ? "" : "64"}</span>
        </div>
          </div>
          <img
            src={stepenice}
            alt="stepenice-busgore"
            className="stepenice-busgore"
          />
          <img
            src={stepenice}
            alt="stepenice-bus3"
            className="stepenice-bus3"
          />
        </div>
      )}
      {trenutniSprat === "donji" && (
        <div className="container-seat">
          <div className="row">
            <img src={volan} alt="volan" className="volan" />
          </div>
          <div className="row">
          <div
          className={`seat left ${isSeatSelected(90) || isSeatReserved(90) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(90)}
          style={{ pointerEvents: isSeatReserved(90) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(90) ? "" : "90"}</span>
        </div>
        <div
          className={`seat left ${isSeatSelected(91) || isSeatReserved(91) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(91)}
          style={{ pointerEvents: isSeatReserved(91) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(91) ? "" : "91"}</span>
        </div>
          </div>
          <div className="row">
          <div
          className={`seat ${isSeatSelected(86) || isSeatReserved(86) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(86)}
          style={{ pointerEvents: isSeatReserved(86) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(86) ? "" : "86"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(87) || isSeatReserved(87) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(87)}
          style={{ pointerEvents: isSeatReserved(87) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(87) ? "" : "87"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(88) || isSeatReserved(88) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(88)}
          style={{ pointerEvents: isSeatReserved(88) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(88) ? "" : "88"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(89) || isSeatReserved(89) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(89)}
          style={{ pointerEvents: isSeatReserved(89) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(89) ? "" : "89"}</span>
        </div>
          </div>
          <div className="row">
            <br />
            <br />
            <br />
            <br />
          </div>
          <div className="row">
          <div
          className={`seat ${isSeatSelected(82) || isSeatReserved(82) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(82)}
          style={{ pointerEvents: isSeatReserved(82) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(82) ? "" : "82"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(83) || isSeatReserved(83) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(83)}
          style={{ pointerEvents: isSeatReserved(83) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(83) ? "" : "83"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(84) || isSeatReserved(84) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(84)}
          style={{ pointerEvents: isSeatReserved(84) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(84) ? "" : "84"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(85) || isSeatReserved(85) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(85)}
          style={{ pointerEvents: isSeatReserved(85) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(85) ? "" : "85"}</span>
        </div>
          </div>
          <div className="row">
          <div
          className={`seat ${isSeatSelected(78) || isSeatReserved(78) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(78)}
          style={{ pointerEvents: isSeatReserved(78) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(78) ? "" : "78"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(79) || isSeatReserved(79) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(79)}
          style={{ pointerEvents: isSeatReserved(79) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(79) ? "" : "79"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(80) || isSeatReserved(80) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(80)}
          style={{ pointerEvents: isSeatReserved(80) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(80) ? "" : "80"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(81) || isSeatReserved(81) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(81)}
          style={{ pointerEvents: isSeatReserved(81) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(81) ? "" : "81"}</span>
        </div>
          </div>
          <div className="row">
          <div
          className={`seat ${isSeatSelected(74) || isSeatReserved(74) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(74)}
          style={{ pointerEvents: isSeatReserved(74) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(74) ? "" : "74"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(75) || isSeatReserved(75) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(75)}
          style={{ pointerEvents: isSeatReserved(75) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(75) ? "" : "75"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(76) || isSeatReserved(76) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(76)}
          style={{ pointerEvents: isSeatReserved(76) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(76) ? "" : "76"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(77) || isSeatReserved(77) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(77)}
          style={{ pointerEvents: isSeatReserved(77) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(77) ? "" : "77"}</span>
        </div>
          </div>
          <div className="row">
          <div
          className={`seat ${isSeatSelected(70) || isSeatReserved(70) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(70)}
          style={{ pointerEvents: isSeatReserved(70) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(70) ? "" : "70"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(71) || isSeatReserved(71) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(71)}
          style={{ pointerEvents: isSeatReserved(71) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(71) ? "" : "71"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(72) || isSeatReserved(72) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(72)}
          style={{ pointerEvents: isSeatReserved(72) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(72) ? "" : "72"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(73) || isSeatReserved(73) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(73)}
          style={{ pointerEvents: isSeatReserved(73) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(73) ? "" : "73"}</span>
        </div>
          </div>
          <div className="row margin">
          <div
          className={`seat ${isSeatSelected(66) || isSeatReserved(66) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(66)}
          style={{ pointerEvents: isSeatReserved(66) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(66) ? "" : "66"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(67) || isSeatReserved(67) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(67)}
          style={{ pointerEvents: isSeatReserved(67) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(67) ? "" : "67"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(68) || isSeatReserved(68) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(68)}
          style={{ pointerEvents: isSeatReserved(68) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(68) ? "" : "68"}</span>
        </div>
        <div
          className={`seat ${isSeatSelected(69) || isSeatReserved(69) ? "disabled" : ""}`}
          onClick={() => handleSeatClick(69)}
          style={{ pointerEvents: isSeatReserved(69) ? "none" : "auto" }}
        >
          <span className="seat-number">{isSeatSelected(69) ? "" : "69"}</span>
        </div>
          </div>
          {selectedSeats.length > 0 && (
            <div>
              <p>Korisnik je izabrao sedišta: {selectedSeats.join(", ")}</p>
            </div>
          )}
          <img src={sto} alt="sto" className="sto1" />
          <img src={sto} alt="sto" className="sto2" />
          <img src={ulaz} alt="ulaz-bus2 " className="ulaz-bus2 " />
          <img src={ulaz} alt="ulaz" className="ulaz-vh" />
          <img src={wc} alt="wc" className="wc-vh" />
          <img src={stepenice} alt="stepenice" className="stepenice-vh" />
          <img src={stepenice} alt="stepenice" className="stepenice-vh1" />

        </div>
      )}
    </>
  );
};

export default VH;