import React, { useState } from 'react';
import MB3 from './mb3';
import MB4 from './mb4';
import MK91 from './mk91';

function SeatSabiranje() {
  const [izabranFajl, setIzabranFajl] = useState('');
  const [prikaziDivove, setPrikaziDivove] = useState(false);
  const [dinamickeKomponente, setDinamickeKomponente] = useState([]);

  const handleIzborFajla = (e) => {
    setIzabranFajl(e.target.value);
  };

  const handleSelect = async () => {
    if (izabranFajl) {
      // Dinamičko uvozivanje komponente na osnovu izabranog fajla
      let uvezenaKomponenta;

      if (izabranFajl === 'MB3') {
        uvezenaKomponenta = MB3;
      } else if (izabranFajl === 'MB4') {
        uvezenaKomponenta = MB4;
      } else if (izabranFajl === 'MK91') {
        uvezenaKomponenta = MK91;
      } 

      if (uvezenaKomponenta) {
        setDinamickeKomponente([uvezenaKomponenta]);
        setPrikaziDivove(true);
      }
    } else {
      // Prikazati poruku ili obavestenje da nema izabranog fajla
    }
  };

  return (
    <div>
      <select onChange={handleIzborFajla}>
        <option value="">Izaberi fajl</option>
        <option value="MB3">MB3</option>
        <option value="MB4">MB4</option>
        <option value="MK91">MK91</option>
      </select>
      <button onClick={handleSelect}>Izaberi bus</button>

      {prikaziDivove && (
        <div>
          <h2>Prikaz odabranih divova:</h2>
          {dinamickeKomponente.map((Komponenta, index) => (
            <Komponenta key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SeatSabiranje;