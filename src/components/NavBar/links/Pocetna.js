import React, { useState, useEffect } from "react";
import LinijeApi from "../../../api/linije.api";
import "./pocetna.css";
import helpers from "../../../helpers/helpers";
import { Link } from "react-router-dom";
import bus1 from '../../images/bus1.jpg'
import bus2 from '../../images/bus2.jpg'

const Pocetna = () => {
  const [filteredLinije, setFilteredLinije] = useState([]);
  const [valueDate, setValueDate] = useState("");
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [polasci, setPolasci] = useState([]);
  const [dolasci, setDolasci] = useState([]);
  const [linije, setLinije] = useState([]);

  const filterLinija = async () => {
    if (!valueDate) return;

    const response = await LinijeApi().filterLinija(val1, val2, valueDate);
    const data = await response.json();
    setFilteredLinije(data);
  };

  const getLinije = async () => {
    const response = await fetch("http://localhost:5000/linije/linija"); //izvlacenje svih linija iz baze
    const data = await response.json(); //
    const mestaPolaska = data //
      .map((item) => item.mestoPolaska) //Uradjen filter da se u selektu ne ponavljaju linije
      .filter(helpers.filterUnique); // za mesto polaska
    const mestaDolaska = data //
      .map((item) => item.mestoDolaska) //Uradjen filter da se u selektu ne ponavljaju linije
      .filter(helpers.filterUnique); //za mesto dolaska

    setLinije(data);
    setPolasci(mestaPolaska);
    setDolasci(mestaDolaska);
    setVal1(data[0].mestoPolaska);
    setVal2(data[0].mestoDolaska);
  };

  useEffect(() => {
    //
    getLinije(); //Prilikom ucitavanja stranice da pozove funkciju get linije
  }, []); //

  const click = () => {
    //ovde mozes upit da napravis da li se val 1 sadrzi u dolasci
    // i da li se val 2 sadrzi u polasci
    // primer polasci.includes(val2)

    if (!polasci.includes(val2) || !dolasci.includes(val1)) {
      //zamena mesta polja mesto dolaska i mesto polaska
      return;
    }
    setVal1(val2);
    setVal2(val1);
  };

  const [showClass, setShowClass] = useState(false);

  const changer = () => {
    setShowClass(!showClass);
  };

  const clickBait = (event) => {
    filterLinija();
    changer();
  };


  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bus1, bus2];

  useEffect(() => {
    const interval = setInterval(() => {
      // Promijeni slajd na sledeći
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 10000); // Promjena slike svakih 5 sekundi

    return () => {
      clearInterval(interval); // Očisti interval kad se komponenta unmountuje
    };
  }, []);
  

  let showDate = new Date();
  let displayTodaysDate =
    showDate.getDate() +
    "/" +
    (showDate.getMonth() + 1) +
    "/" +
    showDate.getFullYear;

  const vremePuta = (linija) => {
    const datumPolaska = new Date(linija.datumPolaska);
    const vremePolaska = linija.vremePolaska.split(":");
    datumPolaska.setHours(vremePolaska[0]);
    datumPolaska.setMinutes(vremePolaska[1]);

    const datumDolaska = new Date(linija.datumPolaska);
    const vremeDolaska = linija.vremeDolaska.split(":");
    datumDolaska.setHours(vremeDolaska[0]);
    datumDolaska.setMinutes(vremeDolaska[1]);

    const vremePuta = Math.abs(datumDolaska.getTime() - datumPolaska.getTime());

    const minuti = Math.floor((vremePuta % (1000 * 60 * 60)) / (1000 * 60));
    const sati = Math.floor(vremePuta / (1000 * 60 * 60));

    if (sati < 1) {
      return `${minuti} min`;
    } else {
      const sati1 = `${sati}h`;
      const min = `${minuti}m`;
      return [sati1, min].join(" : ");
    }
  };

  return (
    <div >
      <div className="home-page">
        <h2 className="h2-card">
          <i className="fa fa-bus"></i>
          <span className="span">Pronadjite liniju</span>
        </h2>
        <div className="travel-look">
          <div className="form">
            <label>Polazna stanica</label>
            <select
              className=" box-title"
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
            >
              {polasci.map((linija) => {
                return (
                  <option key={linija} value={linija}>
                    {linija}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form">
            <button
              className="fa-solid fa-repeat buttonSwitch "
              onClick={click}
            ></button>
          </div>
          <div className="form">
            <label>Dolazna stanica</label>
            <select
              className="box-title"
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
            >
              {dolasci.map((linija) => {
                return (
                  <option key={linija} value={linija}>
                    {linija}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form">
            <label>Datum polaska</label>
            <div className="input-date">
              <input
                type="date"
                className="dates"
                value={valueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setValueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-button">
            <button onClick={clickBait} className="buttonSwitch">
              Red voznje
            </button>
          </div>
        </div>
      </div>

      <ul>
        <div className={`home-page1 .home-page1 ${showClass ? "show" : ""}`}>
          {" "}
          {/*kada se pretisne dugme otvorit se nov div sa ispisanim podacima*/}
          <style>{`
            .home-page1 {
              display: none;
            }
            .show {
              display: block;
            }
          `}</style>
          <h2 className="card-header">
            <i className="fa-solid fa-bus"></i>
            <span className="span">Red voznje</span>
          </h2>
          <div className="scroll">
            {filteredLinije.map((linija) => {
              return (
                <li key={linija.id}>
                  <div className="travel">
                    <div className="operator"> {linija.prevoznik}</div>
                    <div className="start">
                      <span className="start-time"> {linija.vremePolaska}</span>
                      <div className="start-destination">
                        {" "}
                        {linija.mestoPolaska}{" "}
                      </div>
                    </div>

                    <div className="travel-time">
                      <div className="time">
                        {/* {linija.vremeDolaska - linija.vremePolaska} */}
                        {vremePuta(linija)}
                      </div>
                      <div className="time-line"></div>
                      <div className="space">broj mesta</div>
                    </div>

                    <div className="end">
                      <div className="end-destination">
                        {" "}
                        {linija.mestoDolaska}
                      </div>
                      <span className="end-time"> {linija.vremeDolaska}</span>
                    </div>
                    <div>
                      <Link to={`${linija.id}/rezervacijakarte`}>
                        <button className="buttonSwitch1">Rezervisi</button>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </div>
        </div>
      </ul>
      <div className="bus-container">
      <img src={slides[currentSlide]} alt="Slideshow" className="bus-image"/>
    </div>
    </div>
  );
};

export default Pocetna;
