import { React, useState } from "react";
import "./index1.css";

import classes from "./RezervacijaKarte.module.css";

const VrstaKarte = () => {
  const [userinfo, setUserInfo] = useState({
    vrsta: [],
    odabrano: [],
  });

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const { vrsta } = userinfo;

    console.log(`${value} is ${checked}`);

    if (checked) {
      setUserInfo({
        vrsta: [...vrsta, value],
        odabrano: [...vrsta, value],
      });
    } else {
      setUserInfo({
        vrsta: vrsta.filter((e) => e !== value),
        odabrano: vrsta.filter((e) => e !== value),
      });
    }
  };

  const [jednosmerna, setJednosmerna] = useState(false);
  const [povratna, setPovratna] = useState(false);
  const [studentska, setStudenstska] = useState(false);
  const [besplatna, setBesplatna] = useState(false);
  const [nedeljna, setNedeljna] = useState(false);
  const [vikend, setVikend] = useState(false);

  const handleOnChange = () => {
    {
      /* setJednosmerna(!jednosmerna);
        setPovratna(!povratna);
        setStudenstska(!studentska);
        setBesplatna(!besplatna);
        setNedeljna(!nedeljna);
        setVikend(!vikend);
        */
    }
    // alert("Neku vrstu karte si sada odabrao i to je : !");
    //alert({checked ? "checked" : "un-checked"});
  };

  return (
    <form className={classes.form}>
      <div style={{ textAlign: "left" }} className="tableNova">
        <h2>Vrsta karte</h2>
        <br />
        <input
          type="checkbox"
          id="flexCheckDefault"
          name="vrstaKarte"
          value="jednosmerna"
          /*checked={jednosmerna}*/ onChange={handleOnChange}
        />
        &emsp;Jednosmerna <br />
        <input
          type="checkbox"
          id="flexCheckDefault"
          name="vrstaKarte"
          value="povratna"
          /*checked={povratna}*/ onChange={handleOnChange}
        />
        &emsp;Povratna <br />
        <input
          type="checkbox"
          id="vrstaKarte3"
          name="vrstaKarte"
          value="studentska"
          /*checked={studentska}*/ onChange={handleOnChange}
        />
        &emsp;Studentska <br />
        <input
          type="checkbox"
          id="vrstaKarte4"
          name="vrstaKarte"
          value="besplatna"
          /*checked={besplatna}*/ onChange={handleOnChange}
        />
        &emsp;Besplatna
        <br />
        <input
          type="checkbox"
          id="vrstaKarte5"
          name="vrstaKarte"
          value="nedeljna"
          /*checked={nedeljna}*/ onChange={handleOnChange}
        />
        &emsp;Nedeljna
        <br />
        <input
          type="checkbox"
          id="vrstaKarte6"
          name="vrstaKarte"
          value="vikend"
          /*checked={vikend}*/ onChange={handleOnChange}
        />
        &emsp;Vikend <br />
        <br />
        <button className={classes.submit} onClick={handleOnChange}>
          Potvrđujem
        </button>{" "}
        <button className={classes.submit}>Odustajem</button>
      </div>
      <div></div>

      {/*    <div>
            <textarea
                name="odabrano"
                value={userinfo.odabrano}
                placeholder="Vi ste izabrali kartu "
                id="floatingTextarea2"
                style={{ height: "50px" }}
                onChange={handleChange} >
            </textarea>
            </div>
    */}
    </form>
  );
};
export default VrstaKarte;
