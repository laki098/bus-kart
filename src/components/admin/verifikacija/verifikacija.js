import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "./verifikacija.css";

const Verifikacija = () => {
    const [rezervacija, setRezervacija] = useState(null);

    const { id } = useParams();

    const getRezervacija = async () => {
        try {
            const response = await fetch(`http://localhost:5000/rezervacije/${id}`);
            const data = await response.json();
            setRezervacija(data.rezervacija);
        } catch (error) {
            console.error("Greška prilikom dohvatanja rezervacije:", error);
        }
    };
    console.log()

    useEffect(() => {
        getRezervacija();
    }, []);

    return (
        <div className={rezervacija?.cekiran ? 'crvena-pozadina' : 'zelena-pozadina'}>
            {rezervacija ? (
                <div>
                    <h1>Status karte</h1>
                    <p className='verifikacija-p'>
                        Status karte: {rezervacija.cekiran ? 'Karta je iskorišćena' : 'Karta nije iskorišćena.'}
                    </p>
                    <p className='verifikacija-p'>Datum polaska: {rezervacija.datumPolaska}</p>
                    <p className='verifikacija-p'>Vreme polaska: {rezervacija.vremePolaska}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Verifikacija;