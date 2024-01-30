import React, { useState, useEffect } from "react";

const ListajJSON_Konzola = ({
  valueDate,
  period,
  setSelectedPeriodFromList,
  setGeneratedDateList,
}) => {
  const [izabraniDatum, setIzabraniDatum] = useState(new Date(valueDate));
  const [datumi, setDatumi] = useState([]);

  useEffect(() => {
    setIzabraniDatum(new Date(valueDate));
  }, [valueDate]);

  useEffect(() => {
    const generisiDatumeNovo = (pocetak, kraj) => {
      const datumi = [];
      let trenutniDatum = new Date(pocetak);

      while (trenutniDatum <= kraj) {
        datumi.push(new Date(trenutniDatum));
        trenutniDatum.setDate(trenutniDatum.getDate() + 1);
      }

      return datumi;
    };

    const datumZaPrikaz = new Date(izabraniDatum);
    const krajPerioda = new Date(datumZaPrikaz);
    krajPerioda.setMonth(datumZaPrikaz.getMonth() + period);

    const generisaniDatumi = generisiDatumeNovo(datumZaPrikaz, krajPerioda);

    // Formatiranje datuma u "DD/MM/YYYY"
    const formatiraniDatumi = generisaniDatumi.map((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Dodavanje nule ispred jednocifrenih meseci
      const day = String(date.getDate()).padStart(2, "0"); // Dodavanje nule ispred jednocifrenih dana
      return `${year}-${month}-${day}`;
    });

    setDatumi(formatiraniDatumi);
    setGeneratedDateList(formatiraniDatumi);

    /*  // Prikaz niza datuma u konzoli kao JSON string
    console.log("Lista datuma u JSON formatu:");
    console.log(JSON.stringify(formatiraniDatumi, null, 2)); */

    // Postavljanje perioda u ViseLinija komponenti
    setSelectedPeriodFromList(period);
  }, [izabraniDatum, period, setSelectedPeriodFromList, setGeneratedDateList]);

  return <div></div>;
};

export default ListajJSON_Konzola;
