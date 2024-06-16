import React, { useState, useEffect } from "react";

const ListajJSON_Konzola = ({
  currentClickedLinija,
  weeklyStates,
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
      console.log(weeklyStates[currentClickedLinija]);
      if (weeklyStates[currentClickedLinija]) {
        const brojNedelja = period * 4; // Broj nedelja u periodu
        for (let i = 0; i < brojNedelja; i++) {
          const formattedDate = trenutniDatum.toISOString().substring(0, 10); // Dobijamo samo YYYY-MM-DD
          datumi.push(new Date(formattedDate));
          trenutniDatum.setDate(trenutniDatum.getDate() + 7); // Dodajemo 7 dana
        }
      } else {
        while (trenutniDatum <= kraj) {
          datumi.push(new Date(trenutniDatum));
          trenutniDatum.setDate(trenutniDatum.getDate() + 1);
        }
      }

      return datumi;
    };

    const datumZaPrikaz = new Date(izabraniDatum);
    const krajPerioda = new Date(datumZaPrikaz);
    krajPerioda.setMonth(datumZaPrikaz.getMonth() + period);

    const generisaniDatumi = generisiDatumeNovo(datumZaPrikaz, krajPerioda);

    // Formatiranje datuma u "YYYY-MM-DD"
    const formatiraniDatumi = generisaniDatumi.map((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Dodavanje nule ispred jednocifrenih meseci
      const day = String(date.getDate()).padStart(2, "0"); // Dodavanje nule ispred jednocifrenih dana
      return `${year}-${month}-${day}`;
    });

    // console.log(formatiraniDatumi);

    setDatumi(formatiraniDatumi);
    setGeneratedDateList(formatiraniDatumi);

    // Postavljanje perioda u ViseLinija komponenti
    setSelectedPeriodFromList(period);
  }, [
    currentClickedLinija,
    izabraniDatum,
    weeklyStates,
    period,
    setGeneratedDateList,
  ]);

  return null; // Nema potrebe za prikazom unutar ove komponente
};

export default ListajJSON_Konzola;
