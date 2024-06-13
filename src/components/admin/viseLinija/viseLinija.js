import React, { useEffect, useState } from "react";
import apiUrl from "../../../apiConfig";
import ListajJSON_Konzola from "../ListajJSON_Konzola";
import "../../admin/viseLinija/viseLinija.css";
import { ToastContainer, toast } from "react-toastify";

import "../../NavBar/links/i18n"; // za prevodjenje
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

const ViseLinija = () => {
  const [linije, setLinije] = useState([]);
  const [period, setPeriod] = useState(0);
  const [valueDate, setValueDate] = useState("");
  const [selectedLinija, setSelectedLinija] = useState(null);
  const [selectedPeriodFromList, setSelectedPeriodFromList] = useState(null);
  const [generatedDateList, setGeneratedDateList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [weeklyStates, setWeeklyStates] = useState({}); //? Stanje za sve checkboxove

  const [startDate, setStartDate] = useState(new Date());
  const [dateList, setDateList] = useState([]);

  console.log(dateList);

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

    const pocetnaStanica = selectedLinija.pocetnaStanica.naziv;
    const krajnjaStanica = selectedLinija.krajnjaStanica.naziv;
    const vremePolaska = selectedLinija.vremePolaska;
    const vremeDolaska = selectedLinija.vremeDolaska;

    // Prikupljanje medjustanica sa vremenima
    const medjustanice = selectedLinija.Stanicas.map((medjustanica) => ({
      stanica: medjustanica.naziv,
      vremePolaskaM: medjustanica.Medjustanica.vremePolaskaM,
      vremeDolaskaM: medjustanica.Medjustanica.vremeDolaskaM,
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
      datumPolaska: generatedDateList.slice(),
      datumDolaska: generatedDateList.slice(),
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

  //? za stanje chackBoxa 7 dana kreiranje datuma(produzetak linije)
  const handleCheckboxChange = (id) => {
    setWeeklyStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  /* useEffect(() => {
    creiranjeViseLinija();
  }, [selectedLinija, generatedDateList, selectedPeriodFromList]); */

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
    creiranjeViseLinija();
    setTimeout(() => {
      window.location.href = "/admin.initial";
    }, 2500);
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

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

  const lngs = {
    en: { nativeName: "En" },
    sr: { nativeName: "Sr" },
  };
  const { t, i18n } = useTranslation();

  return (
    <>
      <header>
        <div className="jezici">
          {Object.keys(lngs).map((lng) => (
            <button
              key={lng}
              className="jezici-dugme-promena"
              style={{
                fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
              }}
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
      </header>

      <form onSubmit={submitHandler}>
        <div className="linija-okvir">
          {linije.map((linija) => (
            <div key={linija.id}>
              <div className="linija-red">
                <div className="linija-polja">
                  <Trans i18nKey="description.part31">Početna stanica </Trans>
                </div>
                <div className="linija-info">{linija.pocetnaStanica.naziv}</div>
                <div className="linija-polja">
                  <Trans i18nKey="description.part198">Krajnja stanica </Trans>
                </div>
                <div className="linija-info">{linija.krajnjaStanica.naziv}</div>
                <div className="linija-polja">
                  <input
                    type="date"
                    className="unos-datuma"
                    value={setValueDate[linija.id]}
                    onChange={handleDateChange}
                  />
                </div>

                {linija.Stanicas.map((medjustanica) => (
                  <React.Fragment key={medjustanica.id}>
                    <div className="linija-polja-10">
                      <Trans i18nKey="description.part204"> Međustanica </Trans>
                    </div>
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
                    <Trans i18nKey="description.part205"> 1 mesec </Trans>
                  </button>{" "}
                  &emsp;
                  <button
                    className="button-linija"
                    disabled={isButtonDisabled}
                    onClick={() => {
                      setSelectedLinija(linija);
                      setPeriod(3);
                      setSelectedPeriodFromList(3);
                      openConfirmationDialog();
                    }}
                  >
                    <Trans i18nKey="description.part206"> 3 meseci </Trans>
                  </button>{" "}
                  &emsp;
                  <button
                    className="button-linija"
                    disabled={isButtonDisabled}
                    onClick={() => {
                      setSelectedLinija(linija);
                      setPeriod(6);
                      setSelectedPeriodFromList(6);
                      openConfirmationDialog();
                    }}
                  >
                    <Trans i18nKey="description.part207"> 6 meseci </Trans>
                  </button>
                  <label>
                    <input
                      type="checkbox"
                      checked={weeklyStates[linija.id] || false}
                      onChange={() => handleCheckboxChange(linija.id)}
                    />
                    Generisi datume svakih 7 dana
                  </label>
                </div>
                <ListajJSON_Konzola
                  valueDate={valueDate}
                  period={period}
                  setSelectedPeriodFromList={setSelectedPeriodFromList}
                  setGeneratedDateList={setGeneratedDateList}
                  isWeekly={weeklyStates[linija.id] || false}
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
                  <Trans i18nKey="description.part153"> Da </Trans>
                </button>
                <button
                  className="confirm-dialog-no"
                  onClick={closeConfirmationDialog}
                >
                  <Trans i18nKey="description.part154"> Ne </Trans>
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default ViseLinija;
