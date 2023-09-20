import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BusApi from "../../api/bus.api";
import "./admin.css";

const BusInitional = () => {
  const [busevi, setBusevi] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  useEffect(() => {
    getBus();
  }, []);

  const getBus = async () => {
    const response = await fetch("http://localhost:5000/autobusi");
    const data = await response.json();
    setBusevi(data.autobusi);
  };

  const brisanjeBusa = (idAutobusa) => {
    setBusToDelete(idAutobusa);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (busToDelete !== null) {
      const response = await BusApi().brisanjeBus(busToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setBusToDelete(null);
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <div>
        <ul>
          {busevi.map((bus) => {
            return (
              <li key={bus.idAutobusa}>
                <div>
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
        </ul>
      </div>
      <Link to={"/bus.add"}>
        <button>Dodaj novi autobus</button>
      </Link>

      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-box">
            <p>Da li ste sigurni da želite da obrišete ovu stavku?</p>
            <button className="confirm-dialog-yes" onClick={confirmDelete}>
              Da
            </button>
            <button className="confirm-dialog-no" onClick={cancelDelete}>
              Ne
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BusInitional;