import "./seat.css";
import React, { useState } from "react";

import volan from "./../../images/volan.png";
import ulaz from "./../../images/ulaz.jpg";
import stepenice from "./../../images/stepenice.jpg";
import sto from "./../../images/sto.jpg";

const MK91 = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [trenutniSprat, setTrenutniSprat] = useState("gornji");

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const isSeatSelected = (seatNumber) => {
    return selectedSeats.includes(seatNumber);
  };

  const handleSeat1Click = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const isSeat1Selected = (seatNumber) => {
    return selectedSeats.includes(seatNumber);
  };
  const handlePromeniSprat = (sprat) => {
    setTrenutniSprat(sprat);
  };

  return (
    <>
      <div className="dugmad-spratovi">
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
              className={`seat ${isSeatSelected(4) ? "selected" : ""}`}
              onClick={() => handleSeatClick(4)}
            >
              <span className="seat-number2">
                {isSeatSelected(4) ? "" : "4"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(3) ? "selected" : ""}`}
              onClick={() => handleSeatClick(3)}
            >
              <span className="seat-number2">
                {isSeatSelected(3) ? "" : "3"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(2) ? "selected" : ""}`}
              onClick={() => handleSeatClick(2)}
            >
              <span className="seat-number2">
                {isSeatSelected(2) ? "" : "2"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(1) ? "selected" : ""}`}
              onClick={() => handleSeatClick(1)}
            >
              <span className="seat-number2">
                {isSeatSelected(1) ? "" : "1"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(5) ? "selected" : ""}`}
              onClick={() => handleSeatClick(5)}
            >
              <span className="seat-number2">
                {isSeatSelected(5) ? "" : "5"}
              </span>
            </div>
            <div
              className={`seat1 ${isSeatSelected(6) ? "selected" : ""}`}
              onClick={() => handleSeatClick(6)}
            >
              <span className="seat-number1">
                {isSeatSelected(6) ? "" : "6"}
              </span>
            </div>
            <div></div>
          </div>

          <div className="row">
            <div
              className={`seat ${isSeatSelected(7) ? "selected" : ""}`}
              onClick={() => handleSeatClick(7)}
            >
              <span className="seat-number2">
                {isSeatSelected(7) ? "" : "7"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(8) ? "selected" : ""}`}
              onClick={() => handleSeatClick(8)}
            >
              <span className="seat-number2">
                {isSeatSelected(8) ? "" : "8"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(9) ? "selected" : ""}`}
              onClick={() => handleSeatClick(9)}
            >
              <span className="seat-number2">
                {isSeatSelected(9) ? "" : "9"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(10) ? "selected" : ""}`}
              onClick={() => handleSeatClick(10)}
            >
              <span className="seat-number">
                {isSeatSelected(10) ? "" : "10"}
              </span>
            </div>
          </div>

          <div className="row">
            <div
              className={`seat ${isSeatSelected(11) ? "selected" : ""}`}
              onClick={() => handleSeatClick(11)}
            >
              <span className="seat-number">
                {isSeatSelected(11) ? "" : "11"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(12) ? "selected" : ""}`}
              onClick={() => handleSeatClick(12)}
            >
              <span className="seat-number">
                {isSeatSelected(12) ? "" : "12"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(13) ? "selected" : ""}`}
              onClick={() => handleSeatClick(13)}
            >
              <span className="seat-number">
                {isSeatSelected(13) ? "" : "13"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(14) ? "selected" : ""}`}
              onClick={() => handleSeatClick(14)}
            >
              <span className="seat-number">
                {isSeatSelected(14) ? "" : "14"}
              </span>
            </div>
          </div>

          <div className="row">
            <div
              className={`seat ${isSeatSelected(15) ? "selected" : ""}`}
              onClick={() => handleSeatClick(15)}
            >
              <span className="seat-number">
                {isSeatSelected(15) ? "" : "15"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(16) ? "selected" : ""}`}
              onClick={() => handleSeatClick(16)}
            >
              <span className="seat-number">
                {isSeatSelected(16) ? "" : "16"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(17) ? "selected" : ""}`}
              onClick={() => handleSeatClick(17)}
            >
              <span className="seat-number">
                {isSeatSelected(17) ? "" : "17"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(18) ? "selected" : ""}`}
              onClick={() => handleSeatClick(18)}
            >
              <span className="seat-number">
                {isSeatSelected(18) ? "" : "18"}
              </span>
            </div>
          </div>

          <div className="row">
            <div
              className={`seat ${isSeatSelected(19) ? "selected" : ""}`}
              onClick={() => handleSeatClick(19)}
            >
              <span className="seat-number">
                {isSeatSelected(19) ? "" : "19"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(20) ? "selected" : ""}`}
              onClick={() => handleSeatClick(20)}
            >
              <span className="seat-number">
                {isSeatSelected(20) ? "" : "20"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(21) ? "selected" : ""}`}
              onClick={() => handleSeatClick(21)}
            >
              <span className="seat-number">
                {isSeatSelected(21) ? "" : "21"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(22) ? "selected" : ""}`}
              onClick={() => handleSeatClick(22)}
            >
              <span className="seat-number">
                {isSeatSelected(22) ? "" : "22"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat1 ${isSeatSelected(23) ? "selected" : ""}`}
              onClick={() => handleSeatClick(23)}
            >
              <span className="seat-number1">
                {isSeatSelected(23) ? "" : "23"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(24) ? "selected" : ""}`}
              onClick={() => handleSeatClick(24)}
            >
              <span className="seat-number">
                {isSeatSelected(24) ? "" : "24"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(25) ? "selected" : ""}`}
              onClick={() => handleSeatClick(25)}
            >
              <span className="seat-number">
                {isSeatSelected(25) ? "" : "25"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(26) ? "selected" : ""}`}
              onClick={() => handleSeatClick(26)}
            >
              <span className="seat-number">
                {isSeatSelected(26) ? "" : "26"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(27) ? "selected" : ""}`}
              onClick={() => handleSeatClick(27)}
            >
              <span className="seat-number">
                {isSeatSelected(27) ? "" : "27"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(28) ? "selected" : ""}`}
              onClick={() => handleSeatClick(28)}
            >
              <span className="seat-number">
                {isSeatSelected(28) ? "" : "28"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(29) ? "selected" : ""}`}
              onClick={() => handleSeatClick(29)}
            >
              <span className="seat-number">
                {isSeatSelected(29) ? "" : "29"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(30) ? "selected" : ""}`}
              onClick={() => handleSeatClick(30)}
            >
              <span className="seat-number">
                {isSeatSelected(30) ? "" : "30"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(31) ? "selected" : ""}`}
              onClick={() => handleSeatClick(31)}
            >
              <span className="seat-number">
                {isSeatSelected(31) ? "" : "31"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(32) ? "selected" : ""}`}
              onClick={() => handleSeatClick(32)}
            >
              <span className="seat-number">
                {isSeatSelected(32) ? "" : "32"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(33) ? "selected" : ""}`}
              onClick={() => handleSeatClick(33)}
            >
              <span className="seat-number">
                {isSeatSelected(33) ? "" : "33"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(34) ? "selected" : ""}`}
              onClick={() => handleSeatClick(34)}
            >
              <span className="seat-number">
                {isSeatSelected(34) ? "" : "34"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(35) ? "selected" : ""}`}
              onClick={() => handleSeatClick(35)}
            >
              <span className="seat-number">
                {isSeatSelected(35) ? "" : "35"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(36) ? "selected" : ""}`}
              onClick={() => handleSeatClick(36)}
            >
              <span className="seat-number">
                {isSeatSelected(36) ? "" : "36"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(37) ? "selected" : ""}`}
              onClick={() => handleSeatClick(37)}
            >
              <span className="seat-number">
                {isSeatSelected(37) ? "" : "37"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(38) ? "selected" : ""}`}
              onClick={() => handleSeatClick(38)}
            >
              <span className="seat-number">
                {isSeatSelected(38) ? "" : "38"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat1 ${isSeatSelected(39) ? "selected" : ""}`}
              onClick={() => handleSeatClick(39)}
            >
              <span className="seat-number1">
                {isSeatSelected(39) ? "" : "39"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(40) ? "selected" : ""}`}
              onClick={() => handleSeatClick(40)}
            >
              <span className="seat-number">
                {isSeatSelected(40) ? "" : "40"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(41) ? "selected" : ""}`}
              onClick={() => handleSeatClick(41)}
            >
              <span className="seat-number">
                {isSeatSelected(41) ? "" : "41"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(42) ? "selected" : ""}`}
              onClick={() => handleSeatClick(42)}
            >
              <span className="seat-number">
                {isSeatSelected(42) ? "" : "42"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(43) ? "selected" : ""}`}
              onClick={() => handleSeatClick(43)}
            >
              <span className="seat-number">
                {isSeatSelected(43) ? "" : "43"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(44) ? "selected" : ""}`}
              onClick={() => handleSeatClick(44)}
            >
              <span className="seat-number">
                {isSeatSelected(44) ? "" : "44"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(45) ? "selected" : ""}`}
              onClick={() => handleSeatClick(45)}
            >
              <span className="seat-number">
                {isSeatSelected(45) ? "" : "45"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(46) ? "selected" : ""}`}
              onClick={() => handleSeatClick(46)}
            >
              <span className="seat-number">
                {isSeatSelected(46) ? "" : "46"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(47) ? "selected" : ""}`}
              onClick={() => handleSeatClick(47)}
            >
              <span className="seat-number">
                {isSeatSelected(47) ? "" : "47"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(48) ? "selected" : ""}`}
              onClick={() => handleSeatClick(48)}
            >
              <span className="seat-number">
                {isSeatSelected(48) ? "" : "48"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(49) ? "selected" : ""}`}
              onClick={() => handleSeatClick(49)}
            >
              <span className="seat-number">
                {isSeatSelected(49) ? "" : "49"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(50) ? "selected" : ""}`}
              onClick={() => handleSeatClick(50)}
            >
              <span className="seat-number">
                {isSeatSelected(50) ? "" : "50"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(51) ? "selected" : ""}`}
              onClick={() => handleSeatClick(51)}
            >
              <span className="seat-number">
                {isSeatSelected(51) ? "" : "51"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(52) ? "selected" : ""}`}
              onClick={() => handleSeatClick(52)}
            >
              <span className="seat-number">
                {isSeatSelected(52) ? "" : "52"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(53) ? "selected" : ""}`}
              onClick={() => handleSeatClick(53)}
            >
              <span className="seat-number">
                {isSeatSelected(53) ? "" : "53"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(54) ? "selected" : ""}`}
              onClick={() => handleSeatClick(54)}
            >
              <span className="seat-number">
                {isSeatSelected(54) ? "" : "54"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(55) ? "selected" : ""}`}
              onClick={() => handleSeatClick(55)}
            >
              <span className="seat-number">
                {isSeatSelected(55) ? "" : "55"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(56) ? "selected" : ""}`}
              onClick={() => handleSeatClick(56)}
            >
              <span className="seat-number">
                {isSeatSelected(56) ? "" : "56"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(57) ? "selected" : ""}`}
              onClick={() => handleSeatClick(57)}
            >
              <span className="seat-number">
                {isSeatSelected(57) ? "" : "57"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(58) ? "selected" : ""}`}
              onClick={() => handleSeatClick(58)}
            >
              <span className="seat-number">
                {isSeatSelected(58) ? "" : "58"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(59) ? "selected" : ""}`}
              onClick={() => handleSeatClick(59)}
            >
              <span className="seat-number">
                {isSeatSelected(59) ? "" : "59"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(60) ? "selected" : ""}`}
              onClick={() => handleSeatClick(60)}
            >
              <span className="seat-number">
                {isSeatSelected(60) ? "" : "60"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat1 ${isSeat1Selected(61) ? "selected" : ""}`}
              onClick={() => handleSeat1Click(61)}
            >
              <span className="seat-number1">
                {isSeatSelected(61) ? "" : "61"}
              </span>
            </div>
            <div
              className={`seat1 ${isSeat1Selected(62) ? "selected" : ""}`}
              onClick={() => handleSeat1Click(62)}
            >
              <span className="seat-number1">
                {isSeatSelected(62) ? "" : "62"}
              </span>
            </div>
            <div
              className={`seat1 ${isSeat1Selected(63) ? "selected" : ""}`}
              onClick={() => handleSeat1Click(63)}
            >
              <span className="seat-number1">
                {isSeatSelected(63) ? "" : "63"}
              </span>
            </div>
            <div
              className={`seat1 ${isSeat1Selected(64) ? "selected" : ""}`}
              onClick={() => handleSeat1Click(64)}
            >
              <span className="seat-number1">
                {isSeatSelected(64) ? "" : "64"}
              </span>
            </div>
            <div
              className={`seat1 ${isSeat1Selected(65) ? "selected" : ""}`}
              onClick={() => handleSeat1Click(65)}
            >
              <span className="seat-number1">
                {isSeatSelected(65) ? "" : "65"}
              </span>
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
              className={`seat left ${isSeatSelected(90) ? "selected" : ""}`}
              onClick={() => handleSeatClick(90)}
            >
              <span className="seat-number">
                {isSeatSelected(90) ? "" : "90"}
              </span>
            </div>
            <div
              className={`seat left ${isSeatSelected(91) ? "selected" : ""}`}
              onClick={() => handleSeatClick(91)}
            >
              <span className="seat-number">
                {isSeatSelected(91) ? "" : "91"}
              </span>
            </div>
            {/* <div
            className={`seat ${isSeatSelected(86) ? "selected" : ""}`}
            onClick={() => handleSeatClick(86)}
          >
            <span className="seat-number">
              {isSeatSelected(86) ? "" : "86"}
            </span>
          </div>
          <div
            className={`seat ${isSeatSelected(87) ? "selected" : ""}`}
            onClick={() => handleSeatClick(87)}
          >
            <span className="seat-number">
              {isSeatSelected(87) ? "" : "87"}
            </span>
          </div> */}
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(86) ? "selected" : ""}`}
              onClick={() => handleSeatClick(86)}
            >
              <span className="seat-number">
                {isSeatSelected(86) ? "" : "86"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(87) ? "selected" : ""}`}
              onClick={() => handleSeatClick(87)}
            >
              <span className="seat-number">
                {isSeatSelected(87) ? "" : "87"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(88) ? "selected" : ""}`}
              onClick={() => handleSeatClick(88)}
            >
              <span className="seat-number">
                {isSeatSelected(88) ? "" : "88"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(89) ? "selected" : ""}`}
              onClick={() => handleSeatClick(89)}
            >
              <span className="seat-number">
                {isSeatSelected(89) ? "" : "89"}
              </span>
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
              className={`seat ${isSeatSelected(82) ? "selected" : ""}`}
              onClick={() => handleSeatClick(82)}
            >
              <span className="seat-number">
                {isSeatSelected(82) ? "" : "82"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(83) ? "selected" : ""}`}
              onClick={() => handleSeatClick(83)}
            >
              <span className="seat-number">
                {isSeatSelected(83) ? "" : "83"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(84) ? "selected" : ""}`}
              onClick={() => handleSeatClick(84)}
            >
              <span className="seat-number">
                {isSeatSelected(84) ? "" : "84"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(85) ? "selected" : ""}`}
              onClick={() => handleSeatClick(85)}
            >
              <span className="seat-number">
                {isSeatSelected(85) ? "" : "85"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(78) ? "selected" : ""}`}
              onClick={() => handleSeatClick(78)}
            >
              <span className="seat-number">
                {isSeatSelected(78) ? "" : "78"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(79) ? "selected" : ""}`}
              onClick={() => handleSeatClick(79)}
            >
              <span className="seat-number">
                {isSeatSelected(79) ? "" : "79"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(80) ? "selected" : ""}`}
              onClick={() => handleSeatClick(80)}
            >
              <span className="seat-number">
                {isSeatSelected(80) ? "" : "80"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(81) ? "selected" : ""}`}
              onClick={() => handleSeatClick(81)}
            >
              <span className="seat-number">
                {isSeatSelected(81) ? "" : "81"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(74) ? "selected" : ""}`}
              onClick={() => handleSeatClick(74)}
            >
              <span className="seat-number">
                {isSeatSelected(74) ? "" : "74"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(75) ? "selected" : ""}`}
              onClick={() => handleSeatClick(75)}
            >
              <span className="seat-number">
                {isSeatSelected(75) ? "" : "75"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(76) ? "selected" : ""}`}
              onClick={() => handleSeatClick(76)}
            >
              <span className="seat-number">
                {isSeatSelected(76) ? "" : "76"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(77) ? "selected" : ""}`}
              onClick={() => handleSeatClick(77)}
            >
              <span className="seat-number">
                {isSeatSelected(77) ? "" : "77"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(70) ? "selected" : ""}`}
              onClick={() => handleSeatClick(70)}
            >
              <span className="seat-number">
                {isSeatSelected(70) ? "" : "70"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(71) ? "selected" : ""}`}
              onClick={() => handleSeatClick(71)}
            >
              <span className="seat-number">
                {isSeatSelected(71) ? "" : "71"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(72) ? "selected" : ""}`}
              onClick={() => handleSeatClick(72)}
            >
              <span className="seat-number">
                {isSeatSelected(72) ? "" : "72"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(73) ? "selected" : ""}`}
              onClick={() => handleSeatClick(73)}
            >
              <span className="seat-number">
                {isSeatSelected(73) ? "" : "73"}
              </span>
            </div>
          </div>
          <div className="row">
            <div
              className={`seat ${isSeatSelected(66) ? "selected" : ""}`}
              onClick={() => handleSeatClick(66)}
            >
              <span className="seat-number">
                {isSeatSelected(66) ? "" : "66"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(67) ? "selected" : ""}`}
              onClick={() => handleSeatClick(67)}
            >
              <span className="seat-number">
                {isSeatSelected(67) ? "" : "67"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(68) ? "selected" : ""}`}
              onClick={() => handleSeatClick(68)}
            >
              <span className="seat-number">
                {isSeatSelected(68) ? "" : "68"}
              </span>
            </div>
            <div
              className={`seat ${isSeatSelected(69) ? "selected" : ""}`}
              onClick={() => handleSeatClick(69)}
            >
              <span className="seat-number">
                {isSeatSelected(69) ? "" : "69"}
              </span>
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
        </div>
      )}
    </>
  );
};

export default MK91;
