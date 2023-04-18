import React from 'react';
import Seat from './seat';

class Bus extends React.Component {
  state = {
    selectedSeat: null,
  }

  handleClick = (seatNumber) => {
    const selectedSeat = this.state.selectedSeat;
    if (selectedSeat === seatNumber) {
      this.setState({ selectedSeat: null });
    } else if (!selectedSeat) {
      this.setState({ selectedSeat: seatNumber });
    }
  }

  createSeats = () => {
    const seats = [];

    for (let i = 1; i <= 52; i++) {
      const isSelected = this.state.selectedSeat === i;

      seats.push(
        <Seat
          key={i}
          number={i}
          isSelected={isSelected}
          onSelect={this.handleClick}
        />
      );
    }

    return seats;
  }

  render() {
    const seats = this.createSeats();

    return (
      <div className="bus">
        <h1>Autobus</h1>
        <div className='bus-look'>
        <div className="seats">
          {seats}
        </div>
        </div>
      </div>
    );
  }
}

export default Bus;