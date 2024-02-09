import React, { useEffect, useState } from "react";
import LinijeApi from "../../api/linije.api";
import AdminLogic from "./admin.logic";
import { Link } from "react-router-dom";
import "./admin.css";
import apiUrl from "../../apiConfig";

import classes from "../registration/registration.module.css";
import "../login/loginStyle.css";

import "../NavBar/links/i18n"; // za prevodjenje
import "../rezervacije/i18n";
import { useTranslation, Trans } from "react-i18next"; //prevodjenje

const AdminInitial = () => {
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [val1, setVal1] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [val2, setVal2] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [stanice, setStanice] = useState([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [lineToDelete, setLineToDelete] = useState(null);
  

  const getStanice = async () => {
    const response = await fetch(`${apiUrl}/stanica`);
    const data = await response.json();

    const a1 = data.stanice.map((item) => {
      return { naziv: item.naziv, id: item.id };
    });
    setStanice(a1);
    setVal1(a1[0].naziv);
    setVal2(a1[1].naziv);
  };

  const filterLinija = async () => {
    if (!valueDate) return;
    const response = await LinijeApi().filterLinija(val1, val2, valueDate);
    const data = await response.json();
    setFilteredLinije(data.rezultat);
  };

  useEffect(() => {
    getStanice();
  }, []);

  useEffect(() => {
    if (!valueDate) {
      setValueDate(today);
    }
  }, [today, valueDate]);

  const adminLogic = AdminLogic();

  const [showClass, setShowClass] = useState(false);

  const changer = () => {
    setShowClass(!showClass);
  };

  const clickButton = async (event) => {
    await filterLinija();
    changer();
  };

  const brisanjeLinije = async (id) => {
    setLineToDelete(id);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (lineToDelete !== null) {
      await adminLogic.brisanjeLinije(lineToDelete);
      const updatedLinije = filteredLinije.filter(
        (linija) => linija.id !== lineToDelete
      );
      setFilteredLinije(updatedLinije);
    }
    setIsDeleteConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setLineToDelete(null);
    setIsDeleteConfirmationOpen(false);
  };

  const lngs = {
    en: { nativeName: "Engleski" },
    de: { nativeName: "Srpski" },
  };
  const { t, i18n } = useTranslation();

  return (
    <div>
      <header>
        <div className="jezici">
          {Object.keys(lngs).map((lng) => (
            <button
              key={lng}
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

      <div className="admin-initial-polje admin-initial-polje-izmena ">
        <div className="admin-centar">
          <label className="admin-labela">
            <Trans i18nKey="description.part3">Mesto polaska:</Trans>
          </label>
          <br />
          <select
  className="position unos"
  value={val1 || null}
  onChange={(e) => setVal1(e.target.value)}
>
  <option className="medjustanica" value={null} disabled selected>
    Izaberite liniju
  </option>
  {stanice.map((stanica) => (
    <option key={stanica.id} value={stanica.naziv}>
      {stanica.naziv}
    </option>
  ))}
</select>
        </div>
        <div className="admin-centar">
          <label className="admin-labela">
            <Trans i18nKey="description.part5">Mesto Dolaska:</Trans>
          </label>
          <br />
          <select
            className="position unos"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
          >
            <option className="medjustanica" value="" disabled selected>
          Izaberite liniju
        </option>
            {stanice.map((stanica) => (
              <option key={stanica.id} value={stanica.naziv}>
                {stanica.naziv}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-centar">
          <label className="admin-labela">
            <Trans i18nKey="description.part9">Datum polaska</Trans>
          </label>
          <br />
          <input
            type="date"
            className="position unos"
            value={valueDate || today}
            min={today}
            onChange={(e) => setValueDate(e.target.value)}
          />
        </div>
        <div className="red-05"></div>
        <button className={classes.submit} onClick={clickButton}>
          <p className="admin-slovaDugme">
            <Trans i18nKey="description.part34">Red vožnje</Trans>
          </p>
        </button>
        <Link to="/admin.component">
          <button className={classes.submit}>
            <p className="admin-slovaDugme">
              <Trans i18nKey="description.part37">Dododavanje linije</Trans>
            </p>
          </button>
        </Link>
        <Link to="/viseLinija">
          <button className={classes.submit}>
            <p className="admin-slovaDugme">
              <Trans i18nKey="">Produzetak linije</Trans>
            </p>
          </button>
        </Link>
      </div>

      {filteredLinije.length > 0 ? (
        <div>
          <ul>
            <div
              className={`admin-tebela .admin-tebela ${
                showClass ? "show" : ""
              }`}
            >
              <style>{`
                .admin-tebela {
                  display: none;
                }
                .show {
                  display: block;
                }
              `}</style>
              {filteredLinije.map((linija) => (
                <li key={linija.id}>
                  <div className="admin-jedan-red">
                    <div className="polje-stanica">
                      <Trans i18nKey="description.part3">
                        Mesto polaska{" "}
                      </Trans>
                    </div>
                    <div className="info-stanica-1">
                      {linija.pocetnaStanica}
                    </div>
                    <div className="polje-stanica">
                      <Trans i18nKey="description.part11">
                        Vreme polaska{" "}
                      </Trans>
                    </div>
                    <div className="info-stanica">
                      {linija.vremePolaska}
                    </div>
                    <div className="polje-stanica">
                      <Trans i18nKey="description.part13">
                        Vreme dolaska
                      </Trans>
                    </div>
                    <div className="info-stanica">{linija.vremeDolaska}</div>
                    <div className="polje-stanica">
                      <Trans i18nKey="description.part5">
                        Mesto dolaska{" "}
                      </Trans>
                    </div>
                    <div className="info-stanica-1">
                      {linija.krajnjaStanica}
                    </div>
                    <Link
                      to={{
                        pathname: `${linija.id}/admin.change.line`,
                        state: {
                          id: linija.id,
                          vremePolaska: linija.vremePolaska,
                          pocetnaStanica: linija.pocetnaStanica,
                          krajnjaStanica: linija.krajnjaStanica,
                          vremeDolaska: linija.vremeDolaska,
                          datumPolaska: linija.datumPolaska,
                          datumDolaska: linija.datumDolaska,
                          oznakaBusa: linija.oznakaBusa,
                        },
                      }}
                    >
                      <div className="polje-stanica">
                        <button className={classes.submit}>
                          <p className="admin-dugme-slova">
                            <Trans i18nKey="description.part133">Uredi</Trans>
                          </p>
                        </button>
                      </div>
                    </Link>
                    <div className="polje-stanica">
                      <button
                        onClick={() => brisanjeLinije(linija.id)}
                        className={classes.submit}
                      >
                        <p className="admin-dugme-slova">
                          <Trans i18nKey="description.part134">Obriši</Trans>
                        </p>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </div>
      ) : (
        <p>
          <Trans i18nKey="description.part135">Nema Linije...</Trans>
        </p>
      )}
      <div className="confirm-dialog-container">
        {isDeleteConfirmationOpen && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-box">
              <div className="red-05">
                <Trans i18nKey="description.part155">
                  Da li ste sigurni da želite da obrišete ovog korisnika?{" "}
                </Trans>
              </div>
              <button className="confirm-dialog-yes" onClick={confirmDelete}>
                <Trans i18nKey="description.part153">Da </Trans>
              </button>
              <button className="confirm-dialog-no" onClick={cancelDelete}>
                <Trans i18nKey="description.part154"> Ne </Trans>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInitial;