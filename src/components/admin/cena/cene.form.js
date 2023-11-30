import React, { useState, useEffect } from "react";
import CeneLogic from "./cene.logic";
import CeneApi from "../../../api/cene.api";
import "./cene.css";
import { ToastContainer } from "react-toastify";
import helpers from "../../../helpers/helpers";


const CeneForm = ({mode, id}) => {

    const [cene, setCene] = useState({});
    const ceneLogic = CeneLogic();
    const izmeniCene = async () => {
        try {
            const response = await CeneApi().filterCeneId(id);
            const data = response.data;
        
            setCene(data.cena);
        } catch (error) {
          console.error("Greška prilikom izmene cena:", error);
        }
      };

    useEffect(() => {
        if (mode == "edit") {
            izmeniCene();
        }
    }, []);

    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");
    const [stanice, setStanice] = useState([]);


    const getStanice = async () => {
        const response = await fetch("http://localhost:5000/stanica");
        const data = await response.json();
        
    
        const a1 = data.stanice.map((item) => {
          return { naziv: item.naziv, id: item.id };
        });
    
        const a2 = a1 //
          .map((item) => item.naziv) //Uradjen filter da se u selektu ne ponavljaju linije
          .filter(helpers.filterUnique);
    
        setStanice(a2);
        setVal1(a2[0]);
        setVal2(a2[1]);
      };
    
      useEffect(() => {
        getStanice(); //?Prilikom ucitavanja stranice da pozove funkciju get stanice
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
            <select
               name="pocetnaStanica"
               className="input-cene"
               defaultValue={cene.pocetnaStanica}
               onChange={ceneLogic.changeHandler} 
            >     
               <option className="medjustanica">{cene.pocetnaStanica}</option>
                     {stanice.map((stanica) => {
                        if(stanica !== cene.pocetnaStanica) {
                            return (
                     <option key={stanica} value={stanica}>
                               {stanica}
                      </option>
                   );
                }
                })}
             </select>
            </div>
            <div>
                <div><label className="cene-labela">Krajnja Stanica</label></div>
                <select
                   name="krajnjaStanicaR"
                   className="input-cene"
                   defaultValue={cene.krajnjaStanicaR}
                   onChange={ceneLogic.changeHandler} 
                
                 >
                    <option className="medjustanica">{cene.krajnjaStanicaR}</option>
                     {stanice.map((stanica) => {
                        if(stanica !== cene.krajnjaStanicaR) {
                            return (
                     <option key={stanica} value={stanica}>
                               {stanica}
                      </option>
                   );
                }
                })}
                 </select>
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
                <button  onClick={back}   type="submit" className="buttonSwitch">
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