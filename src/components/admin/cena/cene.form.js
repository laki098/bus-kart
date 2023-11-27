import React, { useState, useEffect } from "react";
import CeneLogic from "./cene.logic";
import CeneApi from "../../../api/cene.api";
import "./cene.css";
import { ToastContainer } from "react-toastify";


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
                krajnjaStanicaR: formData.get("krajnjaStanicaR"),
                cenaKarte: formData.get("cenaKarte"),
            };
            ceneLogic.editCene(data);
        }
    };


    


    return (
        <>
        <form onSubmit={submitHandler} className="cene-form">
        <div>
            <div className="naslov-cene"> 
                {mode === "add" ? (
                    <>Nova cena</>
                ) : (
                    <>Izmeni cenu</>
                )}
            </div>
            <div>
            <div><label className="cene-labela">Pocetna Stanica</label></div>
            <input 
            defaultValue={cene.pocetnaStanica}
            type="text"
            name="pocetnaStanica"
            className="input-cene"
            onChange={ceneLogic.changeHandler}/>
            </div>
            <div>
                <div><label className="cene-labela">Krajnja Stanica</label></div>
                <input
                defaultValue={cene.krajnjaStanicaR}
                type="text"
                name="krajnjaStanicaR"
                className="input-cene"
                onChange={ceneLogic.changeHandler} />
            </div>
            <div>
               <div> <label className="cene-labela">Cena</label></div>
                <input
                defaultValue={cene.cenaKarte}
                type="number"
                name="cenaKarte"
                className="input-cene"
                onChange={ceneLogic.changeHandler} />
            </div>
            <div>
                <button /* onClick={back} */ type="submit" className="buttonSwitch">
                    {mode === "add" ? (
                        <>Dodaj</>
                    ) : (
                        <> Zameni </>
                    )}
                </button>
            </div>
        </div>
        </form>
        <ToastContainer />
        </>
     );
}
 
export default CeneForm;