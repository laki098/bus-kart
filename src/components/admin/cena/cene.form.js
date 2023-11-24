import React, { useState, useEffect } from "react";
import CeneLogic from "./cene.logic";
import CeneApi from "../../../api/cene.api";


const CeneForm = ({mode, id}) => {

    const [cene, setCene] = useState({});
    const ceneLogic = CeneLogic();
    const izmeniCene = async () => {
        try {
            const response = await CeneApi().filterCeneId(id);
            const data = response.data;
            setCene(data.cene);
        } catch(error) {
            console.error("Greska prilikom izmene cene:", error);
        }
    };

    useEffect(() => {
        if (mode == "edit") {
            izmeniCene();
        }
    }, []);

    const back = () => {
        setTimeout(() => {
          window.location.href = "/cene.initial";
        }, 2000);
      };

    const submitHandler = (event) => {
        event.preventDefault();

        if (mode === "add") {
            ceneLogic.upisCene();
        } else if (mode === "edit") {
            const formData = new FormData(event.target);
            const data = {
                id:id,
                pocetnaStanica: formData.get("pocetnaStanica"),
                kranjeStaniceR: formData.get("kranjeStaniceR"),
                cenaKarte: formData.get("cenaKarte"),
            };
            ceneLogic.editCene(data);
        }
    };


    


    return (
        <form onSubmit={submitHandler}>
        <div>
            <div>
                {mode === "add" ? (
                    <>Nova cena</>
                ) : (
                    <>Izmeni cenu</>
                )}
            </div>
            <div>
            <label>Pocetna Stanica</label>
            <input 
            defaultValue={cene.pocetnaStanica}
            type="text"
            name="pocetnaStanica"
            className=""
            onChange={ceneLogic.changeHandler}/>
            </div>
            <div>
                <label>Krajnja Stanica</label>
                <input
                defaultValue={cene.krajnjaStanicaR}
                type="text"
                name="krajnjaStanicaR"
                className=""
                onChange={ceneLogic.changeHandler} />
            </div>
            <div>
                <label>Cena</label>
                <input
                defaultValue={cene.cenaKarte}
                type="text"
                name="cenaKarte"
                className=""
                onChange={ceneLogic.changeHandler} />
            </div>
            <div>
                <button onClick={back} type="submit">
                    {mode === "add" ? (
                        <>Dodaj</>
                    ) : (
                        <> Zameni </>
                    )}
                </button>
            </div>
        </div>
        </form>
     );
}
 
export default CeneForm;