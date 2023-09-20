import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaniceApi from "../../../api/stanice.api";

const StaniceInitial = () => {
  const [stanice, setStanice] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [staniceToDelete, setStaniceToDelete] = useState(null);

  const getStanice = async () => {
    const response = await fetch("http://localhost:5000/stanica");
    const data = await response.json();
    console.log(data)
    setStanice(data.stanice);
  };

  useEffect(() => {
    getStanice();
  }, []);

  const brisanjeStanice = (id) => {
    setStaniceToDelete(id);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (staniceToDelete !== null) {
      const response = await StaniceApi().brisanjeStanice(staniceToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setStaniceToDelete(null);
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <div>
        <ul>
          {stanice.map((stanica) => {
            return (
              <li key={stanica.id}>
                <div>
                  naziv: {stanica.naziv}, adresa: {stanica.adresa}
                  <Link to={`${stanice.id}/stanice.edit`}>
                    <button>Izmeni</button>
                  </Link>
                  <button onClick={() => brisanjeStanice(stanica.id)}>
                    Obrisi
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <Link to={"/stanice.add"}>
        <button>Dodaj novu stanicu</button>
      </Link>

      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-box">
            <p>Da li ste sigurni da želite da obrišete ovu liniju?</p>
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

export default StaniceInitial;
 

