import "./seat.css";
import React, { useState } from 'react';

const SeatsTry = () => {
  const numSeats = 45; // Promenite broj sedišta prema potrebama
  const [selectedSeats, setSelectedSeats] = useState([]);

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

  const renderSeats = () => {
    const rows = Math.ceil(numSeats / 4);

    let seats = [];

    for (let i = 0; i < rows; i++) {
      let rowSeats = [];

      if (i < rows - 1) {
        for (let j = 0; j < 4; j++) {
          const seatNumber = i * 4 + j + 1;
          rowSeats.push(
            <div
              key={seatNumber}
              className={`seat ${isSeatSelected(seatNumber) ? "selected" : ""}`}
              onClick={() => handleSeatClick(seatNumber)}
            ></div>
          );
        }
      } else {
        const remainingSeats = numSeats % 4;

        for (let j = 0; j < remainingSeats; j++) {
          const seatNumber = i * 4 + j + 1;
          rowSeats.push(
            <div
              key={seatNumber}
              className={`seat ${isSeatSelected(seatNumber) ? "selected" : ""}`}
              onClick={() => handleSeatClick(seatNumber)}
            ></div>
          );
        }

        if (remainingSeats < 4) {
          rowSeats.push(<div key="spacer" className="spacer"></div>);
        }
      }

      seats.push(<div key={`row-${i + 1}`} className="row">{rowSeats}</div>);
    }

    return seats;
  };

  return (
    <div className="container-seat">
      {renderSeats()}
    </div>
  );
}

export default SeatsTry;