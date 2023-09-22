import React, { useEffect, useState } from "react";
import Autobus from "../rezervacije/sedista/autobus";

const Stjuardesa = () => {

  const [stjuardesaLinija, setStjuardesaLinija] = useState([]);
  
  const getStjuardesaLinija = async () => {
    const response = await fetch("http://localhost:5000/linija");
    const data = await response.json();
    setStjuardesaLinija(data.linija);
  };

  console.log(stjuardesaLinija)
  
  useEffect(() => {
    getStjuardesaLinija();
  }, []);
  return (
    <>
    <div> 
      <h1>Aktivne linije:</h1>
    <ul>
      {stjuardesaLinija.map((linija) => (
        <div><li ><>{linija.stjuardesa}</></li></div>
        
      ))}
    </ul>
    </div>
      <Autobus />
    </>
  );
};
export default Stjuardesa;
