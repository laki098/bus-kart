import React, { useState, useEffect } from "react";

const ListajPeriodDatuma = ({ valueDate, period }) => {
    const [izabraniDatum, setIzabraniDatum] = useState(new Date(valueDate));
    const [za1Mesec, setZa1Mesec]=useState('');
    const [za3Meseci, setZa3Meseci]=useState('');
    const [za6Meseci, setZa6Meseci]=useState('');

    const [datumi_1, setDatumi_1] = useState([]);   // lista datuma za 1 mesec
    const [datumi_3, setDatumi_3] = useState([]);   // lista datuma za 3 meseci
    const [datumi_6, setDatumi_6] = useState([]);   // lista datuma za 6 meseci

    const [kraj1, setKraj1]=useState('');

    const formatirajDatumKonzola = (datum) => {
        const godina = datum.getFullYear();
        const mesec = (datum.getMonth() + 1).toString().padStart(2, '0'); // Dodajte nulu ispred jednocifrenih meseci
        const dan = datum.getDate().toString().padStart(2, '0'); // Dodajte nulu ispred jednocifrenih dana
        return `${godina}-${mesec}-${dan}`;
    };

    const generisiDatumeNovo = (pocetak, kraj) => {
        const datumi = [];
        let trenutniDatum = new Date(pocetak);
      
        while (trenutniDatum <= kraj) {
          datumi.push(new Date(trenutniDatum));
          trenutniDatum.setDate(trenutniDatum.getDate() + 1);
        }
      
        return datumi;
    };

    useEffect(() => {
        // Ažuriraj izabraniDatum kada se valueDate promeni
        setIzabraniDatum(new Date(valueDate));
    }, [valueDate]);

    useEffect(() => {       
        const datumZa1Mesec = new Date(izabraniDatum);
        datumZa1Mesec.setMonth(datumZa1Mesec.getMonth() + 1); // Dodaj 1 mesec
        const datumiKroz1Mesec = generisiDatumeNovo(izabraniDatum, datumZa1Mesec);//ovo je bitno za stampanje
        setDatumi_1(datumiKroz1Mesec);  // ovo je bitno za stampanje liste datuma
        setZa1Mesec(datumZa1Mesec.toDateString());
    
        const datumZa3Meseci = new Date(izabraniDatum);
        datumZa3Meseci.setMonth(datumZa3Meseci.getMonth() + 3); // Dodaj 3 meseci
        const datumiKroz3Meseci=generisiDatumeNovo(izabraniDatum, datumZa3Meseci); //priprema za stampu
        setDatumi_3(datumiKroz3Meseci);     //priprema za stampu
        setZa3Meseci(datumZa3Meseci.toDateString());
    
        const datumZa6Meseci = new Date(izabraniDatum);
        datumZa6Meseci.setMonth(datumZa6Meseci.getMonth() + 6); // Dodaj 6 meseci
        const datumiKroz6Meseci=generisiDatumeNovo(izabraniDatum, datumZa6Meseci); //priprema za stampu
        setDatumi_6(datumiKroz6Meseci);     //priprema za stampu
        setZa6Meseci(datumZa6Meseci.toDateString());

    
    }, [izabraniDatum]);

    const konacnaStampaUKonzoli = (period) => {
        let datumiZaStampu;
  
          switch (period) {
            case 1:
                  console.log('Lista datuma za mesec dana:');     
                  datumiZaStampu = datumi_1;
                  break;          
            case 3:
                  console.log('Lista datuma za 3 meseca:');
                  datumiZaStampu = datumi_3;
                  break;          
            case 6:
                  console.log('Lista datuma za 6 meseca:');
                  datumiZaStampu = datumi_6;
                  break;       
            default:
                  return <p>Niste odabrali period.</p>;
          }
  
          datumiZaStampu.forEach((datum) => {
            console.log(formatirajDatumKonzola(datum));
          });    
          return null;
      };
    return ( 
        <div>
                {konacnaStampaUKonzoli(period)}  
        </div>
     );
}
 
export default ListajPeriodDatuma;