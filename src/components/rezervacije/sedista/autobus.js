import { useState } from 'react';
import "./sedista.css";

function Autobus() {
  const [rezervacije, setRezervacije] = useState(Array(53).fill(false));
  const [trenutnaRezervacija, setTrenutnaRezervacija] = useState(null);

  function handleClick(index) {
    const noviNiz = [...rezervacije];
    console.log(index + 1)
    noviNiz[index] = !noviNiz[index];

    setRezervacije(noviNiz);
    setTrenutnaRezervacija(noviNiz[index] ? index + 1 : null);
  }
 

  return (
    <div className="autobus">
      {rezervacije.map((rezervisano, index) => (
        <div
          key={index}
          className={`sediste ${rezervisano ? 'rezervisano' : ''}`}
          onClick={() => handleClick(index)}
          style={{
            marginRight: index % 4 === 1 ? '1.5rem' : 1,
            width: index % 4 === 4 || index === rezervacije.length - 1 ? 'calc(20% - 0rem)' : '20%',
            marginLeft:
              index >= 48 && index <= 48 ? 'calc(5% - 1rem)' :
              index >= 49 && index <= 49 ? 'calc(5% - 0.6rem)' :
              index >= 50 && index <= 50 ? 'calc(5% - 2rem)' :
              index >= 51 && index <= 52 ? 'calc(5% - 0.6rem)' :/* 
              index % 4 === 4 && index !== 0 ? '2.5rem' : */
              0,
          }}
        >
          {index + 1}
        </div>
      ))}
      <div>
        Trenutno rezervisano mesto: {trenutnaRezervacija || 'Nijedno'}
      </div>
      <ul className="showcase">
        <li>
          <div className="seat selected"></div>
          <small>Izabrano</small>
        </li>

        <li>
          <div className="seat occupied"></div>
          <small>Zauzeto</small>
        </li>
      </ul>
      <button>Izaberite sediste</button>
   
    </div>
  );
}

export default Autobus; // ceo kod je ubacen u rezervacijacomponent