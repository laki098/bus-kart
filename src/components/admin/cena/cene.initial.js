import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CeneApi from "../../../api/cene.api";
import apiUrl from "../../../apiConfig";

const CeneInitial = () => {
  const [cene, setCene] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [ceneToDelete, setCeneToDelete] = useState(null);

  const getCene = async () => {
    const response = await fetch(`${apiUrl}/cena`);
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
      <div className="cene-okvir">
        <ul>
          {cene &&
            Array.isArray(cene) &&
            cene.map((jednaCena) => {
              return (
                <li key={jednaCena.id}>
                  <div className="cene-red">
                    <div className="cene-polja">Pocetna Stanica</div>
                    <div className="cene-polja1">
                      {jednaCena.pocetnaStanica}
                    </div>
                    <div className="cene-polja">Krajnja Stanica</div>
                    <div className="cene-polja1">
                      {jednaCena.krajnjaStanicaR}
                    </div>
                    <div className="cene-polja">Cena</div>
                    <div className="cene-polja1">{jednaCena.cenaKarte}</div>
                    <div className="cene-polja">
                      <Link to={`${jednaCena.id}/cene.edit`}>
                        <button className="buttonSwitch">Izmeni</button>
                      </Link>
                    </div>
                    <div className="cene-polja">
                      <button
                        onClick={() => brisanjeCene(jednaCena.id)}
                        className="buttonSwitch"
                      >
                        Obriši
                      </button>
                    </div>
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
