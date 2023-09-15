import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BusApi from "../../api/bus.api";

const BusInitional = () => {
  const [busevi, setBusevi] = useState([]);
  useEffect(() => {
    getBus();
  }, []);

  const getBus = async () => {
    const response = await fetch("http://localhost:5000/autobusi");
    const data = await response.json();
    setBusevi(data.autobusi);
  };

  const brisanjeBusa = async (idAutobusa) => {
    const response = await BusApi().brisanjeBus(idAutobusa);
    window.location.reload();
  };

  return (
    <>
      <div>
        <ul>
          {" "}
          <div>
            {" "}
            {busevi.map((bus) => {
              return (
                <li key={bus.idAutobusa}>
                  <div>
                    {" "}
                    oznaka: {bus.oznakaBusa}, tablice: {bus.tablice}, brojMesta:{" "}
                    {bus.brojSedista}
                    <Link to={`${bus.idAutobusa}/bus.change.line`}>
                      <button>Izmeni</button>
                    </Link>
                    <button onClick={() => brisanjeBusa(bus.idAutobusa)}>
                      Obrisi
                    </button>
                  </div>
                </li>
              );
            })}
          </div>
        </ul>
      </div>
      <Link to={"/bus.add"}>
        <button>Dodaj novi autobus</button>
      </Link>
    </>
  );
};

export default BusInitional;
