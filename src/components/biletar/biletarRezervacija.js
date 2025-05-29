import React from "react";
import { useLocation, useParams } from "react-router-dom";
import BiletarRezervacijaComponent from "./biletarRezervacijaComponent";

const BiletarRezervacija = () => {
  //?dobijanje id-a preko url-a
  const { id } = useParams();

  //?primanje podataka sa pocetne za bas odredjenu liniju
  const location = useLocation();
  const state = location.state;

  //? prosledjivanje podataka na rezervaciju id i podatke
  return (
    <>
      <BiletarRezervacijaComponent state={state} />
    </>
  );
};

export default BiletarRezervacija;
