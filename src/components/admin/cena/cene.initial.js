import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CeneApi from "../../../api/cene.api";

const CeneInitial = () => {
  const [cene, setCene] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [ceneToDelete, setCeneToDelete] = useState(null);

  const getCene = async () => {
    const response = await fetch("http://localhost:5000/cena");
    const data = await response.json();
    setCene(data.cena);
  };

  useEffect(() => {
    getCene();
  }, []);

  const brisanjeCene = (id) => {
    setCeneToDelete(id);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (ceneToDelete !== null) {
      const response = await CeneApi().brisanjeCene(ceneToDelete);
      window.location.reload();
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setCeneToDelete(null);
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <div>
        <ul>
          {cene &&
            Array.isArray(cene) &&
            cene.map((jednaCena) => {
              return (
                <li key={jednaCena.id}>
                  <div>Pocetna Stanica</div>
                  <div>{jednaCena.pocetnaStanica}</div>
                  <div>Krajnja Stanica</div>
                  <div>{jednaCena.krajnjaStanicaR}</div>
                  <div>Cena</div>
                  <div>{jednaCena.cenaKarte}</div>
                  <div>
                    <Link to={`${jednaCena.id}/cene.edit`}>
                      <button>Izmeni</button>
                    </Link>
                  </div>
                  <div>
                    <button onClick={() => brisanjeCene(jednaCena.id)}>
                      Obriši
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <div>
        <Link to={"/cene.add"}>
          <button className="buttonSwitch">Dodaj novu cenu</button>
        </Link>
      </div>
      <div className="confirm-dialog-container">
        {isConfirmationOpen && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-box">
              <div>Da li ste sigurni da želite da obrišete ovu cenu?</div>
              <button className="confirm-dialog-yes" onClick={confirmDelete}>
                Da
              </button>
              <button className="confirm-dialog-no" onClick={cancelDelete}>
                Ne
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CeneInitial;
