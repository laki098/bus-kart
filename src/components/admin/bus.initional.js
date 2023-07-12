import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const BusInitional = () => {
  const [busevi, setBusevi] = useState([]);

  const getBus = async () => {
    const response = await fetch("http://localhost:5000/autobusi/autobusi");
    const data = await response.json();
    setBusevi(data);
  };
  console.log(busevi);
  useEffect(() => {
    getBus();
  }, []);
  return (
    <>
      <div>
        <ul>
          {" "}
          <div>
            {" "}
            {busevi.map((bus) => {
              return (
                <li key={bus.idautobusi}>
                  <div>
                    {" "}
                    tablica: {bus.tablica}, brojMesta: {bus.brojMesta}
                    <Link to={`${bus.idautobusi}/bus.change.line`}>
                      <button>Izmeni</button>
                    </Link>
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
