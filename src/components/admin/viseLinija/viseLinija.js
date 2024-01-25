import { useEffect, useState } from "react";
import apiUrl from "../../../apiConfig";

const ViseLinija = () => {
  const [linije, setLinije] = useState([]);

  const getLinije = async () => {
    const response = await fetch(`${apiUrl}/linija/filtriraneLinije`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setLinije(data.filtriraneLinije);
  };

  useEffect(() => {
    getLinije();
  }, []);

  return (
    <div>
      {linije.map((linija) => {
        return (
          <>
            <div>Pocetna stanica: {linija.pocetnaStanica.naziv}</div>
            <div>krajnja stanica: {linija.krajnjaStanica.naziv}</div>
            {linija.Stanicas.map((medjustanica) => {
              return (
                <div>
                  <div>medjustanica: {medjustanica.naziv}</div>
                </div>
              );
            })}
          </>
        );
      })}
    </div>
  );
};

export default ViseLinija;
