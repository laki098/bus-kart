import React from "react";
import { useParams } from "react-router-dom";
import RezervacijaKarteComponents from "../../rezervacije/rezervacija.component";
import { useLocation } from "react-router-dom";

const RezervacijaKarte = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state;
  console.log(state);

  return (
    <>
      <RezervacijaKarteComponents id={id} state={state} />
    </>
  );
};

export default RezervacijaKarte;
