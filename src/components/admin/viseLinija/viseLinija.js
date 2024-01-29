import { useEffect, useState } from "react";
import apiUrl from "../../../apiConfig";
import ListajJSON_Konzola from "../ListajJSON_Konzola";
import "../../admin/viseLinija/viseLinija.css"

const ViseLinija = () => {
  const [linije, setLinije] = useState([]);
  const [period, setPeriod] = useState(0); // za koji period hocemo red voznje za 1, 3 ili 6 meseci

  const [valueDate, setValueDate] = useState("");

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
            <div className="okvir">
              <div className="pocetna">
                Pocetna stanica : {linija.pocetnaStanica.naziv}
              </div>
              <div>Krajnja stanica : {linija.krajnjaStanica.naziv}</div>
            </div>
            {linija.Stanicas.map((medjustanica) => {
              return (
                <div>
                  <div className="okvir">
                    Medjustanica : {medjustanica.naziv}
                  </div>
                </div>
              );
            })}
            <div className="okvir">
            <button
              onClick={() => {
                setPeriod(1);
              }}
            >
              Za 1 mesec
            </button>{" "}
            &emsp;
            <button
              onClick={() => {
                setPeriod(3);
              }}
            >
              Za 3 meseci
            </button>{" "}
            &emsp;
            <button
              onClick={() => {
                setPeriod(6);
              }}
            >
              Za 6 meseci
            </button>
            <ListajJSON_Konzola valueDate={valueDate} period={period} />
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ViseLinija;
