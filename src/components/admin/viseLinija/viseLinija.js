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
    <div className="linija-okvir">
      {linije.map((linija) => {
        return (
          <>
            <div className="linija-red">
              <div className="linija-polja">
                Pocetna stanica </div>
                <div className="linija-info">
                   {linija.pocetnaStanica.naziv}
              </div>
              <div className="linija-polja">
                Krajnja stanica </div>
              <div className="linija-info">
                 {linija.krajnjaStanica.naziv}
                 </div>
           
            {linija.Stanicas.map((medjustanica) => {
              return (
                <>
                <div className="linija-polja">
                  Medjustanica 
                  </div>
                  <div className="linija-info">
                     {medjustanica.naziv}
                  
                </div>
                </>
              );
            })}
            <div className="linija-dugme">
            <button className="button-linija"
              onClick={() => {
                setPeriod(1);
              }}
            >
              1 mesec
            </button>{" "}
            &emsp;
            <button className="button-linija"
              onClick={() => {
                setPeriod(3);
              }}
            >
            3 meseci
            </button>{" "}
            &emsp;
            <button className="button-linija"
              onClick={() => {
                setPeriod(6);
              }}
            >
            6 meseci
            </button>
            </div>
            <ListajJSON_Konzola valueDate={valueDate} period={period} />
            </div>
           
          </>
        );
      })}
    </div>
    
  );
};

export default ViseLinija;
