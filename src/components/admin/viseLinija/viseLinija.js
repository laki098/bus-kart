import React, { useEffect, useState } from "react";
import apiUrl from "../../../apiConfig";
import ListajJSON_Konzola from "../ListajJSON_Konzola";
import "../../admin/viseLinija/viseLinija.css";
import { ToastContainer, toast } from "react-toastify";

const ViseLinija = () => {
  const [linije, setLinije] = useState([]);
  const [period, setPeriod] = useState(0);
  const [valueDate, setValueDate] = useState("");
  const [selectedLinija, setSelectedLinija] = useState(null);
  const [selectedPeriodFromList, setSelectedPeriodFromList] = useState(null);
  const [generatedDateList, setGeneratedDateList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  
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

  const creiranjeViseLinija = async () => {
    if (!selectedLinija) {
      console.error("Nisu odabrana linija");
      return;
    }
    if (!selectedPeriodFromList) {
      console.error("Nisu odabrana  period ");
      return;
    }
    if (!generatedDateList.length) {
      console.error("Nisu odabrana  nema generisanih datuma.");
      return;
    }

    console.log(selectedLinija, generatedDateList);
    const pocetnaStanica = selectedLinija.pocetnaStanica.naziv;
    const krajnjaStanica = selectedLinija.krajnjaStanica.naziv;
    const vremePolaska = selectedLinija.vremePolaska;
    const vremeDolaska = selectedLinija.vremeDolaska;

    // Prikupljanje medjustanica sa vremenima
    const medjustanice = selectedLinija.Stanicas.map((medjustanica) => ({
      stanica: medjustanica.naziv,
      vremePolaskaM: selectedLinija.vremePolaska,
      vremeDolaskaM: selectedLinija.vremeDolaska,
      datumPolaskaM: "2023-12-26", // Postavite datum kako vam odgovara
      datumDolaskaM: "2023-12-26", // Postavite datum kako vam odgovara
      pocetakRute: medjustanica.pocetakRute,
      krajRute: medjustanica.krajRute,
    }));

    const oznakaBusa = selectedLinija.oznakaBusa;
    const pocetakRute = null;
    const krajRute = null;
    const stjuardesa = "";
    const vozac = "";

    const dataToSend = {
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska: generatedDateList.slice(1),
      datumDolaska: generatedDateList.slice(1),
      oznakaBusa,
      pocetakRute,
      krajRute,
      stjuardesa,
      vozac,
    };

    try {
      const response = await fetch(`${apiUrl}/linija`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Dodajte logiku za obradu odgovora servera ako je potrebno...
    } catch (error) {
      console.error("Greška prilikom slanja zahteva:", error);
    }
  };

  useEffect(() => {
    creiranjeViseLinija();
  }, [selectedLinija, generatedDateList, selectedPeriodFromList]);

  useEffect(() => {
    getLinije();
  }, []);


  const openConfirmationDialog = () => {
    setIsConfirmationOpen(true);
  };
  
  const closeConfirmationDialog = () => {
    setIsConfirmationOpen(false);
  };
  
  const confirmAction = () => {
    // Ovdje možete implementirati logiku za akciju nakon potvrde, ako je potrebno
    closeConfirmationDialog(); // Zatvori dijalog nakon potvrde
    notifySuccest();
    setTimeout(() => {
      window.location.href = "/admin.initial"; 
    }, 2500);
  };


  const submitHandler = (event) => {
    event.preventDefault();
  }

  const notifySuccest = () => {
    toast.success("Uspešno ste produžili liniju", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };


  const handleDateChange = (e) => {
    setValueDate(e.target.value);
    // Omogućite dugme ako je izabran datum
    setIsButtonDisabled(false);
  };
  
  

  return (
    <>
    <form onSubmit={submitHandler}>
    <div className="linija-okvir">
      {linije.map((linija) => (
        <div key={linija.id}>
          <div className="linija-red">
            <div className="linija-polja">Pocetna stanica </div>
            <div className="linija-info">{linija.pocetnaStanica.naziv}</div>
            <div className="linija-polja">Krajnja stanica </div>
            <div className="linija-info">{linija.krajnjaStanica.naziv}</div>
            <input
              type="date"
              value={setValueDate[linija.id] }
              onChange={handleDateChange}
            />

            {linija.Stanicas.map((medjustanica) => (
              <React.Fragment key={medjustanica.id}>
                <div className="linija-polja">Medjustanica</div>
                <div className="linija-info">{medjustanica.naziv}</div>
              </React.Fragment>
            ))}
            <div className="linija-dugme">
              <button
                className="button-linija"
                disabled={isButtonDisabled}
                onClick={() => {
                  setSelectedLinija(linija);
                  setPeriod(1);
                  setSelectedPeriodFromList(1);
                  creiranjeViseLinija();
                   openConfirmationDialog();
                }}
              >
                1 mesec
              </button>{" "}
              &emsp;
              <button
                className="button-linija"
                disabled={isButtonDisabled}
                onClick={() => {
                  setSelectedLinija(linija);
                  setPeriod(3);
                  setSelectedPeriodFromList(3);
                  creiranjeViseLinija();
                  openConfirmationDialog();
                }}
              >
                3 meseci
              </button>{" "}
              &emsp;
              <button
                className="button-linija"
                disabled={isButtonDisabled}
                onClick={() => {
                  setSelectedLinija(linija);
                  setPeriod(6);
                  setSelectedPeriodFromList(6);
                  creiranjeViseLinija();
                  openConfirmationDialog();
                }}
              >
                6 meseci
              </button>
            </div>
            <ListajJSON_Konzola
              valueDate={valueDate}
              period={period}
              setSelectedPeriodFromList={setSelectedPeriodFromList}
              setGeneratedDateList={setGeneratedDateList}
            />
          </div>
        </div>
      ))}
      
    </div>
    <div className="confirm-dialog-container">
  {isConfirmationOpen && (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-box">
        <div className="red-05">
          Da li ste sigurni da želite produžiti liniju?
        </div>
        <button className="confirm-dialog-yes" onClick={confirmAction}>
          Da
        </button>
        <button className="confirm-dialog-no" onClick={closeConfirmationDialog}>
          Ne
        </button>
      </div>
    </div>
  )}
</div>
    </form>
    <ToastContainer/>
    </>
  );
};

export default ViseLinija;
