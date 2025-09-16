import React, { useEffect, useState } from "react";
import apiUrl from "../../../apiConfig";
import ListajJSON_Konzola from "../ListajJSON_Konzola";

import "../../admin/viseLinija/viseLinija.css"; // ⬅️ u ovaj fajl nalepi CSS ispod
import { ToastContainer, toast } from "react-toastify";

import "../../NavBar/links/i18n";
import "../../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next";
import LanguageSwitcher from "../../header/header";

const ViseLinija = () => {
  const [linije, setLinije] = useState([]);
  const [period, setPeriod] = useState(0);
  const [valueDate, setValueDate] = useState("");
  const [selectedLinija, setSelectedLinija] = useState(null);
  const [selectedPeriodFromList, setSelectedPeriodFromList] = useState(null);
  const [generatedDateList, setGeneratedDateList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [weeklyStates, setWeeklyStates] = useState({});
  const [currentClickedLinija, setCurrentClickedLinija] = useState({});

  const getLinije = async () => {
    const response = await fetch(`${apiUrl}/linija/filtriraneLinije`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setLinije(data.filtriraneLinije);
  };

  const creiranjeViseLinija = async () => {
    if (!selectedLinija) return;
    if (!selectedPeriodFromList) return;
    if (!generatedDateList.length) return;

    const pocetnaStanica = selectedLinija.pocetnaStanica.naziv;
    const krajnjaStanica = selectedLinija.krajnjaStanica.naziv;
    const vremePolaska = selectedLinija.vremePolaska;
    const vremeDolaska = selectedLinija.vremeDolaska;

    const medjustanice = selectedLinija.Stanicas.map((m) => ({
      stanica: m.naziv,
      vremePolaskaM: m.Medjustanica.vremePolaskaM,
      vremeDolaskaM: m.Medjustanica.vremeDolaskaM,
      datumPolaskaM: "2023-12-26",
      datumDolaskaM: "2023-12-26",
      pocetakRute: m.pocetakRute,
      krajRute: m.krajRute,
    }));

    const dataToSend = {
      pocetnaStanica,
      medjustanice,
      krajnjaStanica,
      vremePolaska,
      vremeDolaska,
      datumPolaska: generatedDateList.slice(),
      datumDolaska: generatedDateList.slice(),
      oznakaBusa: selectedLinija.oznakaBusa,
      pocetakRute: null,
      krajRute: null,
      stjuardesa: "",
      vozac: "",
    };

    try {
      await fetch(`${apiUrl}/linija`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
    } catch (error) {
      console.error("Greška prilikom slanja zahteva:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setWeeklyStates((prev) => ({ ...prev, [id]: !prev[id] }));
    setCurrentClickedLinija(id);
  };

  useEffect(() => {
    getLinije();
  }, []);

  const openConfirmationDialog = () => setIsConfirmationOpen(true);
  const closeConfirmationDialog = () => setIsConfirmationOpen(false);
  const confirmAction = () => {
    closeConfirmationDialog();
    notifySuccest();
    creiranjeViseLinija();
  };

  const submitHandler = (e) => e.preventDefault();

  const notifySuccest = () =>
    toast.success("Uspešno ste produžili liniju", {
      position: "top-center",
      autoClose: 5000,
      theme: "light",
    });

  const handleDateChange = (e) => {
    setValueDate(e.target.value);
    setIsButtonDisabled(false);
  };

  const lngs = { en: { nativeName: "En" }, sr: { nativeName: "Sr" } };
  const { i18n } = useTranslation();

  return (
    <>
      <LanguageSwitcher lngs={lngs} i18n={i18n} />

      <form onSubmit={submitHandler}>
        <div className="extendLines-wrap">
          {linije.map((linija) => (
            <div className="extendLines-card" key={linija.id}>
              <div className="extendLines-row">
                <div className="extendLines-chipLabel">
                  <Trans i18nKey="description.part31">Početna stanica</Trans>
                </div>
                <div className="extendLines-chipValue">
                  {linija.pocetnaStanica.naziv}
                </div>

                <div className="extendLines-chipLabel">
                  <Trans i18nKey="description.part11">Vreme polaska</Trans>
                </div>
                <div className="extendLines-chipValue">
                  {linija.vremePolaska.split(":").slice(0, 2).join(":")}
                </div>

                <div className="extendLines-chipLabel">
                  <Trans i18nKey="description.part198">Krajnja stanica</Trans>
                </div>
                <div className="extendLines-chipValue">
                  {linija.krajnjaStanica.naziv}
                </div>

                {/* Datum (input) */}
                <div className="extendLines-inputCell">
                  <input
                    type="date"
                    className="extendLines-input extendLines-input--date"
                    value={
                      setValueDate[linija.id]
                    } /* ostavljeno kako je u tvom kodu */
                    onChange={handleDateChange}
                  />
                </div>

                {/* Međustanice */}
                {linija.Stanicas.map((m) => (
                  <React.Fragment key={m.id}>
                    <div className="extendLines-chipLabel">
                      <Trans i18nKey="description.part204">Međustanica</Trans>
                    </div>
                    <div className="extendLines-chipValue">{m.naziv}</div>
                  </React.Fragment>
                ))}
              </div>

              {/* Akcije */}
              <div className="extendLines-actions">
                <button
                  className="extendLines-btn extendLines-btn--primary"
                  disabled={isButtonDisabled}
                  onClick={() => {
                    setSelectedLinija(linija);
                    setPeriod(1);
                    setSelectedPeriodFromList(1);
                    openConfirmationDialog();
                  }}
                >
                  <Trans i18nKey="description.part205">1 mesec</Trans>
                </button>

                <button
                  className="extendLines-btn extendLines-btn--primary"
                  disabled={isButtonDisabled}
                  onClick={() => {
                    setSelectedLinija(linija);
                    setPeriod(3);
                    setSelectedPeriodFromList(3);
                    openConfirmationDialog();
                  }}
                >
                  <Trans i18nKey="description.part206">3 meseci</Trans>
                </button>

                <button
                  className="extendLines-btn extendLines-btn--primary"
                  disabled={isButtonDisabled}
                  onClick={() => {
                    setSelectedLinija(linija);
                    setPeriod(6);
                    setSelectedPeriodFromList(6);
                    openConfirmationDialog();
                  }}
                >
                  <Trans i18nKey="description.part207">6 meseci</Trans>
                </button>

                <label className="extendLines-weekly">
                  <input
                    type="checkbox"
                    checked={weeklyStates[linija.id] || false}
                    onChange={() => handleCheckboxChange(linija.id)}
                  />
                  <span>Generiši datume svakih 7 dana</span>
                </label>
              </div>

              {/* Helper za generisanje datuma */}
              <ListajJSON_Konzola
                currentClickedLinija={currentClickedLinija}
                weeklyStates={weeklyStates}
                valueDate={valueDate}
                period={period}
                setSelectedPeriodFromList={setSelectedPeriodFromList}
                setGeneratedDateList={setGeneratedDateList}
              />
            </div>
          ))}
        </div>

        {/* Potvrda */}
        <div className="confirm-dialog-container">
          {isConfirmationOpen && (
            <div className="confirm-dialog-overlay">
              <div className="confirm-dialog-box">
                <div className="red-05">
                  Da li ste sigurni da želite produžiti liniju?
                </div>
                <button className="confirm-dialog-yes" onClick={confirmAction}>
                  <Trans i18nKey="description.part153">Da</Trans>
                </button>
                <button
                  className="confirm-dialog-no"
                  onClick={closeConfirmationDialog}
                >
                  <Trans i18nKey="description.part154">Ne</Trans>
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
