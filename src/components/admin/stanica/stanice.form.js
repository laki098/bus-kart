import React, { useState, useEffect } from "react";
import StaniceLogic from "./stanice.logic";
import StaniceApi from "../../../api/stanice.api";


const StaniceForm  = ({mode, id}) => {

    const [stanice, setStanice] = useState({});
    const staniceLogic = StaniceLogic();
    const izmeniStanice = async () => {
        const response = await StaniceApi().filterStaniceId(id);
        const data = await response.data;

        setStanice(data.stanice);
    };

    useEffect(() => {
        if(mode == "edit") {
            izmeniStanice();
        }
    }, []);

    const back = () => {
        window.history.back();
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if(mode === "add") {
          staniceLogic.upisStanice();  
        } else if (mode === "edit") {
            const formData = new FormData(event.target);
            const data = {
                id: id,
                naziv: formData.get("naziv"),
                adresa: formData.get("adresa"),
            };
            staniceLogic.editStanice(data);
        }
    }



    return ( 
    <div>
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    {mode === "add" ? (
                        <p>Dodajte novu Stanicu</p>
                    ) : (
                        <p>Edituj stanicu</p>
                    )}
                    <label>Naziv Stanice</label>
                    <input 
                    defaultValue={stanice.naziv}
                    type="text"
                    placeholder="naziv"
                    required
                    name="naziv"
                    onChange={staniceLogic.changeHandler}
                    />
                    <label>Adresa</label>
                    <input
                    defaultValue={stanice.adresa}
                    type="text"
                    placeholder="adresa"
                    required
                    name="adresa"
                    onChange={staniceLogic.changeHandler}
                    />
                    <button
                   /*  onClick={back} */
                    type="submit"
                    >
                        {mode === "add" ? (<p>Dodaj</p>) : (
                            <p>Sacuvaj</p>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
        );
};
 
export default StaniceForm;