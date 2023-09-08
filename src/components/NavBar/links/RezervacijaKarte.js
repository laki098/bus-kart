import React from "react";
import { useParams } from "react-router-dom";
import RezervacijaKarteComponents from "../../rezervacije/rezervacija.component";
import { useLocation } from "react-router-dom";

const RezervacijaKarte = () => {
  //?dobijanje id-a preko url-a
  const { id } = useParams();
  //?primanje podataka sa pocetne za bas odredjenu liniju
  const location = useLocation();
  const state = location.state;

  return (
    <>
      //? prosledjivanje podataka na rezervaciju id i podatke
      <RezervacijaKarteComponents id={id} state={state} />
    </>
  );
};

export default RezervacijaKarte;
