import React, { useState, useEffect } from "react";

const ListajJSON_Konzola = ({ valueDate, period }) => {
    const [izabraniDatum, setIzabraniDatum] = useState(new Date(valueDate));


    const formatirajDatumKonzola = (datum) => {
        const godina = datum.getFullYear();
        const mesec = (datum.getMonth() + 1).toString().padStart(2, '0'); // Dodajte nulu ispred jednocifrenih meseci
        const dan = datum.getDate().toString().padStart(2, '0'); // Dodajte nulu ispred jednocifrenih dana
        return `${godina}-${mesec}-${dan}`;
    };


    const [datumi, setDatumi] = useState([]);

    useEffect(() => {
            // Ažuriraj izabraniDatum kada se valueDate promeni
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
        setDatumi(generisaniDatumi);
    
        // Prikaz niza datuma u konzoli kao JSON string
        console.log("Lista datuma u JSON formatu:");
        console.log(JSON.stringify(generisaniDatumi.map(formatirajDatumKonzola), null, 2));
    }, [izabraniDatum, period]);

    

    return ( 
        <div></div>

     );
}
 
export default ListajJSON_Konzola;