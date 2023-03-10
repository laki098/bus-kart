import React from "react";
import { useParams } from "react-router-dom";
import RezervacijaKarteComponents from "../../rezervacije/rezervacija.component";

const RezervacijaKarte = () => {
  const { id } = useParams();
  console.log(typeof id);
  return (
    <>
      <RezervacijaKarteComponents id={id} />
    </>
  );
};

export default RezervacijaKarte;
